import { EyeOutlined, LoadingOutlined, PictureOutlined } from "@ant-design/icons";
import { Alert, Button, Checkbox, Form, Image, Skeleton, Switch, Tooltip, Upload } from "antd";
import type { ImageProps } from "antd";
import { useEffect, useState } from "react";
import { ApiErrorCode } from "@/constants/api-error-codes";
import { isAdmin } from "@/permissions";
import { isAccessDenied, isApiError } from "@/services/api-error";
import { styleImageUrl } from "@/services/design/api";
import { useAuth } from "@/hooks/use-auth";
import { useApiMessage } from "@/hooks/use-api-message";
import {
  useCreateDesignStyle,
  useDeleteStyleImage,
  useDesignStyles,
  useStyleImage,
  useUpdateDesignStyle,
  useUploadStyleImage,
} from "@/hooks/design";
import { formatNumber } from "@/utils/format-number";
import { PageHeader } from "@/components/ui/PageHeader";
import { AppSelect } from "@/components/ui/AppSelect";
import { AppModal } from "@/components/ui/AppModal";
import { SumInput } from "@/components/ui/SumInput";
import { TextArea } from "@/components/ui/AppInput";
import { StatusChip } from "@/components/ui/StatusChip";
import { TableEmptyState } from "@/components/ui/TableEmptyState";
import { TableErrorState } from "@/components/ui/TableErrorState";
import { Forbidden } from "@/pages/forbidden/Forbidden";
import { STYLE_CATALOG } from "@/pages/design/style-catalog";
import type { DesignStyle, SaveStylePayload } from "@/services/design/types";

const MAX_PROMPT = 2048;
const MAX_IMAGE_MB = 20;
const GRID_CLASS = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

// Resolves a style thumbnail: uploaded blob (data URL) or the default asset URL.
const StyleImage = ({ designStyle, className }: { designStyle: DesignStyle; className: string }) => {
  const { data, isPending } = useStyleImage(designStyle.id, designStyle.imagePath, designStyle.imageUploaded);
  const [brokenSrc, setBrokenSrc] = useState<string | null>(null);
  const src = designStyle.imageUploaded ? data : designStyle.imagePath && styleImageUrl(designStyle.imagePath);

  if (designStyle.imageUploaded && isPending) {
    return <div className={`animate-pulse bg-surface-muted ${className}`} />;
  }
  if (!src || src === brokenSrc) {
    return (
      <div className={`flex flex-col items-center justify-center gap-1 bg-surface-muted text-content-muted ${className}`}>
        <PictureOutlined className="text-lg" />
        <span className="font-mono text-[10px]">{designStyle.imageFileName ?? "rasm yo‘q"}</span>
      </div>
    );
  }
  return (
    <span
      className={`block overflow-hidden ${className}`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Image
        src={src}
        alt=""
        onError={() => setBrokenSrc(src)}
        rootClassName="block! size-full"
        className="size-full! object-cover"
        preview={{ cover: <EyeOutlined className="text-base" /> } as ImageProps["preview"]}
      />
    </span>
  );
};

const StyleCard = ({
  designStyle,
  canWrite,
  onOpen,
}: {
  designStyle: DesignStyle;
  canWrite: boolean;
  onOpen: () => void;
}) => {
  const toast = useApiMessage();
  const update = useUpdateDesignStyle();
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`flex cursor-pointer flex-col overflow-hidden rounded-lg bg-surface shadow-card transition-opacity ${
        designStyle.active ? "" : "opacity-55"
      }`}
    >
      <StyleImage designStyle={designStyle} className="h-32.5 w-full" />
      <div className="flex flex-col gap-2 px-4 py-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-content">{designStyle.name}</p>
          {canWrite && (
            <span onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
              <Switch
                size="small"
                checked={designStyle.active}
                loading={update.isPending}
                onChange={(active) =>
                  update.mutate(
                    {
                      id: designStyle.id,
                      code: designStyle.code,
                      promptText: designStyle.promptText,
                      pricePerSqm: designStyle.pricePerSqm,
                      active,
                    },
                    {
                      onSuccess: () => toast.success(active ? "Uslub yoqildi" : "Uslub o‘chirib qo‘yildi"),
                      onError: (error) => toast.error(error),
                    },
                  )
                }
                aria-label={designStyle.active ? "Nofaol qilish" : "Faollashtirish"}
              />
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] text-content-muted">{designStyle.code}</span>
          <span className="text-xs text-content tabular-nums">
            {formatNumber(designStyle.pricePerSqm)} <span className="text-content-muted">so‘m/m²</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const initialStyleValues = (style: DesignStyle | null): Partial<SaveStylePayload> =>
  style
    ? { code: style.code, pricePerSqm: style.pricePerSqm, active: style.active, promptText: style.promptText }
    : { active: true };

// Form + create/update controller for the style modal.
const useStyleForm = ({
  open,
  styleId,
  canWrite,
  onClose,
}: {
  open: boolean;
  styleId: number | null;
  canWrite: boolean;
  onClose: () => void;
}) => {
  const [form] = Form.useForm<SaveStylePayload>();
  const toast = useApiMessage();
  const { data } = useDesignStyles();
  const create = useCreateDesignStyle();
  const update = useUpdateDesignStyle();
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setCreatedId(null);
      setBanner(null);
    }
  }

  const effectiveId = styleId ?? createdId;
  const style = data?.find((s) => s.id === effectiveId) ?? null;
  const takenCodes = new Set(data?.filter((s) => s.id !== effectiveId).map((s) => s.code));

  useEffect(() => {
    if (open && canWrite) form.resetFields();
  }, [open, canWrite, effectiveId, form]);

  const onError = (error: unknown) => {
    if (isApiError(error) && error.code === ApiErrorCode.DESIGN_STYLE_CODE_TAKEN) {
      setBanner("Bu kodli uslub allaqachon bor");
      return;
    }
    if (isApiError(error) && error.fields) {
      form.setFields(
        Object.entries(error.fields).map(([name, message]) => ({ name: name as never, errors: [message] })),
      );
      return;
    }
    setBanner(isApiError(error) ? error.message : "Saqlab bo‘lmadi. Qayta urinib ko‘ring.");
  };

  return {
    form,
    style,
    initialValues: initialStyleValues(style),
    takenCodes,
    banner,
    isSaving: create.isPending || update.isPending,
    submit: (values: SaveStylePayload) => {
      setBanner(null);
      const payload = { ...values, promptText: values.promptText.trim() };
      if (effectiveId !== null) {
        update.mutate(
          { id: effectiveId, ...payload },
          {
            onSuccess: () => {
              toast.success("Uslub saqlandi");
              onClose();
            },
            onError,
          },
        );
        return;
      }
      create.mutate(payload, {
        onSuccess: (created) => {
          toast.success("Uslub yaratildi — endi rasm yuklashingiz mumkin");
          setCreatedId(created.id);
        },
        onError,
      });
    },
  };
};

