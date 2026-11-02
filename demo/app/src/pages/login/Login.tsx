// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (8)
import { Form, Spin } from "antd";
import * as v from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Ot } from "@/constants/routes";
import { useTranslation } from "react-i18next";
import { XU } from "@/modules/auth/hooks/use-sign-in";
import { eF } from "@/store/hooks";
import { GU } from "@/modules/auth/hooks/use-recaptcha";
import { f3 } from "@/pages/login/hooks/use-desktop-agent-check";
import { i0 } from "@/services/analytics";
import { FF } from "@/utils/recaptcha";
import { ce } from "@/utils/storage";
import { Ar } from "@/constants/storage-keys";
import { Tt } from "@/utils/current-user";
import { wh } from "@/utils/redirect-after-login";
import * as A from "react/jsx-runtime";
import { Lo } from "@/components/loading/Loading";
import Ft from "@/pages/login/Login.module.css";
import { c3 as C3 } from "@/pages/login/components/login-form";
import { qU as QU } from "@/modules/auth/components/login-methods";
import zF from "query-string";
import { HU } from "@/modules/active-session/components/session-limit-modal";
import { hH as HH } from "@/modules/theme/ThemeToggle";
import { u3 as U3 } from "@/pages/login/components/login-language-switcher";
import { _s } from "@/with-error-boundary";
import { PH } from "@/pages/login/components/desktop-agent-login-gate";
import { NH } from "@/pages/login/components/local-network-permission-guide";
const env = import.meta.env;
const { VITE_RECAPTCHA_SITE_KEY } = env;
const IH = _s(PH);
const KH = _s(NH);
const H3 = v.lazy(() => import("@/modules/auth/components/sms-login/sms-login"));
const P3 = v.lazy(() => import("@/modules/auth/components/telegram-login/telegram-login"));
const V3 = v.lazy(() => import("@/modules/auth/components/telegram-login/telegram-redeem"));
function Login() {
  const [e] = Form.useForm();
  const [t, setT] = v.useState(true);
  const [n, setN] = v.useState(false);
  const [a, setA] = v.useState(false);
  const s = useLocation();
  const [l, setL] = v.useState(() => {
    if (s.pathname === Ot.LOGIN_TELEGRAM) {
      return "telegram-redeem";
    }
    return "password";
  });
  const uRef = v.useRef(null);
  const [d, setD] = v.useState(false);
  const { i18n, t: t_1 } = useTranslation();
  const y = useNavigate();
  const m = XU();
  const b = eF((D) => D?.userReducer?.user?.role?.permissions);
  const { recaptchaRef, getFreshRecaptchaToken, resetRecaptcha } = GU();
  const E = f3();
  const onFinish = async (D) => {
    setD(true);
    try {
      const recaptchaToken = await getFreshRecaptchaToken().catch((H) => {
        i0({
          reason: FF(H) ? "execute_timeout" : "execute_async_rejected",
        });
        throw H;
      });
      if (!recaptchaToken) {
        i0({
          reason: "execute_async_rejected",
        });
        return;
      }
      if (
        (
          await m.mutateAsync({
            ...D,
            recaptchaToken,
          })
        )?.sessionLimitReached
      ) {
        setA(true);
      }
    } catch (error) {
      resetRecaptcha();
      E.open(error, async () => {
        m.reset();
        localStorage.removeItem("message");
        await onFinish(D);
      });
    } finally {
      setD(false);
    }
  };
  const onFinishFailed = (D) => {
    console.log("Failed:", D);
  };
  const onChange = (D) => {
    i18n.changeLanguage(D);
  };
  const onClick = () => {
    setN(false);
  };
  const onRestorePassword = () => {
    y(Ot.RESTORE_PASSWORD);
  };
  const N = async () => {
    if (uRef.current) {
      await uRef.current().catch(() => {});
      return;
    }
    await onFinish(e.getFieldsValue());
  };
  const onSessionLimit = v.useCallback((D) => {
    uRef.current = D;
    setA(true);
  }, []);
  const onExit = v.useCallback(() => {
    uRef.current = null;
    E.close();
    setL("password");
    if (s.pathname !== Ot.INDEX) {
      y(Ot.INDEX, {
        replace: true,
      });
    }
  }, [E.close, s.pathname, y]);
  const onTelegram = v.useCallback(() => setL("telegram"), []);
  const E_open = E.open;
  const onBack = () => {
    E.close();
    if (l === "password") {
      m.reset();
      localStorage.removeItem("message");
    }
  };
  v.useEffect(() => {
    if (ce.get(Ar) && Tt) {
      window.location.replace(wh(b || []));
    } else {
      setT(false);
    }
  }, []);
  if (t) {
    return <Lo />;
  }
  return (
    <div className={Ft.login}>
      {E.view ? <KH /> : null}
      <div className={Ft.login_container_div}>
        <div className={Ft.login_body}>
          <div className={Ft.login_scroll}>
            {l === "password" ? (
              <div className={E.view ? "hidden" : undefined}>
                <C3
                  form={e}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  onRestorePassword={onRestorePassword}
                  recaptchaRef={recaptchaRef}
                  recaptchaKey={VITE_RECAPTCHA_SITE_KEY}
                  hasError={!!m.error && !a && !E.view}
                  isLoading={m.isLoading || d}
                />
                <QU onSms={() => setL("sms")} onTelegram={onTelegram} />
              </div>
            ) : null}
            {l !== "password" ? (
              <div className={E.view ? "hidden" : "flex flex-col"}>
                <v.Suspense fallback={<Spin className="!my-10 self-center" />}>
                  {l === "sms" ? (
                    <H3
                      onExit={onExit}
                      onTelegram={onTelegram}
                      onSessionLimit={onSessionLimit}
                      onDesktopAgentError={E_open}
                    />
                  ) : null}
                  {l === "telegram" ? (
                    <P3
                      onExit={onExit}
                      onSms={() => setL("sms")}
                      onSessionLimit={onSessionLimit}
                      onDesktopAgentError={E_open}
                    />
                  ) : null}
                  {l === "telegram-redeem" ? (
                    <V3
                      onExit={onExit}
                      onSessionLimit={onSessionLimit}
                      onDesktopAgentError={E_open}
                    />
                  ) : null}
                </v.Suspense>
              </div>
            ) : null}
            {E.view ? (
              <IH
                view={E.view}
                onBack={onBack}
                onSwitchToDownload={() => E.setView("not_installed")}
                onSwitchToStart={() => E.setView("not_running")}
                onAgentReady={E.retryWithAgent}
                isRetryingLogin={m.isLoading}
              />
            ) : null}
            <Link
              to={zF.stringifyUrl({
                url: "/privacy-policy",
                query: {
                  lang: i18n.language,
                },
              })}
              className={Ft.footer}
            >
              {t_1("privacy_policies.Yuqoridagi_tugmani_bosish_orqali_siz_bizning")}{" "}
              <span> {t_1("privacy_policies.foydalanish_shartlari")}  </span>{" "}
              {t_1("privacy_policies.va")}{" "}
              <span>  {t_1("privacy_policies.maxfiylik_siyosatimizga")}</span>
            </Link>
          </div>
        </div>
        <HU
          visible={a}
          onClose={() => {
            setA(false);
            m.reset();
            if (uRef.current) {
              onExit();
            }
          }}
          onSignInSuccess={async () => N()}
        />
        <div
          className={`${Ft.privacyPoliciesMask} ${n ? Ft.privacyPoliciesMask_active : ""}`}
          onClick={onClick}
        />
        <div className={Ft.loginFooterActions}>
          <HH compact className="!ml-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]" />
          <U3 onChange={onChange} />
        </div>
      </div>
    </div>
  );
}
export { Login as g3, VITE_RECAPTCHA_SITE_KEY as rF };
