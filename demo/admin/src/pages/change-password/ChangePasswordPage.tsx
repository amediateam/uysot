import { Alert, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { isApiError } from "@/services/api-error";
import { useConfig } from "@/hooks/use-config";
import { useChangePasswordMutation } from "@/hooks/use-change-password-mutation";
import { PasswordInput } from "@/components/ui/AppInput";

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Forced first-login password change (recovered from the build).
export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { data } = useConfig();
  const { mutate, isPending, error } = useChangePasswordMutation();
  const min = data?.passwordMinLength ?? 8;

  return (
    <div className="w-105 max-w-full rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
      <h1 className="text-lg font-semibold tracking-tight text-content">Parolni almashtirish</h1>
      <p className="mt-1.5 text-[13px] leading-relaxed text-content-muted">
        Birinchi kirish. Davom etish uchun yangi parol o‘rnating.
      </p>
      {isApiError(error) && <Alert type="error" showIcon className="mt-5" message={error.message} />}
      <Form<ChangePasswordForm>
        layout="vertical"
        onFinish={({ currentPassword, newPassword }) => {
          mutate(
            { currentPassword, newPassword },
            { onSuccess: () => navigate(ROUTES.dashboard, { replace: true }) },
          );
        }}
        requiredMark={false}
        className="mt-5"
      >
        <Form.Item
          name="currentPassword"
          label="Joriy parol"
          rules={[{ required: true, message: "Joriy parolni kiriting." }]}
        >
          <PasswordInput placeholder="••••••••" autoComplete="current-password" size="large" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Yangi parol"
          extra={`Kamida ${min} belgi`}
          rules={[
            { required: true, message: "Yangi parolni kiriting." },
            { min, message: `Kamida ${min} belgi` },
          ]}
        >
          <PasswordInput placeholder="••••••••••" autoComplete="new-password" size="large" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Yangi parolni tasdiqlash"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Yangi parolni tasdiqlang." },
            ({ getFieldValue }) => ({
              validator: (_rule, value) => {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Parollar mos kelmadi."));
              },
            }),
          ]}
        >
          <PasswordInput placeholder="••••••••••" autoComplete="new-password" size="large" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isPending} block size="large">
          Saqlash va davom etish
        </Button>
      </Form>
      <p className="mt-4 text-center text-xs text-content-muted">
        Bu qadamni o‘tkazib yuborish mumkin emas
      </p>
    </div>
  );
};
