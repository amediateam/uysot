// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: RestorePassword-D4Gkow_N (1)
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as s from "react";
import { re } from "@/components/restorePassword/api";
import { vt } from "@/utils/helpers";
import { C as C_1 } from "@/utils/password-policy";
import { Ti } from "@/components/toaster/state";
import { Qy } from "@/utils/error-handler";
import { Ot } from "@/constants/routes";
import * as e from "react/jsx-runtime";
import H from "@/components/restorePassword/sendLogin/SendLogin.module.css";
import { vH as W } from "@/assets/icons/contract/ArrowLeftIcon";
import Ne from "react-google-recaptcha";
import { rF as sitekey } from "@/pages/login/Login";
export const He = ({ changePage, handleSuccessStep1 }) => {
  const [t] = Form.useForm();
  const y = useNavigate();
  const { t: t_1 } = useTranslation();
  const gRef = s.useRef(null);
  const [C, setC] = s.useState(false);
  const [h, setH] = s.useState(0);
  const u = () => setC(true);
  s.useEffect(() => {
    if (h <= 0) {
      return () => {};
    }
    const i = setInterval(() => {
      setH((p) => {
        if (p <= 1) {
          return clearInterval(i), 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(i);
  }, [h]);
  const f = s.useCallback(async () => {
    for (let i = 0; i < 40 && !gRef.current; i++) {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    }
    return gRef.current;
  }, []);
  const w = s.useCallback(async () => {
    u();
    const i = await f();
    i?.reset();
    return (await i?.executeAsync()) ?? null;
  }, [f]);
  const k = re(
    (i) => {
      const username = vt.deleteSpace(t.getFieldValue("username") || "");
      handleSuccessStep1({
        username,
        phone: i.phone,
        resendAfterSec: i.resendAfterSec || 60,
      });
      t.resetFields();
      changePage(2);
    },
    (i) => {
      const p = i?.response?.data;
      const r = p?.errorMessage?.messageCode;
      const q = p?.errorMessage?.args;
      if (r === C_1.RESET_TOO_MANY_REQUESTS) {
        const seconds = Number(q?.["&seconds&"]) || 60;
        setH(seconds);
        Ti.error(
          t_1("global.RESET_TOO_MANY_REQUESTS", {
            seconds,
            defaultValue: `Juda ko'p so'rov yuborildi. ${seconds} soniyadan keyin qayta urinib ko'ring!`,
          })
        );
        return;
      }
      if (r === C_1.INVALID_CAPTCHA || r === C_1.BAD_REQUEST_CAPTCHA) {
        gRef.current?.reset();
        Ti.error(
          t_1("global.INVALID_CAPTCHA", {
            defaultValue: "reCAPTCHA tekshiruvidan o'tmadi, qayta urinib ko'ring!",
          })
        );
        return;
      }
      if (r === C_1.SEND_VERIFY_CODE_ERROR) {
        Ti.error(
          t_1("global.SEND_VERIFY_CODE_ERROR", {
            defaultValue:
              "SMS yuborishda xatolik yuz berdi. Iltimos keyinroq qayta urinib ko'ring!",
          })
        );
        return;
      }
      Qy(i);
    }
  );
  const onFinish = async (i) => {
    const p = vt.deleteSpace(i.username);
    if (!p) {
      return;
    }
    let recaptchaToken = null;
    try {
      recaptchaToken = await w();
    } catch {
      gRef.current?.reset();
    }
    k.mutate({
      username: p,
      recaptchaToken,
    });
  };
  const onClick = () => {
    y(Ot.INDEX);
  };
  return (
    <div className={H.container}>
      <h2>
        <W onClick={onClick} />
        {t_1("profile.Hisobni_qayta_tiklash")}
      </h2>
      <p>{t_1("profile.Parolni_tiklamoqchi_bolgan_hisobingizni")}</p>
      <Form
        form={t}
        name="basic"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 24,
        }}
        initialValues={{
          remember: true,
        }}
        layout="vertical"
        onFinish={onFinish}
        onFocusCapture={u}
        onPointerDownCapture={u}
        autoComplete="off"
      >
        <Form.Item
          label=<span className={H.container_title}>{t_1("login.Login")}</span>
          name="username"
          rules={[
            {
              required: true,
              message: "",
            },
            {
              validator: (i, p) => {
                const r = vt.deleteSpace(p || "");
                if (r) {
                  return (
                    t.setFieldsValue({
                      username: r,
                    }),
                    Promise.resolve()
                  );
                }
                return Promise.reject(new Error(""));
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        {C ? <Ne ref={gRef} sitekey={sitekey} size="invisible" /> : null}
        <Form.Item
          wrapperCol={{
            span: 24,
          }}
        >
          <Button
            loading={k.isLoading}
            disabled={h > 0}
            type="primary"
            htmlType="submit"
            className={H.container_button}
          >
            {h > 0 ? `${t_1("profile.Keyingi")} (${h}s)` : t_1("profile.Keyingi")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
