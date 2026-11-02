// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: bg_new-yiMPkYGx (2)
import { useTranslation } from "react-i18next";
import * as o from "react/jsx-runtime";
import { Dropdown } from "antd";
import A from "@/components/passwordValidationPopover/PasswordValidationPopover.module.css";
import { x, R } from "@/utils/password-policy";
import { te as Te } from "@/assets/icons/TickCircleIcon";
import { _s } from "@/with-error-boundary";
const PasswordValidationPopover = ({ checks, children }) => {
  const { t: t_1 } = useTranslation();
  return (
    <Dropdown
      placement="top"
      overlay=<>
        <p className={A.container_title}>{t_1("profile.Ishonchli_parol_uchun_talablar")}:</p>
        {x.map((l) => (
          <div
            key={l.rule}
            className={checks[l.rule] ? A.container_include : A.container_not_include}
          >
            <Te />
            <span>{R(l)}</span>
          </div>
        ))}
      </>
      overlayClassName={A.container}
      trigger={["hover"]}
    >
      {children}
    </Dropdown>
  );
};
export const pe = _s(PasswordValidationPopover);
