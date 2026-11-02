// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: sms-login-C3nOBmnF (2)
import "react-international-phone/style.css";
import { useTranslation } from "react-i18next";
import * as v from "react";
import { isValidPhoneNumber } from "libphonenumber-js";
import { sd } from "@/modules/auth/components/sms-login/api";
import { z, j } from "@/modules/auth/components/company-select-step";
import { ee } from "@/modules/auth/utils/auth-errors";
import { Qy } from "@/utils/error-handler";
import * as h from "react/jsx-runtime";
import { h as Ze, G, $ as $_1 } from "@/modules/auth/components/auth-step";
import { PhoneInput } from "react-international-phone";
import { v1 as countries } from "@/constants/countries";
import { twMerge } from "tailwind-merge";
import { Button } from "antd";
const style = {
  "--react-international-phone-height": "44px",
};
function SmsPhoneStep({ phone, onPhoneChange, onSent, onBack, onTelegram, getRecaptchaToken }) {
  const { t: t_1 } = useTranslation();
  const [$, set$] = v.useState(false);
  const [l, setL] = v.useState(false);
  const [c, setC] = v.useState(null);
  const m = isValidPhoneNumber(phone);
  const C = $ && !m;
  const g = sd((p) => {
    if (z(p) === j.LOGIN_METHOD_DISABLED) {
      setC(ee(p));
      return;
    }
    Qy(p);
  });
  const onSubmit = async (p) => {
    p.preventDefault();
    set$(true);
    if (!m || l || g.isLoading) {
      return;
    }
    setC(null);
    setL(true);
    const recaptchaToken = await getRecaptchaToken();
    setL(false);
    if (!recaptchaToken) {
      return;
    }
    const I = await g
      .mutateAsync({
        phone,
        recaptchaToken,
      })
      .catch(() => null);
    if (I) {
      onSent(I);
    }
  };
  return (
    <Ze
      title={t_1("login.SMS_kod_bilan_kirish")}
      description={t_1("login.Telefon_raqamingizni_kiriting_unga_kod_yuboramiz")}
      onBack={onBack}
    >
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="otp-phone" className="text-sm font-medium text-fg">
            {t_1("login.Telefon_raqam")}
          </label>
          <PhoneInput
            defaultCountry="uz"
            countries={countries}
            value={phone}
            onChange={(p) => {
              onPhoneChange(p);
              setC(null);
            }}
            style={style}
            inputClassName={twMerge(
              "ant-input !rounded-l-none grow !text-base",
              C && "!border-error-500"
            )}
            inputProps={{
              id: "otp-phone",
              name: "phone",
              autoComplete: "tel",
              autoFocus: true,
            }}
          />
          {C ? (
            <G>{t_1("login.Telefon_raqam_notogri")}</G>
          ) : (
            <p className="m-0 text-[13px] leading-[18px] text-fg-muted">
              {t_1("login.Boshqa_davlat_raqamini_toliq_yozing")}
            </p>
          )}
        </div>
        {c ? <G variant="box">{c}</G> : null}
        <Button
          type="primary"
          htmlType="submit"
          loading={l || g.isLoading}
          className="h-11 !rounded-lg text-base font-semibold"
        >
          {t_1("login.Kod_yuborish")}
        </Button>
        <div className="flex justify-center gap-4">
          <$_1 onClick={onBack}>{t_1("login.Parol_bilan_kirish")}</$_1>
          {onTelegram ? (
            <>
              <span aria-hidden="true" className="text-fg-muted">
                ·
              </span>
              <$_1 onClick={onTelegram}>{t_1("login.Telegram_bilan_kirish")}</$_1>
            </>
          ) : null}
        </div>
      </form>
    </Ze>
  );
}
export { SmsPhoneStep as W1 };
