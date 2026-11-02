// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: company-select-step-Cjab7zDr (1)
import { useTranslation } from "react-i18next";
import * as s from "react/jsx-runtime";
import { h as H, G } from "@/modules/auth/components/auth-step";
import { Button } from "antd";
function SessionInvalid({ onRestart }) {
  const { t } = useTranslation();
  return (
    <H title={t("login.Kirishni_qaytadan_boshlang")}>
      <G variant="box">{t("global.OTP_SELECTION_INVALID")}</G>
      <p className="m-0 text-sm text-fg-muted">
        {t("login.Kompaniyani_tanlash_vaqti_tugadi_yoki_seans_ishlatilgan")}
      </p>
      <Button type="primary" onClick={onRestart} className="h-11 !rounded-lg font-semibold">
        {t("login.Kirishga_qaytish")}
      </Button>
    </H>
  );
}
export { SessionInvalid as U };
