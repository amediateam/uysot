import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import styles from "../Login.module.css";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "uz", label: "O’zbek" },
  { code: "tr", label: "Turk" },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className={styles.lang}>
      {LANGUAGES.map(({ code, label }, index) => (
        <Fragment key={code}>
          {index > 0 && <span className={styles.lang_dot} />}
          <span
            onClick={() => i18n.changeLanguage(code)}
            className={
              styles.lang_item + (i18n.language === code ? ` ${styles.lang_item_active}` : "")
            }
          >
            {label}
          </span>
        </Fragment>
      ))}
    </div>
  );
};
