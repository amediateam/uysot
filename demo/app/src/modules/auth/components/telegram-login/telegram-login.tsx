// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: telegram-login-CUVBmqvA (2)
import { useTranslation } from "react-i18next";
import * as b from "react";
import { K, se as De, B } from "@/modules/auth/components/company-select-step";
import { Qy } from "@/utils/error-handler";
import { Ine } from "@/modules/auth/login-broadcast";
import * as v from "react/jsx-runtime";
import { Me } from "@/modules/auth/components/telegram-login/telegram-expired";
import { We } from "@/modules/auth/components/telegram-login/telegram-waiting-step";
import { h as $ } from "@/modules/auth/components/auth-step";
import { Spin } from "antd";
import { useMutation } from "react-query";
import { Es } from "@/services/api/client";
import { Jt } from "@/services/api/endpoints";
function ke(u) {
  return useMutation(
    async () =>
      B(
        await Es.post(Jt.TELEGRAM_SESSION, {
          device: "WEB",
        })
      ),
    {
      onError: u ?? Qy,
    }
  );
}
function TelegramLogin({ onExit, onSms, onSessionLimit, onDesktopAgentError }) {
  const { t } = useTranslation();
  const [a, setA] = b.useState(null);
  const [r, setR] = b.useState(null);
  const [e, setE] = b.useState(false);
  const i = K();
  const lRef = b.useRef(false);
  const m = ke((c) => {
    Qy(c);
    onExit();
  });
  const onRenew = async () => {
    setE(false);
    const c = await m.mutateAsync().catch(() => null);
    if (c) {
      setA(c);
      i.restart(c.expiresInSec);
    }
  };
  b.useEffect(() => {
    if (!lRef.current) {
      lRef.current = true;
      onRenew();
    }
  }, []);
  b.useEffect(() => {
    if (!r) {
      return Ine(() => window.location.reload());
    }
  }, [r]);
  if (r) {
    return (
      <div>
        <De
          method="telegram"
          selection={r}
          onRestart={onExit}
          onSessionLimit={onSessionLimit}
          onDesktopAgentError={onDesktopAgentError}
        />
      </div>
    );
  }
  if (e || (a && i.isFinished)) {
    return (
      <div>
        <Me onRenew={onRenew} isRenewing={m.isLoading} onSms={onSms} onPassword={onExit} />
      </div>
    );
  }
  if (a) {
    return (
      <div>
        <We
          key={a.sessionKey}
          session={a}
          secondsLeft={i.seconds}
          onVerified={setR}
          onSessionLost={() => setE(true)}
          onDisabled={onExit}
          onBack={onExit}
        />
      </div>
    );
  }
  return (
    <div>
      <$ title={t("login.Telegramda_davom_eting")} onBack={onExit}>
        <Spin className="self-center" />
      </$>
    </div>
  );
}
export default TelegramLogin;
