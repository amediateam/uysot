// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (1)
import { useTranslation } from "react-i18next";
import * as A from "react/jsx-runtime";
import Ft from "@/pages/login/Login.module.css";
import { ib } from "@/pages/login/constants";
function LoginLanguageSwitcher({ onChange }) {
  const { i18n } = useTranslation();
  return (
    <div className={Ft.lang}>
      {ib.map((r, n) => (
        <span key={r.code}>
          <span
            onClick={() => onChange(r.code)}
            className={Ft.lang_item + (i18n.language === r.code ? ` ${Ft.lang_item_active}` : "")}
          >
            {r.label}
          </span>
          {n < ib.length - 1 && <span className={Ft.lang_dot} />}
        </span>
      ))}
    </div>
  );
}
export { LoginLanguageSwitcher as u3 };
