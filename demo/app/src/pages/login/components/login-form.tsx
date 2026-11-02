// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (2)
import * as v from "react";
import { useTranslation } from "react-i18next";
import * as A from "react/jsx-runtime";
import Ft from "@/pages/login/Login.module.css";
import { MH } from "@/assets/icons/ErrorIcon";
import { Form, Input, Button } from "antd";
import { vt } from "@/utils/helpers";
import ZH from "react-google-recaptcha";
const l3 = {
  uz: "Litsenziya muddati tugaganligi sababli hisobingiz bloklandi!",
  ru: "Ваша учетная запись заблокирована, так как срок действия вашей лицензии истек!",
  en: "Your account has been locked because your license has expired!",
  kr: "Лицензия муддати тугаганлиги сабабли ҳисобингиз блокланди!",
  tr: "Lisansın süresi dolduğu için hesabınız bloke edildi!",
  tj: "Ҳисоби шумо баста шудааст, зеро мӯҳлати иҷозатномаи шумо ба охир расидааст!",
  ky: "Лицензия мөөнөтү аяктагандыгына байланыштуу аккаунтуңуз бөгөттөлдү!",
};
function LoginForm({
  form,
  onFinish,
  onFinishFailed,
  onRestorePassword,
  recaptchaRef,
  recaptchaKey,
  hasError,
  isLoading,
}) {
  const [l, setL] = v.useState(false);
  const u = () => setL(true);
  const { t: t_1 } = useTranslation();
  const f = localStorage.getItem("i18nextLng");
  const h = localStorage.getItem("message");
  return (
    <div>
      <h1>{t_1("login.Kirish")}</h1>
      {hasError && (
        <div className={`${Ft.login_error} d-flex align-center`}>
          <MH />
          <span className={Ft.login_error_title}>{h === "undefined" ? l3[f] : h}</span>
        </div>
      )}
      <Form
        form={form}
        onFocusCapture={u}
        onPointerDownCapture={u}
        name="basic"
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
        wrapperCol={{
          span: 24,
        }}
        onFinishFailed={onFinishFailed}
        initialValues={{
          remember: true,
        }}
      >
        <Form.Item
          label=<span className={Ft.login_title}>{t_1("login.Login")}</span>
          validateStatus={hasError ? "error" : undefined}
          name="username"
          normalize={(g) => g && vt.deleteSpace(g)}
          rules={[
            {
              required: true,
              message: "",
            },
          ]}
        >
          <Input
            style={{
              borderRadius: "var(--border-6)",
            }}
          />
        </Form.Item>
        <Form.Item
          label=<span className={Ft.login_title}>{t_1("login.Parol")}</span>
          name="password"
          validateStatus={hasError ? "error" : undefined}
          rules={[
            {
              required: true,
              message: "",
            },
          ]}
        >
          <Input.Password
            style={{
              borderRadius: "var(--border-6)",
            }}
          />
        </Form.Item>
        {l ? <ZH ref={recaptchaRef} sitekey={recaptchaKey} size="invisible" /> : null}
        <div className={Ft.login_not_remember_password}>
          <span onClick={onRestorePassword}>{t_1("login.Parolni_unutdim")}</span>
        </div>
        <Form.Item
          wrapperCol={{
            span: 24,
          }}
        >
          <Button loading={isLoading} type="primary" htmlType="submit" className={Ft.login_button}>
            {t_1("login.Kirish")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export { LoginForm as c3 };