// Image upload/delete controller for the style modal.
const useStyleImageManager = (styleId: number | null) => {
  const [error, setError] = useState<{ message: string; fileName: string | null } | null>(null);
  const upload = useUploadStyleImage();
  const remove = useDeleteStyleImage();
  return {
    error,
    isBusy: upload.isPending || remove.isPending,
    handleSelect: (file: File) => {
      if (styleId === null) return;
      if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
        setError({ message: `Fayl hajmi ${MAX_IMAGE_MB} MB dan oshmasligi kerak`, fileName: file.name });
        return;
      }
      setError(null);
      upload.mutate(
        { id: styleId, file },
        {
          onError: (err) =>
            setError({
              message:
                isApiError(err) && err.code === ApiErrorCode.DESIGN_STYLE_IMAGE_NOT_AN_IMAGE
                  ? "Fayl rasm emas"
                  : isApiError(err)
                    ? err.message
                    : "Rasmni yuklab bo‘lmadi.",
              fileName: file.name,
            }),
        },
      );
    },
    handleRemove: () => {
      if (styleId === null) return;
      setError(null);
      remove.mutate(styleId, {
        onError: (err) =>
          setError({ message: isApiError(err) ? err.message : "Rasmni olib tashlab bo‘lmadi.", fileName: null }),
      });
    },
    reset: () => setError(null),
  };
};

type StyleImageManager = ReturnType<typeof useStyleImageManager>;

const CodeSelect = ({
  takenCodes,
  value,
  onChange,
  id,
}: {
  takenCodes: Set<string>;
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
}) => (
  <AppSelect<string>
    id={id}
    value={value}
    onChange={onChange}
    allowClear={false}
    placeholder="Tanlang"
    className="font-mono"
    classNames={{ popup: { listItem: "font-normal! text-xs" } } as never}
    labelRender={({ value: selected }) => <span className="font-mono">{selected}</span>}
    options={STYLE_CATALOG.map(({ code }) => {
      const disabled = takenCodes.has(code);
      return {
        value: code,
        disabled,
        label: (
          <span className={`flex items-center justify-between gap-3 ${disabled ? "text-content-placeholder" : "text-content"}`}>
            <span className="font-mono">{code}</span>
            {disabled ? (
              <span className="font-sans text-[11px]">allaqachon mavjud</span>
            ) : (
              code === value && <span className="font-sans text-accent">✓</span>
            )}
          </span>
        ),
      };
    })}
  />
);

