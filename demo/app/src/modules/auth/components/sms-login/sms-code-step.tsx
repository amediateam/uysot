// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: sms-login-C3nOBmnF (3)
import { useTranslation, Trans } from "react-i18next";
import * as v from "react";
import { K, j, z, V, B } from "@/modules/auth/components/company-select-step";
import { Qy } from "@/utils/error-handler";
import { ee, te } from "@/modules/auth/utils/auth-errors";
import { sd } from "@/modules/auth/components/sms-login/api";
import * as h from "react/jsx-runtime";
import { Button } from "antd";
import { h as Ze, G, $ as $_1 } from "@/modules/auth/components/auth-step";
import { O as O_1 } from "@/modules/auth/components/otp-input";
import { useMutation } from "react-query";
import { Es } from "@/services/api/client";
import { Jt } from "@/services/api/endpoints";
function y1(e) {
  return useMutation(async (d) => B(await Es.post(Jt.OTP_VERIFY, d)), {
    onError: e ?? Qy,
  });
}
const length = 6;
function SmsCodeStep({ phone, sent, onVerified, onChangePhone, onPassword, getRecaptchaToken }) {
  const { t: t_1 } = useTranslation();
  const [$, set$] = v.useState("");
  const [phone_1, setPhone] = v.useState(sent.maskedPhone);
  const [c, setC] = v.useState(null);
  const [key, setKey] = v.useState(0);
  const [g, setG] = v.useState(false);
  const p = K(sent.resendAfterSec);
  const x = K(sent.codeTtlSec);
  const I = () => {
    set$("");
    setKey((E) => E + 1);
  };
  const O = y1((E) => {
    const kind = {
      [j.OTP_CODE_INVALID]: "invalid",
      [j.OTP_TOO_MANY_ATTEMPTS]: "attempts",
      [j.LOGIN_METHOD_DISABLED]: "disabled",
    }[z(E)];
    if (!kind) {
      Qy(E);
      return;
    }
    setC({
      kind,
      text: ee(E),
    });
    I();
  });
  const k = sd((E) => {
    const y = z(E);
    if (y === j.LOGIN_METHOD_DISABLED) {
      setC({
        kind: "disabled",
        text: ee(E),
      });
      return;
    }
    if (y === j.OTP_TOO_MANY_REQUESTS) {
      const S = te(E);
      if (S) {
        p.restart(S);
      }
    }
    Qy(E);
  });
  const loading = g || O.isLoading || k.isLoading;
  const N = c?.kind === "attempts" || c?.kind === "disabled";
  const b = x.isFinished && !N;
  const _ = async (E) => {
    setG(true);
    const y = await getRecaptchaToken();
    setG(false);
    if (y) {
      await E(y);
    }
  };
  const onComplete = async (code = $) => {
    if (!(code.length !== length || loading || N || b)) {
      setC(null);
      await _(async (y) => {
        const S = await O.mutateAsync({
          phone,
          code,
          recaptchaToken: y,
        }).catch(() => null);
        if (S) {
          onVerified(S);
        }
      });
    }
  };
  const onClick = async () => {
    if (!(loading || c?.kind === "disabled")) {
      await _(async (E) => {
        const y = await k
          .mutateAsync({
            phone,
            recaptchaToken: E,
          })
          .catch(() => null);
        if (y) {
          setPhone(y.maskedPhone);
          p.restart(y.resendAfterSec);
          x.restart(y.codeTtlSec);
          setC(null);
          I();
        }
      });
    }
  };
  const JComponent = () => {
    if (c?.kind === "disabled") {
      return (
        <Button
          type="primary"
          onClick={onPassword}
          className="h-11 !rounded-lg text-base font-semibold"
        >
          {t_1("login.Parol_bilan_kirish")}
        </Button>
      );
    }
    if (c?.kind === "attempts" || b) {
      return (
        <Button
          type="primary"
          onClick={onClick}
          loading={loading}
          disabled={!p.isFinished}
          className="h-11 !rounded-lg text-base font-semibold"
        >
          {p.isFinished
            ? t_1("login.Yangi_kod_olish")
            : `${t_1("login.Yangi_kod_olish")} (${V(p.seconds)})`}
        </Button>
      );
    }
    return (
      <Button
        type="primary"
        onClick={() => onComplete()}
        loading={loading}
        disabled={$.length !== length}
        className="h-11 !rounded-lg text-base font-semibold"
      >
        {t_1("login.Tasdiqlash")}
      </Button>
    );
  };
  return (
    <Ze
      title={t_1("login.Kodni_kiriting")}
      description=<Trans
        i18nKey="login.Kod_<b>{{phone}}</b>_raqamiga_yuborildi"
        values={{
          phone: phone_1,
        }}
        components={{
          b: <b className="font-semibold text-fg" />,
        }}
      />
      onBack={onChangePhone}
    >
      {N ? (
        <G variant="box" icon="lock">
          {c.text}
        </G>
      ) : null}
      <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
        <legend className="mb-2 p-0 text-sm font-medium text-fg">
          {t_1("login.6_xonali_kod")}
        </legend>
        <O_1
          key={key}
          length={length}
          value={$}
          onChange={(E) => {
            set$(E);
            if (c?.kind === "invalid") {
              setC(null);
            }
          }}
          onComplete={onComplete}
          error={!!c || b}
          disabled={N || b || O.isLoading}
          autoFocus
        />
        {b ? <G>{t_1("login.Kod_muddati_tugadi_yangi_kod_oling")}</G> : null}
        {!b && c?.kind === "invalid" ? <G>{c.text}</G> : null}
        {!b && !c ? (
          <p className="m-0 text-[13px] text-fg-muted">
            <Trans
              i18nKey="login.Kod_<b>{{time}}</b>_dan_keyin_eskiradi"
              values={{
                time: V(x.seconds),
              }}
              components={{
                b: <b className="font-semibold text-fg" />,
              }}
            />
          </p>
        ) : null}
      </fieldset>
      {N ? (
        <div className="flex justify-center gap-4">
          <$_1 onClick={onChangePhone}>{t_1("login.Raqamni_ozgartirish")}</$_1>
          <span aria-hidden="true" className="text-fg-muted">
            ·
          </span>
          <$_1 onClick={onPassword}>{t_1("login.Parol_bilan_kirish")}</$_1>
        </div>
      ) : (
        <div className="flex items-center justify-between text-sm">
          {p.isFinished ? (
            <$_1
              onClick={onClick}
              className={loading ? "pointer-events-none opacity-50" : undefined}
            >
              {t_1("login.Kodni_qayta_yuborish")}
            </$_1>
          ) : (
            <span className="text-fg-muted">
              {t_1("login.Kodni_qayta_yuborish")}:{" "}
              <b className="font-semibold text-fg">{V(p.seconds)}</b>
            </span>
          )}
          <$_1 onClick={onChangePhone}>{t_1("login.Raqamni_ozgartirish")}</$_1>
        </div>
      )}
      {JComponent()}
      {N ? null : (
        <div className="flex gap-3 rounded-[10px] border border-solid border-line bg-surface-muted px-3.5 py-3">
          <p className="m-0 text-sm text-fg-muted">
            {t_1("login.Kod_kelmadimi_raqamni_tekshiring_yoki")}{" "}
            <$_1 onClick={onPassword}>{t_1("login.parol_bilan_kiring")}</$_1>.
          </p>
        </div>
      )}
    </Ze>
  );
}
export { SmsCodeStep as p1 };
