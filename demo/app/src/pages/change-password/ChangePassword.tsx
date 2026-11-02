// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: ChangePassword-DIbI7hkK (3)
import { Form, Input, Button } from "antd";
import { eF, ZL } from "@/store/hooks";
import { ue, Ae, ce, Se, Ee } from "@/utils/password-policy";
import { useTranslation } from "react-i18next";
import * as a from "react/jsx-runtime";
import s from "@/pages/change-password/ChangePassword.module.css";
import { Oe as src } from "@/assets/index";
import { pe as Y1 } from "@/components/passwordValidationPopover/PasswordValidationPopover";
import { Link } from "react-router-dom";
import Y from "query-string";
import { useMutation } from "react-query";
import { Wa } from "@/services/api/client";
import { Oz } from "@/services/api/endpoints";
import { k$, Qy as onError } from "@/utils/error-handler";
import { EC } from "@/store/reducers/user";
import { DF } from "@/utils/redirect-after-login";
import { _s } from "@/with-error-boundary";
function T() {
  const i = ZL();
  return useMutation(
    async (password) =>
      (
        await Wa.patch(
          Oz.PASSWORD,
          {
            password,
          },
          {
            withCredentials: true,
          }
        )
      ).data,
    {
      onSuccess: (o) => {
        Ee("expired_change");
        k$(o.message, o.accept);
        i(EC(o?.data));
        DF(o?.data);
      },
      onError,
    }
  );
}
const ChangePassword = () => {
  const [i] = Form.useForm();
  const o = eF((e) => e.userReducer.user);
  const context = {
    fullName: o?.fullName,
    username: o?.username,
    companyName: o?.companyName,
  };
  const _ = ue(Form.useWatch("password", i), context);
  const m = T();
  const { i18n, t: t_1 } = useTranslation();
  const l = (e) => {
    i18n.changeLanguage(e);
  };
  const onFinish = (e) => {
    if (e?.password === e?.confirmPassword) {
      m.mutate(e.password, {
        onError: (g) => {
          const d = Ae(g, e.password, context);
          if (d) {
            i.setFields([
              {
                name: "password",
                errors: [d],
              },
            ]);
            ce({
              flow: "expired_change",
              source: "server",
              password: e.password,
              context,
            });
          }
        },
      });
    }
  };
  const onFinishFailed = () =>
    ce({
      flow: "expired_change",
      source: "client",
      password: i.getFieldValue("password"),
      context,
    });
  return (
    <div className={s.login}>
      <img src={src} className={s.login_login_newYear_bg} alt="bg" />
      <div className={s.login_container_div}>
        <div className={s.login_body}>
          <div className={s.form}>
            <h2>{t_1("profile.Parolni_yangilash")}</h2>
            <p>{t_1("profile.Parolingiz_muddati_tugagan_Tizimdan")}.</p>
            <Form
              form={i}
              name="basic"
              wrapperCol={{
                span: 24,
              }}
              initialValues={{
                remember: true,
              }}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Y1 checks={_.checks}>
                <div>
                  <Form.Item
                    label=<span className={s.form_title}>
                      {t_1("profile.Yangi_parolni_kiriting")}
                    </span>
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                      Se(context),
                    ]}
                  >
                    <Input.Password autoComplete="new-password" className={s.form_input} />
                  </Form.Item>
                  <div className={s.form_passwordValidation}>
                    <p
                      style={{
                        color: _.color,
                      }}
                      className={s.form_passwordValidation_title}
                    >
                      {_.title}
                    </p>
                    <div className={s.form_passwordValidation_step}>
                      {[1, 2, 3, 4].map((e) => (
                        <div
                          key={e}
                          style={{
                            background: _.level >= e ? _.color : undefined,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <Form.Item
                    name="confirmPassword"
                    label=<span className={s.form_title}>
                      {t_1("profile.Yangi_parolni_qayta_kiriting")}
                    </span>
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                      },
                      ({ getFieldValue }) => ({
                        validator(g, d) {
                          if (!d || getFieldValue("password") === d) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("The two passwords that you entered do not match!")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password className={s.form_input} />
                  </Form.Item>
                </div>
              </Y1>
              <Form.Item
                wrapperCol={{
                  span: 24,
                }}
              >
                <Button
                  loading={m.isLoading}
                  type="primary"
                  htmlType="submit"
                  className={s.form_button}
                >
                  {t_1("home.Saqlash")}
                </Button>
              </Form.Item>
            </Form>
          </div>
          <Link
            to={Y.stringifyUrl({
              url: "/privacy-policy",
              query: {
                lang: i18n.language,
              },
            })}
            className={s.footer}
          >
            {t_1("privacy_policies.Yuqoridagi_tugmani_bosish_orqali_siz_bizning")}{" "}
            <span> {t_1("privacy_policies.foydalanish_shartlari")}  </span>{" "}
            {t_1("privacy_policies.va")}{" "}
            <span>  {t_1("privacy_policies.maxfiylik_siyosatimizga")}</span>
          </Link>
        </div>
        <div className={s.lang}>
          <span
            onClick={() => l("en")}
            className={s.lang_item + (i18n.language === "en" ? ` ${s.lang_item_active}` : "")}
          >
            English
          </span>
          <span className={s.lang_dot} />
          <span
            onClick={() => l("ru")}
            className={s.lang_item + (i18n.language === "ru" ? ` ${s.lang_item_active}` : "")}
          >
            Русский
          </span>
          <span className={s.lang_dot} />
          <span
            onClick={() => l("uz")}
            className={s.lang_item + (i18n.language === "uz" ? ` ${s.lang_item_active}` : "")}
          >
            O’zbek
          </span>
          <span className={s.lang_dot} />
          <span
            onClick={() => l("tr")}
            className={s.lang_item + (i18n.language === "tr" ? ` ${s.lang_item_active}` : "")}
          >
            Turk
          </span>
          <span className={s.lang_dot} />
          <span
            onClick={() => l("tj")}
            className={s.lang_item + (i18n.language === "tj" ? ` ${s.lang_item_active}` : "")}
          >
            Тоҷикӣ
          </span>
          <span className={s.lang_dot} />
          <span
            onClick={() => l("ky")}
            className={s.lang_item + (i18n.language === "ky" ? ` ${s.lang_item_active}` : "")}
          >
            Кыргыз
          </span>
        </div>
      </div>
    </div>
  );
};
const la = _s(ChangePassword);
export default la;
