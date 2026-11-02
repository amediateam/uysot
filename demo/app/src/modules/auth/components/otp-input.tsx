// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: otp-input-BD3EMwUi (2)
import { useTranslation } from "react-i18next";
import * as A from "react";
import * as u from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";
import { Input } from "antd";
const f = (e) => e.replace(/\D/g, "");
function OtpInput({ length, value, onChange, onComplete, error, disabled, autoFocus, className }) {
  const { t: t_1 } = useTranslation();
  const pRef = A.useRef([]);
  const r = Array.from(
    {
      length,
    },
    (s, t) => value[t] ?? ""
  );
  const n = (s) => {
    pRef.current[Math.min(Math.max(s, 0), length - 1)]?.focus({
      cursor: "all",
    });
  };
  const c = (s) => {
    const t = s.slice(0, length);
    onChange(t);
    if (t.length === length) {
      onComplete?.(t);
    }
  };
  const i = (s, t) => {
    const o = Math.min(s, value.length);
    const k = value.slice(0, o) + t + value.slice(o + t.length);
    c(k);
    n(o + t.length);
  };
  const w = (s, t) => {
    let o = f(t.target.value);
    if (!o) {
      c(value.slice(0, s));
      return;
    }
    if (o.length === 2 && r[s]) {
      o = o.startsWith(r[s]) ? o[1] : o[0];
    }
    i(s, o);
  };
  const M = (s, t) => {
    if (t.key === "Backspace" && !r[s] && s > 0) {
      t.preventDefault();
      c(value.slice(0, s - 1));
      n(s - 1);
    } else if (t.key === "ArrowLeft") {
      n(s - 1);
    } else if (t.key === "ArrowRight") {
      n(s + 1);
    }
  };
  const j = (s, t) => {
    const o = f(t.clipboardData.getData("text"));
    t.preventDefault();
    if (o) {
      i(s, o);
    }
  };
  return (
    <div className={twMerge("flex gap-2", className)}>
      {r.map((value_1, t) => (
        <Input
          key={t}
          ref={(o) => {
            pRef.current[t] = o;
          }}
          value={value_1}
          status={error ? "error" : undefined}
          disabled={disabled}
          autoFocus={autoFocus && t === 0}
          inputMode="numeric"
          autoComplete={t === 0 ? "one-time-code" : "off"}
          aria-label={t_1("login.{{n}}_raqam", {
            n: t + 1,
          })}
          aria-invalid={error || undefined}
          className="!h-16 !w-14 !rounded-[10px] !p-0 text-center !text-[28px] !font-semibold"
          onChange={(o) => w(t, o)}
          onKeyDown={(o) => M(t, o)}
          onPaste={(o) => j(t, o)}
          onFocus={(o) => o.target.select()}
        />
      ))}
    </div>
  );
}
export { OtpInput as O };