const StyleFields = ({ takenCodes }: { takenCodes: Set<string> }) => (
  <>
    <Form.Item name="code" label="Kod" rules={[{ required: true, message: "Kodni tanlang." }]}>
      <CodeSelect takenCodes={takenCodes} />
    </Form.Item>
    <Form.Item
      name="pricePerSqm"
      label="m² narxi"
      extra="Smeta hisobi uchun, pul yechilmaydi"
      rules={[
        { required: true, message: "Narxni kiriting." },
        { type: "number", min: 0, message: "Narx manfiy bo‘lishi mumkin emas" },
      ]}
    >
      <SumInput placeholder="0" />
    </Form.Item>
    <Form.Item name="active" label="Aktiv" valuePropName="checked" layout="horizontal">
      <Switch />
    </Form.Item>
  </>
);

const PromptField = () => (
  <Form.Item
    name="promptText"
    label="Prompt matni"
    extra="AI ga aynan shu matn yuboriladi"
    rules={[
      { required: true, whitespace: true, message: "Prompt matnini kiriting." },
      { max: MAX_PROMPT, message: `${MAX_PROMPT} belgidan oshmasin.` },
    ]}
  >
    <TextArea showCount maxLength={MAX_PROMPT} autoSize={{ minRows: 5, maxRows: 12 }} className="font-mono text-[13px]" />
  </Form.Item>
);

