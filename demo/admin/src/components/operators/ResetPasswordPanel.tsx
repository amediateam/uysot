import { Alert, Button, Form } from "antd";
import { useEffect } from "react";
import { ApiErrorCode } from "@/constants/api-error-codes";
import { isApiError } from "@/services/api-error";
import { PasswordInput } from "@/components/ui/AppInput";
import { SidePanel } from "@/components/ui/SidePanel";
import { useApiMessage } from "@/hooks/use-api-message";
import { useConfig } from "@/hooks/use-config";
import { useSetOperatorPassword } from "@/hooks/operators";
import type { Operator } from "@/services/operators/types";

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

// Reset-operator-password drawer (recovered from the build).
export const ResetPasswordPanel = ({
  open,
  operator,
  onClose,
}: {
  open: boolean;
  operator: Operator | null;
  onClose: () => void;
}) => {
  const [form] = Form.useForm<ResetPasswordForm>();
  const toast = useApiMessage();
  const { data } = useConfig();
  const { mutate, isPending, error } = useSetOperatorPassword();
  const min = data?.passwordMinLength ?? 8;

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  return (
    <SidePanel
      open={open}
      title="Parolni tiklash"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Bekor qilish</Button>
          <Button type="primary" loading={isPending} onClick={() => form.submit()}>
            Saqlash
          </Button>
        </>
      }
    >
      {operator && (
        <p className="mb-4 text-[13px] text-content">
          {operator.fullName} <span className="text-content-muted">· {operator.username}</span>
        </p>
      )}
      {isApiError(error) && error.code !== ApiErrorCode.WEAK_PASSWORD && (
        <Alert type="error" showIcon className="mb-4" message={error.message} />
      )}
      <Form<ResetPasswordForm>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={({ newPassword }) => {
          if (!operator) return;
          mutate(
            { id: operator.id, newPassword },
            {
              onSuccess: () => {
                toast.success("Parol almashtirildi. Barcha sessiyalar uzildi.");
                onClose();
              },
              onError: (err) => {
                if (isApiError(err) && err.code === ApiErrorCode.WEAK_PASSWORD) {
                  const required = (err.details?.minLength as number | undefined) ?? min;
                  form.setFields([{ name: "newPassword", errors: [`Kamida ${required} belgi`] }]);
                  return;
                }
                toast.error(err);
              },
            },
          );
        }}
      >
        <Form.Item
          name="newPassword"
          label="Yangi parol"
          extra={`Kamida ${min} belgi`}
          rules={[
            { required: true, message: "Yangi parolni kiriting." },
            { min, message: `Kamida ${min} belgi` },
          ]}
        >
          <PasswordInput placeholder="••••••••••" autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Yangi parolni tasdiqlash"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Yangi parolni tasdiqlang." },
            ({ getFieldValue }) => ({
              validator: (_rule, value) =>
                !value || getFieldValue("newPassword") === value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Parollar mos kelmadi.")),
            }),
          ]}
        >
          <PasswordInput placeholder="••••••••••" autoComplete="new-password" />
        </Form.Item>
      </Form>
      <p className="text-xs leading-relaxed text-content-muted">
        Parol almashgach operator birinchi kirishda uni yana o‘zgartiradi va barcha sessiyalari uziladi.
      </p>
    </SidePanel>
  );
};
