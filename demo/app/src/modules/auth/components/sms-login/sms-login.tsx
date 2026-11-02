// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: sms-login-C3nOBmnF (1)
import * as v from "react";
import { GU } from "@/modules/auth/hooks/use-recaptcha";
import { i0 } from "@/services/analytics";
import * as h from "react/jsx-runtime";
import { p1 as P1 } from "@/modules/auth/components/sms-login/sms-code-step";
import { se as Cd } from "@/modules/auth/components/company-select-step";
import { W1 } from "@/modules/auth/components/sms-login/sms-phone-step";
import { ld as Ld } from "@/modules/auth/components/invisible-recaptcha";
function SmsLogin({ onExit, onTelegram, onSessionLimit, onDesktopAgentError }) {
  const [r, setR] = v.useState({
    name: "phone",
  });
  const [phone, setPhone] = v.useState("");
  const { recaptchaRef, getFreshRecaptchaToken, resetRecaptcha } = GU();
  const getRecaptchaToken = v.useCallback(async () => {
    const m = await getFreshRecaptchaToken().catch(() => null);
    if (!m) {
      resetRecaptcha();
      i0({
        reason: "execute_async_rejected",
      });
    }
    return m;
  }, [getFreshRecaptchaToken, resetRecaptcha]);
  const UComponent = () => {
    switch (r.name) {
      case "code":
        return (
          <P1
            phone={phone}
            sent={r.sent}
            onVerified={(selection) =>
              setR({
                name: "company",
                selection,
              })
            }
            onChangePhone={() =>
              setR({
                name: "phone",
              })
            }
            onPassword={onExit}
            getRecaptchaToken={getRecaptchaToken}
          />
        );
      case "company":
        return (
          <Cd
            method="sms"
            selection={r.selection}
            onRestart={onExit}
            onSessionLimit={onSessionLimit}
            onDesktopAgentError={onDesktopAgentError}
          />
        );
      default:
        return (
          <W1
            phone={phone}
            onPhoneChange={setPhone}
            onSent={(sent) =>
              setR({
                name: "code",
                sent,
              })
            }
            onBack={onExit}
            onTelegram={onTelegram}
            getRecaptchaToken={getRecaptchaToken}
          />
        );
    }
  };
  return (
    <div>
      {UComponent()}
      {r.name === "company" ? null : <Ld ref={recaptchaRef} />}
    </div>
  );
}
export default SmsLogin;
