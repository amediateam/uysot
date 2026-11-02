// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (6)
import { ce } from "@/utils/storage";
import { Ar } from "@/constants/storage-keys";
const FCM_SW_AUTH_CACHE_NAME = "uysot-fcm-auth-v1";
const FCM_SW_AUTH_URL = "https://__uysot__/fcm-auth-session";
async function clearFcmSwAuthCache() {
  if (!(typeof window === "undefined" || !("caches" in window))) {
    try {
      await caches.delete(FCM_SW_AUTH_CACHE_NAME);
    } catch {}
  }
}
async function syncFcmSwAuthCacheFromLocalToken() {
  if (typeof window === "undefined" || !("caches" in window)) {
    return;
  }
  const e = !!ce.get(Ar);
  try {
    if (e) {
      await (
        await caches.open(FCM_SW_AUTH_CACHE_NAME)
      ).put(
        new Request(FCM_SW_AUTH_URL),
        new Response("1", {
          status: 200,
        })
      );
    } else {
      await caches.delete(FCM_SW_AUTH_CACHE_NAME);
    }
  } catch {}
}
const l9 = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      FCM_SW_AUTH_CACHE_NAME,
      FCM_SW_AUTH_URL,
      clearFcmSwAuthCache,
      syncFcmSwAuthCacheFromLocalToken,
    },
    Symbol.toStringTag,
    {
      value: "Module",
    }
  )
);
const c9 = {};
export { syncFcmSwAuthCacheFromLocalToken as kh, l9, clearFcmSwAuthCache as s9 };
