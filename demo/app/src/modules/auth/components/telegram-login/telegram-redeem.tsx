// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: telegram-redeem-BCWpxEWP (3)
import { useTranslation } from "react-i18next";
import * as n from "react";
import { z, j, se as G1, B } from "@/modules/auth/components/company-select-step";
import * as t from "react/jsx-runtime";
import { h as M, G } from "@/modules/auth/components/auth-step";
import { ee } from "@/modules/auth/utils/auth-errors";
import { Button, Spin } from "antd";
import { useMutation } from "react-query";
import { Es } from "@/services/api/client";
import { Jt } from "@/services/api/endpoints";
import { Qy } from "@/utils/error-handler";
function w(e) {
  return useMutation(
    async (token) =>
      B(
        await Es.post(Jt.TELEGRAM_REDEEM, {
          token,
        })
      ),
    {
      onError: e ?? Qy,
    }
  );
}
const S = () => {
  const e = new URL(window.location.href);
  const a = e.searchParams.get("token");
  e.searchParams.delete("token");
  e.searchParams.delete("device");
  window.history.replaceState(window.history.state, "", `${e.pathname}${e.search}${e.hash}`);
  return a;
};
function TelegramRedeem({ onExit, onSessionLimit, onDesktopAgentError }) {
  const { t } = useTranslation();
  const [i, setI] = n.useState(null);
  const [s, setS] = n.useState(null);
  const dRef = n.useRef(false);
  const h = w((error) => {
    setS({
      error,
      linkExpired: z(error) === j.OTP_SELECTION_INVALID,
    });
  });
  n.useEffect(() => {
    if (dRef.current) {
      return;
    }
    dRef.current = true;
    const o = S();
    if (!o) {
      setS({
        linkExpired: true,
      });
      return;
    }
    h.mutateAsync(o)
      .then(setI)
      .catch(() => {});
  }, []);
  if (i) {
    return (
      <div>
        <G1
          method="telegram"
          selection={i}
          onRestart={onExit}
          onSessionLimit={onSessionLimit}
          onDesktopAgentError={onDesktopAgentError}
        />
      </div>
    );
  }
  if (s) {
    return (
      <div>
        <M
          title={
            s.linkExpired
              ? t("login.Bu_havola_endi_ishlamaydi")
              : t("login.Kirishni_qaytadan_boshlang")
          }
          description={
            s.linkExpired ? t("login.Havola_ishlatilgan_yoki_muddati_tugagan") : undefined
          }
        >
          <G variant="box">{s.error ? ee(s.error) : t("global.OTP_SELECTION_INVALID")}</G>
          <Button
            type="primary"
            onClick={onExit}
            className="h-11 !rounded-lg text-base font-semibold"
          >
            {t("login.Kirishga_qaytish")}
          </Button>
        </M>
      </div>
    );
  }
  return (
    <div>
      <M title={t("login.Kirilmoqda")} description={t("login.Telegram_havolasi_tekshirilmoqda")}>
        <Spin className="self-center" />
      </M>
    </div>
  );
}
export default TelegramRedeem;
