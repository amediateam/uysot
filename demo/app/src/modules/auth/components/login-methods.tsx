// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (1)
import { useTranslation } from "react-i18next";
import * as A from "react/jsx-runtime";
import { Button } from "antd";
import { zU as ZU, WU } from "@/modules/auth/components/icons";
function LoginMethods({ onSms, onTelegram }) {
  const { t: t_1 } = useTranslation();
  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center gap-3">
        <span className="h-px grow bg-line" />
        <span className="text-sm text-fg-muted">{t_1("login.yoki")}</span>
        <span className="h-px grow bg-line" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={onSms}
          className="!flex h-11 items-center justify-center gap-2 !rounded-lg font-semibold"
        >
          <ZU />
          {t_1("login.SMS_kod_bilan")}
        </Button>
        {onTelegram ? (
          <Button
            onClick={onTelegram}
            className="!flex h-11 items-center justify-center gap-2 !rounded-lg font-semibold"
          >
            <WU />
            {t_1("login.Telegram_bilan")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
export { LoginMethods as qU };
