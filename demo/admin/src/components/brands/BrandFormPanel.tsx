import { DeleteOutlined, EyeOutlined, LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Image, Upload } from "antd";
import type { ImageProps, UploadProps } from "antd";
import { cloneElement, isValidElement, useEffect, useId, useMemo, useState, type ReactElement, type ReactNode } from "react";
import { ApiErrorCode } from "@/constants/api-error-codes";
import { isApiError } from "@/services/api-error";
import { TextInput } from "@/components/ui/AppInput";
import { SidePanel } from "@/components/ui/SidePanel";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useApiMessage } from "@/hooks/use-api-message";
import { useBrandLogo, useCreateBrand, useDeleteBrandLogo, useUpdateBrand, useUploadBrandLogo } from "@/hooks/brands";
import type { Brand } from "@/services/brands/types";

const MAX_LOGO_MB = 5;

// Manages logo selection/preview and upload/delete for the brand form (recovered from the build).
const useBrandLogoUploader = (brand: Brand | null) => {
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const { src } = useBrandLogo(brand);
  const upload = useUploadBrandLogo();
  const remove = useDeleteBrandLogo();

  useEffect(() => {
    if (previewUrl) {
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const reportError = (err: unknown) => {
    if (isApiError(err) && err.code === ApiErrorCode.BRAND_LOGO_NOT_AN_IMAGE) {
      setError("Fayl rasm sifatida aniqlanmadi. Boshqa rasm tanlang.");
      return;
    }
    setError(isApiError(err) ? err.message : "Logoni yuklab bo‘lmadi. Qayta urinib ko‘ring.");
  };

  return {
    src: previewUrl ?? src,
    hasFile: !!previewUrl || !!brand?.logo || !!brand?.logoFile,
    error,
    isRemoveOpen,
    isUploading: upload.isPending,
    isDeleting: remove.isPending,
    pendingFile,
    handleSelect: (file: File) => {
      setError(null);
      setPreviewUrl(URL.createObjectURL(file));
      if (!brand) {
        setPendingFile(file);
        return;
      }
      upload.mutate(
        { id: brand.id, file },
        {
          onError: (err) => {
            setPreviewUrl(null);
            reportError(err);
          },
        },
      );
    },
    handleRemove: () => {
      setError(null);
      if (!brand) {
        setPendingFile(null);
        setPreviewUrl(null);
        return;
      }
      if (!brand.logoFile) {
        setError("Bu eski logo — uni bu yerdan o‘chirib bo‘lmaydi. Uning o‘rniga yangi rasm yuklang.");
        return;
      }
      setIsRemoveOpen(true);
    },
    handleConfirmRemove: () => {
      if (!brand) return;
      remove.mutate(brand.id, {
        onSuccess: () => {
          setIsRemoveOpen(false);
          setPreviewUrl(null);
        },
        onError: (err) => {
          setIsRemoveOpen(false);
          reportError(err);
        },
      });
    },
    closeRemove: () => setIsRemoveOpen(false),
    uploadPendingFile: (id: number, { onSuccess, onError }: { onSuccess: () => void; onError: () => void }) => {
      if (!pendingFile) return;
      upload.mutate(
        { id, file: pendingFile },
        {
          onSuccess: () => onSuccess(),
          onError: (err) => {
            setPendingFile(null);
            setPreviewUrl(null);
            reportError(err);
            onError();
          },
        },
      );
    },
    reset: () => {
      setPendingFile(null);
      setPreviewUrl(null);
      setError(null);
    },
  };
};

type LogoUploader = ReturnType<typeof useBrandLogoUploader>;

const LogoUpload = ({
  value,
  hasFile,
  onSelect,
  onRemove,
  isPending = false,
  error,
  accept = "image/*",
  maxSizeMb = MAX_LOGO_MB,
  disabled,
  id,
  "aria-describedby": ariaDescribedby,
}: {
  value?: string | null;
  hasFile?: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
  isPending?: boolean;
  error?: string | null;
  accept?: string;
  maxSizeMb?: number;
  disabled?: boolean;
  id?: string;
  "aria-describedby"?: string;
}) => {
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [brokenSrc, setBrokenSrc] = useState<string | null>(null);

  const customRequest: UploadProps["customRequest"] = ({ file }) => {
    const picked = file as File;
    if (picked.size > maxSizeMb * 1024 * 1024) {
      setSizeError(`Fayl hajmi ${maxSizeMb} MB dan oshmasligi kerak.`);
      return;
    }
    setSizeError(null);
    onSelect(picked);
  };

  const shownError = sizeError ?? error;
  const isDisabled = disabled || isPending;
  const showImage = !!value && value !== brokenSrc;
  const hasLogo = hasFile ?? !!value;
  const src = useMemo(() => value, [value]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {showImage && value ? (
          <Image
            src={src ?? undefined}
            alt=""
            onError={() => setBrokenSrc(src ?? null)}
            rootClassName="size-14 shrink-0 overflow-hidden rounded-md border border-border bg-surface"
            className="size-14 object-contain p-1"
            preview={{ src: value, cover: <EyeOutlined className="text-base" /> } as ImageProps["preview"]}
          />
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-surface-muted text-content-muted">
            <UploadOutlined />
          </div>
        )}
        <Upload accept={accept} disabled={isDisabled} showUploadList={false} maxCount={1} customRequest={customRequest}>
          <Button
            id={id}
            aria-describedby={ariaDescribedby}
            disabled={isDisabled}
            icon={isPending ? <LoadingOutlined /> : <UploadOutlined />}
          >
            {isPending ? "Yuklanmoqda…" : hasLogo ? "Almashtirish" : "Fayl tanlash"}
          </Button>
        </Upload>
        {hasLogo && !isPending && (
          <Button type="text" danger disabled={disabled} icon={<DeleteOutlined />} onClick={() => {
            setSizeError(null);
            onRemove();
          }}>
            O‘chirish
          </Button>
        )}
      </div>
      {shownError && <p role="alert" className="text-xs leading-relaxed text-danger-strong">{shownError}</p>}
    </div>
  );
};

const LabeledField = ({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: ReactNode;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) => {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const child = isValidElement(children)
    ? cloneElement(children as ReactElement, {
        id,
        required,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })
    : children;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-content">
        {label}
        {required && <span aria-hidden className="ml-1 text-danger">*</span>}
      </label>
      {child}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs leading-relaxed text-danger-strong">
          {error}
        </p>
      ) : (
        hint && <p id={`${id}-hint`} className="text-xs leading-relaxed text-content-muted">{hint}</p>
      )}
    </div>
  );
};

const LogoSection = ({ logo, isEditing }: { logo: LogoUploader; isEditing: boolean }) => (
  <>
    <LabeledField
      label="Logo"
      hint={
        isEditing
          ? "Logo darhol saqlanadi — «Bekor qilish» faqat nomdagi oʻzgarishni qaytaradi."
          : "Rasm brend yaratilgandan keyin yuklanadi."
      }
    >
      <LogoUpload
        value={logo.src}
        hasFile={logo.hasFile}
        onSelect={logo.handleSelect}
        onRemove={logo.handleRemove}
        isPending={logo.isUploading || logo.isDeleting}
        error={logo.error}
        accept="image/*"
        maxSizeMb={MAX_LOGO_MB}
      />
    </LabeledField>
    <ConfirmModal
      open={logo.isRemoveOpen}
      tone="danger"
      title="Logo oʻchirilsinmi?"
      description="Brend logosiz koʻrinadi. Istalgan vaqtda yangi rasm yuklashingiz mumkin."
      confirmLabel="Oʻchirish"
      loading={logo.isDeleting}
      onConfirm={logo.handleConfirmRemove}
      onCancel={logo.closeRemove}
    />
  </>
);

interface BrandFormValues {
  name: string;
}

// Create / edit brand drawer (recovered from the build).
export const BrandFormPanel = ({
  open,
  brand,
  onClose,
}: {
  open: boolean;
  brand: Brand | null;
  onClose: () => void;
}) => {
  const [form] = Form.useForm<BrandFormValues>();
  const toast = useApiMessage();
  const [createdBrand, setCreatedBrand] = useState<Brand | null>(null);
  const create = useCreateBrand();
  const update = useUpdateBrand();
  const activeBrand = brand ?? createdBrand;
  const isEditing = activeBrand !== null;
  const error = create.error ?? update.error;
  const logo = useBrandLogoUploader(activeBrand);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setCreatedBrand(null);
      logo.reset();
    }
  }

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (brand) form.setFieldsValue({ name: brand.name });
    }
  }, [open, brand, form]);

  const showGenericError = isApiError(error) && error.code !== ApiErrorCode.BRAND_NAME_TAKEN;

  return (
    <SidePanel
      open={open}
      title={isEditing ? "Brendni tahrirlash" : "Brend yaratish"}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Bekor qilish</Button>
          <Button
            type="primary"
            loading={create.isPending || update.isPending || logo.isUploading}
            onClick={() => form.submit()}
          >
            {isEditing ? "Saqlash" : "Yaratish"}
          </Button>
        </>
      }
    >
      {showGenericError && <Alert type="error" showIcon className="mb-4" message={error.message} />}
      <Form<BrandFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={(values) => {
          const onError = (err: unknown) => {
            if (isApiError(err) && err.code === ApiErrorCode.BRAND_NAME_TAKEN) {
              form.setFields([{ name: "name", errors: ["Bu nomli brend bor"] }]);
              return;
            }
            toast.error(err);
          };
          if (activeBrand) {
            update.mutate(
              { id: activeBrand.id, name: values.name },
              {
                onSuccess: () => {
                  toast.success("Brend saqlandi");
                  onClose();
                },
                onError,
              },
            );
            return;
          }
          create.mutate(
            { name: values.name },
            {
              onSuccess: (brandResult) => {
                if (!logo.pendingFile) {
                  toast.success("Brend yaratildi");
                  onClose();
                  return;
                }
                logo.uploadPendingFile(brandResult.id, {
                  onSuccess: () => {
                    toast.success("Brend yaratildi");
                    onClose();
                  },
                  onError: () => setCreatedBrand(brandResult),
                });
              },
              onError,
            },
          );
        }}
      >
        <Form.Item name="name" label="Nomi" rules={[{ required: true, message: "Nomini kiriting." }]}>
          <TextInput placeholder="Golden House" />
        </Form.Item>
      </Form>
      <LogoSection logo={logo} isEditing={isEditing} />
      {!isEditing && (
        <p className="mt-4 text-xs leading-relaxed text-content-muted">
          Brend boʻsh tugʻiladi — kompaniyalarni keyin biriktirasiz.
        </p>
      )}
    </SidePanel>
  );
};
