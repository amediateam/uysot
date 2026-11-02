// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: RestorePassword-D4Gkow_N (5)
import * as s from "react";
import { useTranslation } from "react-i18next";
import * as e from "react/jsx-runtime";
import l from "@/pages/restorePassword/RestorePassword.module.css";
import { Oe as src } from "@/assets/index";
import { Link } from "react-router-dom";
import xe from "query-string";
import { _s } from "@/with-error-boundary";
import { Ne } from "@/components/restorePassword/restorePassword/RestorePassword";
import { Le } from "@/components/restorePassword/sendCode/SendCode";
import { He } from "@/components/restorePassword/sendLogin/SendLogin";
const Pe = _s(Ne);
const Ye = _s(Le);
const Ue = _s(He);
function RestorePassword() {
  const [user, setUser] = s.useState({
    phone: "",
    username: "",
  });
  const [resendAfterSec, setResendAfterSec] = s.useState(60);
  const [a, setA] = s.useState(null);
  const [expiresInSec, setExpiresInSec] = s.useState(300);
  const [h, setH] = s.useState(1);
  const { i18n, t: t_1 } = useTranslation();
  s.useEffect(() => {
    if (h === 3 && !a) {
      setH(1);
    }
  }, [h, a]);
  const w = s.useCallback(
    (r) => {
      i18n.changeLanguage(r);
    },
    [i18n]
  );
  const changePage = s.useCallback((r) => {
    setH(r);
  }, []);
  const handleSuccessStep1 = s.useCallback((r) => {
    setUser({
      username: r.username,
      phone: r.phone,
    });
    setResendAfterSec(r.resendAfterSec);
  }, []);
  const handleSuccessStep2 = s.useCallback((r) => {
    setA(r.resetToken);
    setExpiresInSec(r.expiresInSec);
  }, []);
  const onSessionExpired = s.useCallback(() => {
    setA(null);
    setH(1);
  }, []);
  const PComponent = () => {
    switch (h) {
      case 1:
        return <Ue handleSuccessStep1={handleSuccessStep1} changePage={changePage} />;
      case 2:
        return (
          <Ye
            user={user}
            resendAfterSec={resendAfterSec}
            handleSuccessStep2={handleSuccessStep2}
            changePage={changePage}
          />
        );
      case 3:
        return (
          <Pe
            resetToken={a}
            user={user}
            expiresInSec={expiresInSec}
            onSessionExpired={onSessionExpired}
            changePage={changePage}
          />
        );
      default:
        return <div>ups:(</div>;
    }
  };
  return (
    <div className={l.login}>
      <img src={src} className={l.login_login_newYear_bg} alt="bg" />
      <div className={l.login_container_div}>
        <div className={l.login_body}>
          {PComponent()}
          <Link
            to={xe.stringifyUrl({
              url: "/privacy-policy",
              query: {
                lang: i18n.language,
              },
            })}
            className={l.footer}
          >
            {t_1("privacy_policies.Yuqoridagi_tugmani_bosish_orqali_siz_bizning")}{" "}
            <span> {t_1("privacy_policies.foydalanish_shartlari")}  </span>{" "}
            {t_1("privacy_policies.va")}{" "}
            <span>  {t_1("privacy_policies.maxfiylik_siyosatimizga")}</span>
          </Link>
        </div>
        <div className={l.lang}>
          <span
            onClick={() => w("en")}
            className={l.lang_item + (i18n.language === "en" ? ` ${l.lang_item_active}` : "")}
          >
            English
          </span>
          <span className={l.lang_dot} />
          <span
            onClick={() => w("ru")}
            className={l.lang_item + (i18n.language === "ru" ? ` ${l.lang_item_active}` : "")}
          >
            Русский
          </span>
          <span className={l.lang_dot} />
          <span
            onClick={() => w("uz")}
            className={l.lang_item + (i18n.language === "uz" ? ` ${l.lang_item_active}` : "")}
          >
            O’zbek
          </span>
          <span className={l.lang_dot} />
          <span
            onClick={() => w("tr")}
            className={l.lang_item + (i18n.language === "tr" ? ` ${l.lang_item_active}` : "")}
          >
            Turk
          </span>
          <span className={l.lang_dot} />
          <span
            onClick={() => w("tj")}
            className={l.lang_item + (i18n.language === "tj" ? ` ${l.lang_item_active}` : "")}
          >
            Тоҷикӣ
          </span>
          <span className={l.lang_dot} />
          <span
            onClick={() => w("ky")}
            className={l.lang_item + (i18n.language === "ky" ? ` ${l.lang_item_active}` : "")}
          >
            Кыргыз
          </span>
        </div>
      </div>
    </div>
  );
}
const ds = _s(RestorePassword);
export default ds;
