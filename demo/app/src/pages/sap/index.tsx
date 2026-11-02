// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-CHe0gF2k (3)
import { useTranslation } from "react-i18next";
import * as r from "react";
import * as t from "react/jsx-runtime";
import { Lo } from "@/components/loading/Loading";
import { ZL } from "@/store/hooks";
import { useMutation } from "react-query";
import { Es } from "@/services/api/client";
import { Jt } from "@/services/api/endpoints";
import { ce } from "@/utils/storage";
import { Ar, _b, sa } from "@/constants/storage-keys";
import { EC } from "@/store/reducers/user";
import { DF } from "@/utils/redirect-after-login";
import { _s } from "@/with-error-boundary";
function E() {
  const a = ZL();
  return useMutation(
    async (code) => {
      const s = await Es.post(Jt.SAP_HANDOFF, {
        code,
      });
      if (s.data.accept) {
        return s?.data?.data;
      }
      return Promise.reject(s.data);
    },
    {
      onSuccess: async (e) => {
        ce.set(Ar, e.accessToken);
        ce.set(_b, JSON.stringify(e));
        await a(EC(e));
        ce.remove(sa);
        DF(e);
      },
      onError: () => {},
    }
  );
}
const Sap = () => {
  const { t } = useTranslation();
  const e = E();
  const sRef = r.useRef(new URLSearchParams(window.location.search).get("code"));
  const oRef = r.useRef(false);
  r.useEffect(() => {
    if (!oRef.current) {
      oRef.current = true;
      window.history.replaceState(null, "", window.location.pathname);
      if (sRef.current) {
        e.mutate(sRef.current);
      }
    }
  }, [e]);
  if (!sRef.current || e.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <div className="w-full max-w-[420px] rounded-xl border border-line bg-surface p-8 text-center">
          <h1 className="mb-2 text-lg font-semibold text-fg">{t("global.Ulanib_bolmadi")}</h1>
          <p className="text-sm text-fg-muted">{t("global.Kirish_kodi_yaroqsiz")}</p>
        </div>
      </div>
    );
  }
  return <Lo />;
};
const U = _s(Sap);
export default U;