const ImagePanel = ({
  designStyle,
  image,
  canWrite,
}: {
  designStyle: DesignStyle | null;
  image: StyleImageManager;
  canWrite: boolean;
}) => {
  if (!designStyle) {
    return (
      <div className="flex h-37.5 items-center justify-center rounded-md border border-dashed border-border-strong bg-surface-muted p-4 text-center text-xs text-content-muted">
        Rasm uslub yaratilgandan keyin yuklanadi.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <StyleImage designStyle={designStyle} className="h-37.5 w-full rounded-md" />
      {canWrite && (
        <Upload.Dragger
          accept="image/*"
          showUploadList={false}
          maxCount={1}
          disabled={image.isBusy}
          customRequest={({ file }) => image.handleSelect(file as File)}
          className="[&_.ant-upload-btn]:py-2!"
        >
          <span className="text-xs text-content-secondary">
            {image.isBusy ? <LoadingOutlined /> : "Rasmni sudrang yoki tanlang"}
          </span>
        </Upload.Dragger>
      )}
      {image.error && (
        <div
          role="alert"
          className="flex flex-col items-center gap-0.5 rounded-md border border-dashed border-danger bg-danger-soft px-2 py-3 text-center text-danger-strong"
        >
          <span className="text-xs font-medium">{image.error.message}</span>
          {image.error.fileName && <span className="max-w-full truncate font-mono text-[11px]">{image.error.fileName}</span>}
        </div>
      )}
      {canWrite && designStyle.imageUploaded && (
        <Tooltip title={`Olib tashlansa standart rasm (${designStyle.imageFileName ?? "—"}) qaytadi`}>
          <Button type="link" danger size="small" disabled={image.isBusy} onClick={image.handleRemove}>
            Rasmni olib tashlash
          </Button>
        </Tooltip>
      )}
    </div>
  );
};

const StyleReadView = ({ designStyle }: { designStyle: DesignStyle }) => (
  <>
    <dl className="flex flex-col gap-3 text-[13px]">
      <div>
        <dt className="text-xs text-content-muted">Kod</dt>
        <dd className="font-mono text-content">
          {designStyle.code} <span className="font-sans text-content-muted">· {designStyle.name}</span>
        </dd>
      </div>
      <div>
        <dt className="text-xs text-content-muted">m² narxi</dt>
        <dd className="text-content tabular-nums">{formatNumber(designStyle.pricePerSqm)} so‘m</dd>
      </div>
      <div>
        <dt className="mb-1 text-xs text-content-muted">Holat</dt>
        <dd>
          <StatusChip tone={designStyle.active ? "success" : "neutral"} label={designStyle.active ? "Aktiv" : "Nofaol"} />
        </dd>
      </div>
    </dl>
    <div className="mt-4">
      <p className="mb-1 text-xs text-content-muted">Prompt matni</p>
      <p className="rounded-md bg-surface-muted p-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-content-secondary">
        {designStyle.promptText}
      </p>
    </div>
  </>
);

const StyleModal = ({
  open,
  styleId,
  canWrite,
  onClose,
}: {
  open: boolean;
  styleId: number | null;
  canWrite: boolean;
  onClose: () => void;
}) => {
  const { form, style, initialValues, takenCodes, banner, isSaving, submit } = useStyleForm({
    open,
    styleId,
    canWrite,
    onClose,
  });
  const image = useStyleImageManager(style?.id ?? null);
  const close = () => {
    image.reset();
    onClose();
  };
  return (
    <AppModal
      open={open}
      title={canWrite ? (style ? "Uslubni tahrirlash" : "Uslub qo‘shish") : "Uslub"}
      onCancel={close}
      width={640}
      footer={
        canWrite ? (
          <>
            <Button onClick={close}>Bekor qilish</Button>
            <Button type="primary" loading={isSaving} onClick={() => form.submit()}>
              {style ? "Saqlash" : "Yaratish"}
            </Button>
          </>
        ) : (
          <Button onClick={close}>Yopish</Button>
        )
      }
    >
      {banner && <Alert type="error" showIcon className="mb-4" message={banner} />}
      {!canWrite && style ? (
        <>
          <div className="grid gap-4.5 sm:grid-cols-[200px_minmax(0,1fr)]">
            <ImagePanel designStyle={style} image={image} canWrite={false} />
            <StyleReadView designStyle={style} />
          </div>
        </>
      ) : (
        <Form form={form} layout="vertical" initialValues={initialValues} onFinish={submit} disabled={!canWrite}>
          <div className="grid gap-4.5 sm:grid-cols-[200px_minmax(0,1fr)]">
            <ImagePanel designStyle={style} image={image} canWrite={canWrite} />
            <div>
              <StyleFields takenCodes={takenCodes} />
            </div>
          </div>
          <PromptField />
        </Form>
      )}
    </AppModal>
  );
};

export const DesignStylesPage = () => {
  const { role } = useAuth();
  const canWrite = isAdmin(role);
  const { data, isPending, isError, error, refetch } = useDesignStyles();
  const [onlyActive, setOnlyActive] = useState(false);
  const [openStyleId, setOpenStyleId] = useState<number | null | undefined>(undefined);

  const usedCodes = new Set(data?.map((s) => s.code));
  const hasFreeCode = STYLE_CATALOG.some(({ code }) => !usedCodes.has(code));
  const activeCount = data?.filter((s) => s.active).length ?? 0;
  const shown = onlyActive ? data?.filter((s) => s.active) : data;

  if (isAccessDenied(error)) {
    return <Forbidden />;
  }

  return (
    <>
      <PageHeader
        title="Uslublar"
        description="Ilovada tanlanadigan interyer uslublari. O‘chirilmaydi — eski buyurtmalar ularga bog‘langan."
        actions={
          canWrite && (
            <Tooltip
              title={
                hasFreeCode
                  ? undefined
                  : "Barcha kodlar band — har bir koddan faqat bitta uslub bo‘ladi. Mavjud uslubni tahrirlang."
              }
            >
              <span>
                <Button type="primary" disabled={!hasFreeCode} onClick={() => setOpenStyleId(null)}>
                  Uslub qo‘shish
                </Button>
              </span>
            </Tooltip>
          )
        }
      />
      <div className="mb-4 flex items-center gap-3">
        <Checkbox checked={onlyActive} onChange={(e) => setOnlyActive(e.target.checked)}>
          Faqat aktivlar
        </Checkbox>
        <span className="ml-auto text-[13px] text-content-muted tabular-nums">
          {data?.length ?? 0} uslub · {activeCount} aktiv
        </span>
      </div>
      {isError ? (
        <TableErrorState onRetry={() => void refetch()} />
      ) : isPending ? (
        <div className={GRID_CLASS}>
          {[0, 1, 2, 3].map((key) => (
            <div key={key} className="rounded-lg bg-surface p-4 shadow-card">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ))}
        </div>
      ) : shown?.length === 0 ? (
        <div className="rounded-lg bg-surface shadow-card">
          <TableEmptyState
            title={onlyActive ? "Aktiv uslub yo‘q" : "Hali uslub yo‘q"}
            description="Uslub ilovada mijoz tanlaydigan interyer yo‘nalishi va uning smeta narxi."
            action={canWrite && !onlyActive ? { label: "Uslub qo‘shish", onClick: () => setOpenStyleId(null) } : undefined}
          />
        </div>
      ) : (
        <div className={GRID_CLASS}>
          {shown?.map((designStyle) => (
            <StyleCard
              key={designStyle.id}
              designStyle={designStyle}
              canWrite={canWrite}
              onOpen={() => setOpenStyleId(designStyle.id)}
            />
          ))}
        </div>
      )}
      <StyleModal
        open={openStyleId !== undefined}
        styleId={openStyleId ?? null}
        canWrite={canWrite}
        onClose={() => setOpenStyleId(undefined)}
      />
    </>
  );
};
