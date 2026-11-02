// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: company-select-step-Cjab7zDr (10)
import { useTranslation } from "react-i18next";
import * as i from "react";
import { Qy } from "@/utils/error-handler";
import * as s from "react/jsx-runtime";
import { U } from "@/modules/auth/components/session-invalid";
import { h as H1, $ } from "@/modules/auth/components/auth-step";
import { Spin } from "antd";
import { xne as F } from "@/modules/auth/components/icons";
import { b } from "@/modules/auth/utils/auth-errors";
import { KU } from "@/modules/auth/hooks/use-sign-in";
import { useMutation } from "react-query";
import { Es } from "@/services/api/client";
import { Jt } from "@/services/api/endpoints";
const z = (e) => b(e)?.messageCode;
const B = (response) => {
  if (response.data.accept) {
    return response.data.data;
  }
  return Promise.reject({
    response,
  });
};
const V = (e) => {
  const t = Math.floor(e / 60);
  const n = e % 60;
  return `${t}:${String(n).padStart(2, "0")}`;
};
const f = (e) => Math.max(0, Math.ceil((e - Date.now()) / 1000));
function useK(e = 0) {
  const [t, setT] = i.useState(() => Date.now() + e * 1000);
  const [a, setA] = i.useState(e);
  i.useEffect(() => {
    setA(f(t));
    if (f(t) === 0) {
      return;
    }
    const c = window.setInterval(() => {
      const d = f(t);
      setA(d);
      if (d === 0) {
        window.clearInterval(c);
      }
    }, 1000);
    return () => window.clearInterval(c);
  }, [t]);
  const restart = i.useCallback((c) => {
    setT(Date.now() + c * 1000);
    setA(c);
  }, []);
  return {
    seconds: a,
    isFinished: a === 0,
    restart,
  };
}
const Y = {
  sms: Jt.OTP_SELECT,
  telegram: Jt.TELEGRAM_SELECT,
};
function H(method, t) {
  const n = KU();
  return useMutation(async (a) => B(await Es.post(Y[method], a)), {
    onSuccess: (a) => n(a, method),
    onError: t ?? Qy,
  });
}
const j = {
  OTP_CODE_INVALID: 7901,
  7901: "OTP_CODE_INVALID",
  OTP_TOO_MANY_REQUESTS: 7902,
  7902: "OTP_TOO_MANY_REQUESTS",
  OTP_TOO_MANY_ATTEMPTS: 7903,
  7903: "OTP_TOO_MANY_ATTEMPTS",
  LOGIN_METHOD_DISABLED: 7904,
  7904: "LOGIN_METHOD_DISABLED",
  OTP_SELECTION_INVALID: 7905,
  7905: "OTP_SELECTION_INVALID",
};
const Q = (name) =>
  (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((t) => t[0]?.toUpperCase())
    .join("") || "?";
function CompanySelectStep({ method, selection, onRestart, onSessionLimit, onDesktopAgentError }) {
  const { t: t_1 } = useTranslation();
  const [c, setC] = i.useState(false);
  const [I, setI] = i.useState(false);
  const { seconds, isFinished } = useK(selection.expiresInSec);
  const _RefRef = i.useRef(false);
  const u = H(method, () => {});
  const m = async (o) => {
    const L = {
      selectionToken: selection.selectionToken,
      companyId: o.id,
    };
    try {
      if ((await u.mutateAsync(L))?.sessionLimitReached) {
        onSessionLimit(() => m(o));
      }
    } catch (error) {
      setI(true);
      if (z(error) === j.OTP_SELECTION_INVALID) {
        setC(true);
        return;
      }
      if (onDesktopAgentError?.(error, () => m(o))) {
        return;
      }
      Qy(error);
    }
  };
  const [y] = selection.companies;
  const x = selection.companies.length === 1 && y.available;
  i.useEffect(() => {
    if (x && !_RefRef.current) {
      _RefRef.current = true;
      m(y);
    }
  }, [x]);
  if (c || (isFinished && !u.isLoading && !u.isSuccess)) {
    return <U onRestart={onRestart} />;
  }
  if (x && !I) {
    return (
      <H1 title={t_1("login.Kirilmoqda")} description={t_1("login.Bir_necha_soniya_kuting")}>
        <Spin className="self-center" />
      </H1>
    );
  }
  return (
    <H1
      title={t_1("login.Kompaniyani_tanlang")}
      description={t_1("login.Siz_bir_nechta_kompaniyada_ishlaysiz")}
    >
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {selection.companies.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              disabled={!o.available || u.isLoading}
              onClick={() => m(o)}
              className="flex min-h-[60px] w-full cursor-pointer items-center gap-3.5 rounded-xl border border-solid border-line bg-transparent px-4 py-2.5 text-left text-fg transition-colors hover:border-[color:var(--ant-primary-color)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary-50 text-[15px] font-semibold text-[#00775F]"
              >
                {Q(o.name)}
              </span>
              <span className="grow text-base font-medium">
                {o.name ?? t_1("login.Nomsiz_kompaniya")}
              </span>
              {u.isLoading && u.variables?.companyId === o.id ? (
                <Spin size="small" />
              ) : (
                <F className="text-fg-muted" />
              )}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between text-sm">
        <span className="text-fg-muted">
          {t_1("login.Tanlash_uchun_vaqt")}: <b className="font-semibold text-fg">{V(seconds)}</b>
        </span>
        <$ onClick={onRestart}>{t_1("login.Boshqa_usul_bilan_kirish")}</$>
      </div>
    </H1>
  );
}
export { B, useK as K, V, j, CompanySelectStep as se, z };
