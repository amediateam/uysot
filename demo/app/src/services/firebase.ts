// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: firebase-DBDQKvII (17)
import { Wa } from "@/services/api/client";
import Jt from "query-string";
import tt from "i18next";
import { initializeApp } from "firebase/app";
import { isSupported, getAnalytics } from "firebase/analytics";
import {
  isSupported as isSupported_1,
  getMessaging,
  getToken,
  deleteToken,
} from "firebase/messaging";
import { ce } from "@/utils/storage";
import { Ar } from "@/constants/storage-keys";
import { kh, s9 } from "@/services/fcm-auth-cache";
import { Ha } from "@/store/index";
import { Cz } from "@/store/reducers/user";
const Ra = {
  PUSH_NOTIFICATION_TOKEN: "/v1/push-notification/token",
};
async function Na(token) {
  return (
    await Wa.post(
      Jt.stringifyUrl({
        url: Ra.PUSH_NOTIFICATION_TOKEN,
        query: {
          token,
          language: tt.language?.toUpperCase() || "UZ",
        },
      })
    )
  ).data;
}
const Pa = {
  apiKey: "AIzaSyD9D0ahCaZcKJ8Sb2LAqeTCiTkXS7ifi8s",
  authDomain: "uysot-dev-8e4cd.firebaseapp.com",
  projectId: "uysot-dev-8e4cd",
  storageBucket: "uysot-dev-8e4cd.firebasestorage.app",
  messagingSenderId: "552414123448",
  appId: "1:552414123448:web:7e7bae0408289193842b4d",
  measurementId: "G-1FD9SVWYVN",
};
export const firebaseApp = initializeApp(Pa);
let ae = null;
export function getFirebaseAnalytics() {
  if (!ae) {
    ae = isSupported()
      .then((e) => {
        if (e) {
          return getAnalytics(firebaseApp);
        }
        return null;
      })
      .catch(() => null);
  }
  return ae;
}
let oe = null;
export function getFirebaseMessaging() {
  if (!oe) {
    oe = (async () => {
      if (typeof window === "undefined") {
        return null;
      }
      if (await isSupported_1().catch(() => false)) {
        return getMessaging(firebaseApp);
      }
      return null;
    })();
  }
  return oe;
}
let he = null;
async function zt(e, t = false) {
  if (!(!ce.get(Ar) || (!t && he === e))) {
    try {
      await Na(e);
      he = e;
    } catch (error) {
      console.warn("[FCM] token registration failed", error);
    }
  }
}
export async function ensureNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  if (Notification.permission === "granted") {
    return true;
  }
  if (Notification.permission === "denied") {
    return false;
  }
  try {
    return (await Notification.requestPermission()) === "granted";
  } catch {
    return false;
  }
}
export async function initFirebaseFcmToken(e) {
  const t = e?.solicitPermission ?? false;
  try {
    if (typeof window === "undefined" || !ce.get(Ar)) {
      return null;
    }
    await kh();
    if (t) {
      if (!(await ensureNotificationPermission())) {
        return null;
      }
    } else if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      Notification.permission !== "granted"
    ) {
      return null;
    }
    const n = await getFirebaseMessaging();
    if (!n) {
      return null;
    }
    const vapidKey =
      "BKkuil1REv9wtdpWey3aNmdUvJ5UBKudcYqAn7VtPGFxyRNO_j0qEeIOBRRUAd5rMoqqDsCSZINmHfx5HNMCv9g".trim();
    if (!vapidKey) {
      return null;
    }
    const r = await getToken(n, {
      vapidKey,
    });
    if (r) {
      Ha.dispatch(Cz(r));
      zt(r);
    }
    return r;
  } catch (error) {
    console.warn("[FCM]", error);
    return null;
  }
}
export async function syncFcmPushTokenLanguage() {
  if (!ce.get(Ar)) {
    return;
  }
  const e = Ha.getState().userReducer?.firebaseToken ?? null;
  if (e) {
    await zt(e, true);
    return;
  }
  await initFirebaseFcmToken({
    solicitPermission: false,
  });
}
async function La() {
  if (!(typeof navigator === "undefined" || !navigator.serviceWorker?.getRegistrations)) {
    try {
      const e = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        e
          .filter((t) =>
            (t.active?.scriptURL ?? t.waiting?.scriptURL ?? t.installing?.scriptURL ?? "").includes(
              "firebase-messaging-sw"
            )
          )
          .map((t) => t.unregister())
      );
    } catch (error) {
      console.warn("[FCM] unregister messaging SW failed", error);
    }
  }
}
export async function disconnectFirebaseFcmPush() {
  he = null;
  await s9();
  try {
    const e = await getFirebaseMessaging();
    if (e) {
      await deleteToken(e);
    }
  } catch (error) {
    console.warn("[FCM] deleteToken failed", error);
  }
  await La();
  Ha.dispatch(Cz(null));
}
if (typeof window !== "undefined" && ce.get(Ar)) {
  kh();
  getFirebaseAnalytics();
  initFirebaseFcmToken({
    solicitPermission: false,
  });
}
tt.on("languageChanged", () => {
  syncFcmPushTokenLanguage();
});
