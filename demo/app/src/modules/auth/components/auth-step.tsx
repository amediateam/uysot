// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: company-select-step-Cjab7zDr (3)
import { useTranslation } from "react-i18next";
import * as s from "react/jsx-runtime";
import { Cne, Pne, wne } from "@/modules/auth/components/icons";
import { twMerge } from "tailwind-merge";
function AuthStep({ title, description, onBack, children }) {
  const { t: t_1 } = useTranslation();
  return (
    <div className="flex flex-col gap-6 pb-10">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex cursor-pointer items-center gap-1.5 self-start border-0 bg-transparent p-0 text-sm font-semibold text-fg"
        >
          <Cne size={18} />
          {t_1("login.Orqaga")}
        </button>
      ) : null}
      <div className="flex flex-col gap-2">
        <h2 className="m-0 text-[28px] font-medium leading-9 text-fg">{title}</h2>
        {description ? <p className="m-0 text-base text-fg-muted">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
const AuthLink = ({ onClick, children, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={twMerge(
      "cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-[color:var(--ant-primary-color)] disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
  >
    {children}
  </button>
);
function AuthAlert({ children, variant = "inline", icon = "alert" }) {
  const A = icon === "lock" ? Pne : wne;
  if (variant === "inline") {
    return (
      <p role="alert" className="m-0 flex items-center gap-1.5 text-sm text-error-700">
        <A size={16} className="shrink-0" />
        {children}
      </p>
    );
  }
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-[10px] border border-solid border-error-200 bg-error-50 px-3.5 py-3"
    >
      <A className="mt-px shrink-0 text-error-700" />
      <p className="m-0 text-sm text-error-700">{children}</p>
    </div>
  );
}
export { AuthLink as $, AuthAlert as G, AuthStep as h };
