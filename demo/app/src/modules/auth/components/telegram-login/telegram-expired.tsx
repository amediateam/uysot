// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: telegram-login-CUVBmqvA (1)
import { useTranslation } from "react-i18next";
import * as v from "react/jsx-runtime";
import { h as $, $ as $_1 } from "@/modules/auth/components/auth-step";
import { Button } from "antd";
function TelegramExpired({ onRenew, isRenewing, onSms, onPassword }) {
  const { t } = useTranslation();
  return (
    <$
      title={t("login.Havola_muddati_tugadi")}
      description={t("login.Havola_5_daqiqa_amal_qiladi_yangisini_oling")}
    >
      <Button
        type="primary"
        onClick={onRenew}
        loading={isRenewing}
        className="h-11 !rounded-lg text-base font-semibold"
      >
        {t("login.Yangi_havola_olish")}
      </Button>
      <div className="flex justify-center gap-4">
        <$_1 onClick={onSms}>{t("login.SMS_kod_bilan_kirish")}</$_1>
        <span aria-hidden="true" className="text-fg-muted">
          ·
        </span>
        <$_1 onClick={onPassword}>{t("login.Parol_bilan_kirish")}</$_1>
      </div>
    </$>
  );
}
export { TelegramExpired as Me };
