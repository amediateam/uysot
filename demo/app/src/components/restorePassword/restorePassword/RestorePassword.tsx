// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: RestorePassword-D4Gkow_N (2)
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as s from "react";
import { ue, Ee, C as C_1, Ae, ce, Se } from "@/utils/password-policy";
import { Ti } from "@/components/toaster/state";
import { hq } from "@/services/analytics";
import { Ot } from "@/constants/routes";
import { Qy, k$ } from "@/utils/error-handler";
import * as e from "react/jsx-runtime";
import P from "@/components/restorePassword/restorePassword/RestorePassword.module.css";
import { vH as W } from "@/assets/icons/contract/ArrowLeftIcon";
import { pe as He } from "@/components/passwordValidationPopover/PasswordValidationPopover";
import { useMutation } from "react-query";
import { Wa } from "@/services/api/client";
import { Nz } from "@/services/api/endpoints";
function Ce(m, o) {
  return useMutation(async (t) => (await Wa.post(Nz.CHANGE_PASSWORD, t)).data, {
    onSuccess: (t) => {
      if (t?.message) {
        k$(t.message, t.accept);
      }
      if (m) {
        m();
      }
    },
    onError: (t) => {
      if (o) {
        o(t);
      } else {
        Qy(t);
      }
    },
  });
}
export const Ne = ({ changePage, resetToken, user, expiresInSec, onSessionExpired }) => {
  const [g] = Form.useForm();
  const C = useNavigate();
  const { t: t_1 } = useTranslation();
  const [h, setH] = s.useState(expiresInSec || 300);
  const uRef = s.useRef(Date.now() + (expiresInSec || 300) * 1000);
  const fRef = s.useRef(onSessionExpired);
  const wRef = s.useRef(t_1);
  const kRef = s.useRef(resetToken);
  const context = {
    username: user?.username,
    phone: user?.phone,
  };
  const x = ue(Form.useWatch("password", g), context);
  s.useEffect(() => {
    fRef.current = onSessionExpired;
  }, [onSessionExpired]);
  s.useEffect(() => {
    wRef.current = t_1;
  }, [t_1]);
  s.useEffect(() => {
    if (!resetToken) {
      fRef.current();
      return;
    }
    if (kRef.current !== resetToken) {
      kRef.current = resetToken;
      uRef.current = Date.now() + (expiresInSec || 300) * 1000;
      setH(expiresInSec || 300);
    }
  }, [resetToken, expiresInSec]);
  s.useEffect(() => {
    const d = setInterval(() => {
      const v = Math.max(0, Math.ceil((uRef.current - Date.now()) / 1000));
      setH(v);
      if (v <= 0) {
        clearInterval(d);
        Ti.warning(
          wRef.current("global.RESET_TOKEN_INVALID", {
            defaultValue: "Parolni tiklash seansi muddati tugadi. Boshidan boshlang!",
          })
        );
        fRef.current();
      }
    }, 1000);
    return () => clearInterval(d);
  }, []);
  const i = Ce(
    () => {
      Ee("restore");
      hq();
      C(Ot.INDEX);
    },
    (d) => {
      const N = d?.response?.data?.errorMessage?.messageCode;
      if (N === C_1.RESET_TOKEN_INVALID) {
        Ti.error(
          t_1("global.RESET_TOKEN_INVALID", {
            defaultValue:
              "Parolni tiklash seansi yaroqsiz yoki muddati tugagan. Boshidan boshlang!",
          })
        );
        onSessionExpired();
        return;
      }
      if (N === C_1.RESET_PASSWORD_SAME_AS_OLD) {
        Ti.error(
          t_1("global.RESET_PASSWORD_SAME_AS_OLD", {
            defaultValue: "Yangi parol eskisi bilan bir xil bo‘lmasligi kerak!",
          })
        );
        return;
      }
      const password = g.getFieldValue("password") || "";
      const $ = Ae(d, password, context);
      if ($) {
        g.setFields([
          {
            name: "password",
            errors: [$],
          },
        ]);
        Ti.error($);
        ce({
          flow: "restore",
          source: "server",
          password,
          context,
        });
        return;
      }
      Qy(d);
    }
  );
  const onFinish = (d) => {
    if (!resetToken) {
      onSessionExpired();
      return;
    }
    i.mutate({
      password: d.password,
      resetToken,
    });
  };
  const onFinishFailed = () =>
    ce({
      flow: "restore",
      source: "client",
      password: g.getFieldValue("password"),
      context,
    });
  const onClick = () => {
    changePage(2);
  };
  const A = (d) => {
    const v = Math.floor(d / 60);
    const N = d % 60;
    return `${v.toString().padStart(2, "0")}:${N.toString().padStart(2, "0")}`;
  };
  return (
    <div className={P.container}>
      <h2>
        <W onClick={onClick} />
        {t_1("profile.Ishonchli_parol_yarating")}
      </h2>
      <p>
        {t_1("profile.Boshqa_joyda_ishlatmaydigan_kuchli")}.<br />
        <span
          style={{
            fontSize: 13,
            color: "#8c8c8c",
          }}
        >
          {t_1("gloval.session_muddati")} {A(h)}
        </span>
      </p>
      <Form
        form={g}
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
        <Form.Item
          label=<span className={P.container_title}>{t_1("profile.Yangi_parolni_kiriting")}</span>
          name="password"
          rules={[
            {
              required: true,
              message: "",
            },
            Se(context),
          ]}
        >
          <Input.Password autoComplete="new-password" className={P.container_input} />
        </Form.Item>
        <div className={P.container_passwordValidation}>
          <He checks={x.checks}>
            <p
              style={{
                color: x.color,
              }}
              className={P.container_passwordValidation_title}
            >
              {x.title}
            </p>
          </He>
          <div className={P.container_passwordValidation_step}>
            {[1, 2, 3, 4].map((d) => (
              <div
                key={d}
                style={{
                  background: x.level >= d ? x.color : undefined,
                }}
              />
            ))}
          </div>
        </div>
        <Form.Item
          name="confirmPassword"
          label=<span className={P.container_title}>{t_1("profile.Yangi_parolni_takrorlang")}</span>
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "",
            },
            ({ getFieldValue }) => ({
              validator(v, N) {
                if (!N || getFieldValue("password") === N) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password className={P.container_input} />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            span: 24,
          }}
        >
          <Button
            loading={i.isLoading}
            type="primary"
            htmlType="submit"
            className={P.container_button}
          >
            {t_1("home.Saqlash")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
