import { Alert, Checkbox, Form, type FormInstance } from "antd";
import { useEffect } from "react";
import { ApiErrorCode } from "@/constants/api-error-codes";
import { isApiError } from "@/services/api-error";
import { TextInput } from "@/components/ui/AppInput";
import { SidePanel } from "@/components/ui/SidePanel";
import { useApiMessage } from "@/hooks/use-api-message";
import { useCreateCompany, useUpdateCompany } from "@/hooks/companies";
import { UysotCompanySelect } from "@/components/companies/UysotCompanySelect";
import type { Company } from "@/services/companies/types";
import { Button } from "antd";

interface CompanyFormValues {
  companyId: number;
  companyName: string;
  isPremium?: boolean;
}

// Maps an API error onto form fields. Returns true if it was handled.
const applyCompanyFieldErrors = (form: FormInstance, error: unknown): boolean => {
  if (!isApiError(error)) return false;
  if (error.code === ApiErrorCode.COMPANY_ID_TAKEN) {
    form.setFields([{ name: "companyId", errors: ["Bu Uysot id uchun qator allaqachon bor"] }]);
    return true;
  }
  if (error.fields) {
    form.setFields(Object.entries(error.fields).map(([name, message]) => ({ name, errors: [message] })));
    return true;
  }
  return false;
};

// Create / edit company drawer (recovered from the build).
export const CompanyFormPanel = ({
  open,
  company,
  presetCompanyId,
  onClose,
  onCreated,
}: {
  open: boolean;
  company: Company | null;
  presetCompanyId?: number;
  onClose: () => void;
  onCreated?: () => void;
}) => {
  const [form] = Form.useForm<CompanyFormValues>();
  const toast = useApiMessage();
  const create = useCreateCompany();
  const update = useUpdateCompany();
  const isEdit = company !== null;
  const loading = create.isPending || update.isPending;
  const error = create.error ?? update.error;

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(
        company
          ? { companyId: company.companyId, companyName: company.companyName }
          : { companyId: presetCompanyId, isPremium: false },
      );
    }
  }, [open, company, presetCompanyId, form]);

  const showGenericError =
    isApiError(error) && !error.fields && error.code !== ApiErrorCode.COMPANY_ID_TAKEN;

  return (
    <SidePanel
      open={open}
      title={isEdit ? "Kompaniyani tahrirlash" : "Kompaniya qo‘shish"}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Bekor qilish</Button>
          <Button type="primary" loading={loading} onClick={() => form.submit()}>
            {isEdit ? "Saqlash" : "Qo‘shish"}
          </Button>
        </>
      }
    >
      {showGenericError && <Alert type="error" showIcon className="mb-4" message={error.message} />}
      <Form<CompanyFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={(values) => {
          const onError = (err: unknown) => {
            if (!applyCompanyFieldErrors(form, err)) toast.error(err);
          };
          if (company) {
            update.mutate(
              { id: company.id, companyName: values.companyName },
              {
                onSuccess: () => {
                  toast.success("Kompaniya saqlandi");
                  onClose();
                },
                onError,
              },
            );
            return;
          }
          create.mutate(
            {
              companyId: Number(values.companyId),
              companyName: values.companyName,
              isPremium: values.isPremium ?? false,
            },
            {
              onSuccess: () => {
                toast.success("Kompaniya qo‘shildi");
                onClose();
                onCreated?.();
              },
              onError,
            },
          );
        }}
      >
        <Form.Item
          name="companyId"
          label="Uysot companyId"
          extra={
            isEdit
              ? "Qulflangan maydon."
              : "Keyin o‘zgartirib bo‘lmaydi — shartnoma shu id orqali bog‘lanadi."
          }
          rules={[{ required: true, message: "Uysot kompaniyasini tanlang." }]}
        >
          {isEdit ? (
            <TextInput type="number" disabled />
          ) : (
            <UysotCompanySelect onPick={(picked) => form.setFieldValue("companyName", picked?.name ?? "")} />
          )}
        </Form.Item>
        <Form.Item
          name="companyName"
          label="Nomi"
          rules={[{ required: true, message: "Nomini kiriting." }, { max: 255 }]}
        >
          <TextInput placeholder="Yangi Shahar Qurilish" />
        </Form.Item>
        {isEdit ? (
          <p className="text-xs leading-relaxed text-content-muted">
            PRO rejasi bu yerda o‘zgartirilmaydi — u ro‘yxatdagi alohida amal (tasdiq bilan).
          </p>
        ) : (
          <Form.Item name="isPremium" valuePropName="checked" className="!mb-1">
            <Checkbox>PRO reja bilan yaratish</Checkbox>
          </Form.Item>
        )}
        {!isEdit && (
          <p className="text-xs text-content-muted">Keyin alohida amal bilan o‘zgartiriladi</p>
        )}
      </Form>
    </SidePanel>
  );
};
