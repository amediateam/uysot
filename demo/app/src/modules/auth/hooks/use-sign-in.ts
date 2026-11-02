// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (4)
import { ZL } from "@/store/hooks";
import * as v from "react";
import { ce } from "@/utils/storage";
import { Ar, _b } from "@/constants/storage-keys";
import { EC } from "@/store/reducers/user";
import { YU } from "@/modules/auth/login-broadcast";
import { DF } from "@/utils/redirect-after-login";
import { l9 } from "@/services/fcm-auth-cache";
import { useMutation } from "react-query";
import { Es } from "@/services/api/client";
import { Jt } from "@/services/api/endpoints";
import { AC } from "@/utils/error-handler";
import { Gc } from "@/services/analytics";
const d4 = (e) => {
  Gc("login_failed", e);
};
const f4 = (e) => {
  Gc("login_succeeded", e);
};
function useKU() {
  const e = ZL();
  return v.useCallback(
    async (t, method) => {
      ce.set(Ar, t.accessToken);
      ce.set(_b, JSON.stringify(t));
      await e(EC(t));
      if (t?.sessionLimitReached) {
        return;
      }
      f4({
        method,
      });
      YU();
      DF(t);
      const [{ syncFcmSwAuthCacheFromLocalToken }, { initFirebaseFcmToken }] = await Promise.all([
        Promise.resolve().then(() => l9),
        import("@/services/firebase"),
      ]);
      await syncFcmSwAuthCacheFromLocalToken();
      initFirebaseFcmToken({
        solicitPermission: false,
      });
    },
    [e]
  );
}
function XU() {
  const e = useKU();
  return useMutation(
    async (t) => {
      const r = await Es.post(Jt.SIGN_IN, t, {
        withCredentials: true,
      });
      if (r.data.accept) {
        return r?.data?.data;
      }
      return Promise.reject(r.data);
    },
    {
      onSuccess: (t) => e(t, "password"),
      onError: (t) => {
        const r = t?.response?.data ?? t;
        const message = AC(r?.errorMessage);
        localStorage.setItem("message", JSON.stringify(message));
        d4({
          message,
          errorCode: r?.code ?? r?.errorMessage?.messageCode,
        });
      },
    }
  );
}
export { useKU as KU, XU };
