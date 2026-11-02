// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: telegram-login-CUVBmqvA (10)
import { useTranslation, Trans } from "react-i18next";
import * as b from "react";
import { K, z, j, V, B } from "@/modules/auth/components/company-select-step";
import { ee } from "@/modules/auth/utils/auth-errors";
import { Qy } from "@/utils/error-handler";
import * as v from "react/jsx-runtime";
import { h as $, G } from "@/modules/auth/components/auth-step";
import { Button } from "antd";
import { WU } from "@/modules/auth/components/icons";
import Qe from "react-qr-code";
import { O } from "@/modules/auth/components/otp-input";
import { useMutation } from "react-query";
import { Es } from "@/services/api/client";
import { Jt } from "@/services/api/endpoints";
const ze = ["uz", "kr", "ru", "en", "tr", "tj", "ky"];
const Ge = "uz";
const Fe = (botUrl, f) => {
  const n = f?.slice(0, 2).toLowerCase();
  return `${botUrl}_${n && ze.includes(n) ? n : Ge}`;
};
function Ue(u) {
  return useMutation(async (f) => B(await Es.post(Jt.TELEGRAM_VERIFY, f)), {
    onError: u ?? Qy,
  });
}
const length = 5;
const Xe = 60;
const Ye = () => window.matchMedia("(pointer: coarse) and (hover: none)").matches;
const $e = [
  "login.Telefon_kamerasi_bilan_QR_kodni_skanerlang",
  "login.Birinchi_marta_kirsangiz_botga_raqamingizni_yuboring",
  "login.Bot_yuborgan_5_xonali_kodni_pastga_kiriting",
];
const Ve = [
  "login.<b>Telegramni_ochish</b>_tugmasini_bosing",
  "login.Birinchi_marta_kirsangiz_botga_raqamingizni_yuboring",
  "login.Bot_xabaridagi_<b>Davom_etish</b>_tugmasini_bosing_yoki_kodni_kiriting",
];
function TelegramWaitingStep({
  session,
  secondsLeft,
  onVerified,
  onSessionLost,
  onDisabled,
  onBack,
}) {
  const { t: t_1, i18n } = useTranslation();
  const [t] = b.useState(Ye);
  const e = Fe(session.botUrl, i18n.resolvedLanguage ?? i18n.language);
  const [s, setS] = b.useState(false);
  const l = K();
  const [value, setValue] = b.useState("");
  const [c, setC] = b.useState(null);
  const [key, setKey] = b.useState(0);
  b.useEffect(() => {
    if (!t || !s) {
      return;
    }
    const E = () => {
      if (document.visibilityState === "visible") {
        setKey((x) => x + 1);
      }
    };
    document.addEventListener("visibilitychange", E);
    return () => document.removeEventListener("visibilitychange", E);
  }, [t, s]);
  const y = Ue((E) => {
    const x = z(E);
    if (x === j.OTP_CODE_INVALID) {
      setC(ee(E));
      setValue("");
      setKey((w) => w + 1);
      return;
    }
    Qy(E);
    if (x === j.OTP_TOO_MANY_ATTEMPTS) {
      onSessionLost();
    }
    if (x === j.LOGIN_METHOD_DISABLED) {
      onDisabled();
    }
  });
  const onComplete = async (code) => {
    if (code.length !== length || y.isLoading) {
      return;
    }
    setC(null);
    const x = await y
      .mutateAsync({
        sessionKey: session.sessionKey,
        code,
      })
      .catch(() => null);
    if (x) {
      onVerified(x);
    }
  };
  const onClick = () => {
    setS(true);
    l.restart(Xe);
  };
  const RComponent = () => {
    if (s) {
      if (l.isFinished) {
        return (
          <span className="text-error-700">
            {t_1(
              t
                ? "login.Kod_muddati_tugadi_Telegramni_qayta_oching"
                : "login.Kod_muddati_tugadi_QR_ni_qayta_skanerlang"
            )}
          </span>
        );
      }
      return (
        <Trans
          i18nKey="login.Kod_<b>{{time}}</b>_dan_keyin_eskiradi"
          values={{
            time: V(l.seconds),
          }}
          components={{
            b: <b className="font-semibold text-fg" />,
          }}
        />
      );
    }
    return (
      <Trans
        i18nKey="login.Havola_<b>{{time}}</b>_dan_keyin_eskiradi"
        values={{
          time: V(secondsLeft),
        }}
        components={{
          b: <b className="font-semibold text-fg" />,
        }}
      />
    );
  };
  const L = t ? Ve : $e;
  return (
    <$
      title={t_1("login.Telegramda_davom_eting")}
      description={t_1(
        t ? "login.Telegram_kirish_tavsifi_telefon" : "login.Telegram_kirish_tavsifi_kompyuter"
      )}
      onBack={onBack}
    >
      <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
        {L.map((E, x) => (
          <li key={E} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-[#00775F]"
            >
              {x + 1}
            </span>
            <span className="text-sm leading-6 text-fg">
              <Trans
                i18nKey={E}
                components={{
                  b: <b className="font-semibold" />,
                }}
              />
            </span>
          </li>
        ))}
      </ol>
      {t ? (
        <Button
          type={s ? "default" : "primary"}
          href={e}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className="!flex h-12 items-center justify-center gap-2 !rounded-lg text-[15px] font-semibold"
        >
          <WU />
          {t_1(s ? "login.Telegramni_qayta_ochish" : "login.Telegramni_ochish")}
        </Button>
      ) : (
        <figure className="m-0 flex flex-col items-center gap-2">
          <div className="rounded-xl border border-solid border-[theme(colors.gray.200)] bg-[theme(colors.white)] p-2">
            <Qe value={e} fgColor="rgb(0, 0, 0)" bgColor="rgb(255, 255, 255)" size={148} />
          </div>
          <figcaption className="flex flex-col items-center gap-1 text-[13px] text-fg-muted">
            {t_1("login.Telefon_kamerasi_bilan_skanerlang")}
            <a
              href={e}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClick}
              className="font-semibold text-[color:var(--ant-primary-color)]"
            >
              {t_1("login.Kompyuterdagi_Telegramda_ochish")}
            </a>
          </figcaption>
        </figure>
      )}
      <fieldset className="m-0 flex flex-col items-center gap-2 border-0 p-0">
        <legend className="mb-2 p-0 text-center text-sm font-medium text-fg">
          {t_1("login.Botdan_kelgan_5_xonali_kod")}
        </legend>
        <O
          key={key}
          length={length}
          value={value}
          onChange={(E) => {
            setValue(E);
            setC(null);
          }}
          onComplete={onComplete}
          error={!!c}
          disabled={y.isLoading}
          autoFocus={!t || s}
        />
        {c ? <G>{c}</G> : null}
        <p className="m-0 text-center text-[13px] leading-[19px] text-fg-muted">{RComponent()}</p>
      </fieldset>
      {s && l.isFinished ? null : (
        <p className="m-0 border-0 border-t border-solid border-line pt-4 text-center text-[13px] leading-[19px] text-fg-muted">
          {t_1(
            t
              ? "login.Kod_kelmadimi_Telegramni_qayta_oching"
              : "login.Kod_kelmadimi_QR_ni_qayta_skanerlang"
          )}
        </p>
      )}
    </$>
  );
}
export { TelegramWaitingStep as We };
