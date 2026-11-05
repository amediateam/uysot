import { Alert, Button, Form, Segmented } from "antd";
import { useEffect } from "react";
import { ApiErrorCode } from "@/constants/api-error-codes";
import { isApiError } from "@/services/api-error";
import { PasswordInput, TextInput } from "@/components/ui/AppInput";
import { SidePanel } from "@/components/ui/SidePanel";
import { useApiMessage } from "@/hooks/use-api-message";
import { useConfig } from "@/hooks/use-config";
import { useCreateOperator } from "@/hooks/operators";
import { ROLE_OPTIONS } from "@/components/operators/role-constants";
import type { CreateOperatorPayload } from "@/services/operators/types";

// Add-operator drawer (recovered from the build).
export const OperatorFormPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form] = Form.useForm<CreateOperatorPayload>();
  const toast = useApiMessage();
  const { data } = useConfig();
  const { mutate, isPending, error } = useCreateOperator();
  const min = data?.passwordMinLength ?? 8;

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({ role: "VIEWER" });
    }
  }, [open, form]);

  const handledInline =
    isApiError(error) && (error.code === ApiErrorCode.USERNAME_TAKEN || error.code === ApiErrorCode.WEAK_PASSWORD);

  return (
    <SidePanel
      open={open}
      title="Operator qo‘shish"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Bekor qilish</Button>
          <Button type="primary" loading={isPending} onClick={() => form.submit()}>
            Qo‘shish
          </Button>
        </>
      }
    >
      {isApiError(error) && !handledInline && (
        <Alert type="error" showIcon className="mb-4" message={error.message} />
      )}
      <Form<CreateOperatorPayload>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={(values) => {
          mutate(values, {
            onSuccess: () => {
              toast.success("Operator qo‘shildi");
              onClose();
            },
            onError: (err) => {
              if (isApiError(err)) {
                if (err.code === ApiErrorCode.USERNAME_TAKEN) {
                  form.setFields([{ name: "username", errors: ["Login band"] }]);
                  return;
                }
                if (err.code === ApiErrorCode.WEAK_PASSWORD) {
                  const required = (err.details?.minLength as number | undefined) ?? min;
                  form.setFields([{ name: "password", errors: [`Kamida ${required} belgi`] }]);
                  return;
                }
                toast.error(err);
              }
            },
          });
        }}
      >
        <Form.Item
          name="username"
          label="Login"
          rules={[{ required: true, message: "Login kiriting." }, { max: 64 }]}
        >
          <TextInput placeholder="dilnoza.s" autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Boshlang‘ich parol"
          extra={`Kamida ${min} belgi`}
          rules={[
            { required: true, message: "Parol kiriting." },
            { min, message: `Kamida ${min} belgi` },
          ]}
        >
          <PasswordInput placeholder="••••••••" autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="fullName"
          label="To‘liq ism"
          rules={[{ required: true, message: "Ismni kiriting." }, { max: 128 }]}
        >
          <TextInput placeholder="Dilnoza Saidova" />
        </Form.Item>
        <Form.Item name="role" label="Rol" rules={[{ required: true }]}>
          <Segmented options={ROLE_OPTIONS} />
        </Form.Item>
      </Form>
      <p className="text-xs leading-relaxed text-content-muted">
        Operator birinchi kirganda parolni almashtirishga majbur bo‘ladi.
      </p>
    </SidePanel>
  );
};
