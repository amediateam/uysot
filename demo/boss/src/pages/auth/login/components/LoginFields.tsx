import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { LoginFormApi } from "@/components/auth/LoginForm";
import { PasswordField } from "@/components/form/PasswordField";
import { TextField } from "@/components/form/TextField";
import { Icon } from "@/components/icon/Icon";
import styles from "../Login.module.css";

export const LoginFields = ({
  control,
  mutation,
  formState: { errors, isSubmitting },
}: LoginFormApi) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      {mutation?.isError && (
        <div className={`${styles.login_error} d-flex align-center`}>
          <Icon name="error" />
          <span className={styles.login_error_title}>{mutation.error.message}</span>
        </div>
      )}
      <TextField
        placeholder={t("login.Login")}
        control={control}
        name="username"
        error={errors.username?.message}
      />
      <PasswordField
        placeholder={t("login.Parol")}
        control={control}
        name="password"
        error={errors.password?.message}
      />
      <div className={styles.login_not_remember_password}>
        <span onClick={() => navigate("/auth/reset-password")}>{t("login.Parolni_unutdim")}</span>
      </div>
      <Button
        loading={isSubmitting}
        type="primary"
        htmlType="submit"
        className={styles.login_button}
      >
        {t("login.Kirish")}
      </Button>
    </div>
  );
};
