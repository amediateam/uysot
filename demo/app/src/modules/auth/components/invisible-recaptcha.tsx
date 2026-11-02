// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: sms-login-C3nOBmnF (2)
import * as v from "react";
import { useTranslation } from "react-i18next";
import * as h from "react/jsx-runtime";
import Md from "react-google-recaptcha";
import { rF as sitekey } from "@/pages/login/Login";
const InvisibleRecaptcha = v.forwardRef((e, ref) => {
  const { i18n } = useTranslation();
  return (
    <Md
      key={i18n.language}
      ref={ref}
      sitekey={sitekey}
      hl={i18n.language === "tj" ? "ru" : i18n.language}
      size="invisible"
      data-sentry-component="InvisibleRecaptcha"
    />
  );
});
InvisibleRecaptcha.displayName = "InvisibleRecaptcha";
export { InvisibleRecaptcha as ld };
