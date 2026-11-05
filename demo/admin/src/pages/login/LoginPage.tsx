import { Alert, Button, Form } from "antd";
import { useCallback, useState } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { ApiErrorCode } from "@/constants/api-error-codes";
import { isApiError } from "@/services/api-error";
import { useLoginMutation } from "@/hooks/use-login-mutation";
import { PasswordInput, TextInput } from "@/components/ui/AppInput";
import { AppLogo } from "@/components/ui/AppLogo";
import { LockCountdown } from "@/pages/login/LockCountdown";
import type { LoginCredentials } from "@/services/auth/types";

// Where to land after login: the page the user was bounced from, else the dashboard.
const redirectTarget = (state: Location["state"]): string =>
  (state as { from?: Location } | null)?.from?.pathname ?? ROUTES.dashboard;

// Login page (recovered from the build): password login with lockout countdown.
export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate, isPending, error, reset } = useLoginMutation();
  const [lockSeconds, setLockSeconds] = useState<number | null>(null);

  const handleFinish = (values: LoginCredentials) => {
    mutate(values, {
      onSuccess: () => navigate(redirectTarget(location.state), { replace: true }),
      onError: (err) => {
        if (isApiError(err) && err.code === ApiErrorCode.LOGIN_LOCKED) {
          setLockSeconds(err.retryAfterSeconds ?? 0);
        }
      },
    });
  };

  const handleUnlock = useCallback(() => {
    setLockSeconds(null);
    reset();
  }, [reset]);

  const locked = lockSeconds !== null;
  const showCredentialsError =
    isApiError(error) && error.code === ApiErrorCode.INVALID_CREDENTIALS && !locked;

  return (
    <div className="w-95 max-w-full rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
      <AppLogo size="md" suffix="dev panel" />
      <p className="mt-2 text-[13px] leading-relaxed text-content-muted">
        Ichki panel. Faqat operatorlar uchun.
      </p>
      {showCredentialsError && (
        <Alert type="error" showIcon className="mt-5" message="Login yoki parol noto‘g‘ri" />
      )}
      {locked && (
        <Alert
          type="warning"
          showIcon
          className="mt-5"
          message={
            <span>
              Juda ko‘p urinish.{" "}
              <LockCountdown key={lockSeconds} seconds={lockSeconds} onFinish={handleUnlock} /> dan keyin
              qayta urining
            </span>
          }
        />
      )}
      <Form<LoginCredentials>
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
        className="mt-5"
        disabled={locked}
      >
        <Form.Item name="username" label="Login" rules={[{ required: true, message: "Login kiriting." }]}>
          <TextInput placeholder="operator.aziz" autoComplete="username" size="large" />
        </Form.Item>
        <Form.Item name="password" label="Parol" rules={[{ required: true, message: "Parol kiriting." }]}>
          <PasswordInput placeholder="••••••••" autoComplete="current-password" size="large" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isPending}
          disabled={locked}
          block
          size="large"
          className="mt-1"
        >
          Kirish
        </Button>
      </Form>
    </div>
  );
};
