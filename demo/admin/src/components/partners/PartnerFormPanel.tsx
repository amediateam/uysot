import { DeleteOutlined, LoadingOutlined, SettingOutlined, UploadOutlined } from "@ant-design/icons";
import { Alert, Button, Checkbox, DatePicker, Input, Segmented, Select, Skeleton, Tooltip } from "antd";
import dayjs from "dayjs";
import { useIsMutating } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { useApiMessage } from "@/hooks/use-api-message";
import { useCategories, usePartner, useSavePartner } from "@/hooks/partners";
import { usePartnerForm, type PartnerForm } from "@/hooks/use-partner-form";
import { usePartnerUpload } from "@/hooks/use-partner-upload";
import { partnerKeys } from "@/services/partners/keys";
import { LANGUAGES, LIMITS, STATUS_META } from "@/services/partners/constants";
import {
  deriveStatus,
  formToRequest,
  languageMarks,
  newPartnerForm,
  partnerToForm,
  today,
  upper,
} from "@/services/partners/format";
import { findIssue } from "@/services/partners/validation";
import { mapPartnerSaveError } from "@/services/partners/server-errors";
import { SidePanel } from "@/components/ui/SidePanel";
import { StatusChip } from "@/components/ui/StatusChip";
import { TableErrorState } from "@/components/ui/TableErrorState";
import { PartnerEditorContext, usePartnerEditor } from "@/components/partners/editor-context";
import { DraftField, LabeledField, PartnerAvatar, UploadStatus } from "@/components/partners/fields";
import { DiscountEditor, DiscountPreview } from "@/components/partners/DiscountEditor";
import { PhoneInput } from "@/components/partners/PhoneInput";
import { BlockList } from "@/components/partners/blocks";
import { AppModal } from "@/components/ui/AppModal";
import type { FileRef, Language, PartnerCategory, PartnerStatus } from "@/services/partners/types";

const pickFile = (accept: string, onPick: (file: File) => void) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (file) onPick(file);
  });
  input.click();
};

const serverFieldError = (form: PartnerForm, field: string): string | null =>
  form.serverIssue?.kind === "field" && form.serverIssue.field === field ? form.serverIssue.message : null;

const LogoField = ({
  name,
  value,
  onChange,
  serverError,
}: {
  name: string;
  value: FileRef | null;
  onChange: (value: FileRef | null) => void;
  serverError: string | null;
}) => {
  const { readOnly } = usePartnerEditor();
  const upload = usePartnerUpload("IMAGE");
  const missingFile = value !== null && value.file === null;
  const error = upload.error ?? serverError ?? (missingFile ? "Fayl topilmadi — almashtiring" : null);
  const initial = name.trim().slice(0, 1).toUpperCase() || "Y";
  return (
    <div className="flex items-center gap-3">
      <PartnerAvatar name={name || initial} logo={value?.file ?? null} size="md" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {upload.isUploading ? (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-content-secondary">Logo yuklanmoqda · {upload.progress}%</span>
            <UploadStatus isUploading progress={upload.progress} />
          </div>
        ) : (
          !readOnly && (
            <div className="flex items-center gap-1.5">
              <Button
                size="small"
                icon={<UploadOutlined />}
                onClick={() =>
                  pickFile("image/*", async (file) => {
                    const uploaded = await upload.upload(file);
                    if (uploaded) onChange({ id: uploaded.id, file: uploaded });
                  })
                }
              >
                {value ? "Almashtirish" : "Logo yuklash"}
              </Button>
              {value && (
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  aria-label="Logoni olib tashlash"
                  onClick={() => {
                    upload.clearError();
                    onChange(null);
                  }}
                />
              )}
            </div>
          )
        )}
        {error ? (
          <p role="alert" className="text-xs text-danger-strong">
            {error}
          </p>
        ) : (
          <p className="text-[11px] text-content-muted">Yuklanmasa ilovada «{initial}» harfi ko‘rinadi</p>
        )}
      </div>
    </div>
  );
};

const ValidUntilField = ({ value, onChange }: { value: string | null; onChange: (value: string | null) => void }) => {
  const { readOnly } = usePartnerEditor();
  const unlimited = value === null;
  return (
    <LabeledField
      label="Amal qilish muddati"
      hint="Tanlangan kun oxirigacha amal qiladi (Toshkent vaqti). Muddat o‘tgach ilovadan o‘zi yo‘qoladi."
    >
      <div className="flex items-center gap-3">
        <DatePicker
          className="flex-1"
          format="DD.MM.YYYY"
          placeholder="kk.oo.yyyy"
          value={value ? dayjs(value) : null}
          disabled={unlimited || readOnly}
          allowClear={false}
          onChange={(d) => onChange(d && !Array.isArray(d) ? d.format("YYYY-MM-DD") : null)}
        />
        <Checkbox
          checked={unlimited}
          disabled={readOnly}
          onChange={(e) => onChange(e.target.checked ? null : dayjs(today()).add(1, "month").format("YYYY-MM-DD"))}
        >
          Muddatsiz
        </Checkbox>
      </div>
    </LabeledField>
  );
};

const PartnerHeaderForm = ({
  form,
  categories,
  onManageCategories,
}: {
  form: PartnerForm;
  categories: PartnerCategory[] | undefined;
  onManageCategories?: () => void;
}) => {
  const { lang, readOnly } = usePartnerEditor();
  const { values, validation, setField, setDraft } = form;
  const manageButton = onManageCategories && (
    <Button size="small" block icon={<SettingOutlined />} onClick={onManageCategories}>
      Kategoriyalarni boshqarish
    </Button>
  );
  return (
    <div className="flex flex-col gap-3.5">
      <LogoField
        name={values.name}
        value={values.logo}
        onChange={(logo) => setField("logo", logo)}
        serverError={serverFieldError(form, "logo")}
      />
      <div className="grid gap-2.5 sm:grid-cols-2">
        <LabeledField label="Kategoriya" required error={serverFieldError(form, "categoryId")}>
          <Select
            allowClear={false}
            value={values.categoryId ?? undefined}
            placeholder="Tanlang"
            disabled={readOnly}
            options={categories?.map((category) => ({ value: category.id, label: category.name.uz }))}
            onChange={(id) => setField("categoryId", id)}
            popupMatchSelectWidth={260}
            notFoundContent={
              <div className="flex flex-col items-center gap-3 px-2 py-4 text-center">
                <span className="text-[13px] text-content-muted">Kategoriya hali yo‘q</span>
                {manageButton}
              </div>
            }
            popupRender={(menu) => (
              <>
                {menu}
                {categories?.length && manageButton ? (
                  <div className="mt-1 border-t border-border px-1 pt-2 pb-1">{manageButton}</div>
                ) : null}
              </>
            )}
          />
        </LabeledField>
        <LabeledField
          label="Nomi"
          required
          count={{ value: values.name.trim().length, limit: LIMITS.name }}
          error={serverFieldError(form, "name") ?? findIssue(validation.headerIssues, "name", lang)}
        >
          <Input
            value={values.name}
            maxLength={LIMITS.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Yumshoq"
            readOnly={readOnly}
          />
        </LabeledField>
      </div>
      <p className="-mt-2 text-[11px] text-content-muted">Nomi brend — tarjima qilinmaydi, barcha tillar uchun bitta.</p>
      <DiscountEditor
        values={values}
        issues={validation.headerIssues}
        serverError={serverFieldError(form, "discount")}
        onTypeChange={(type) => setField("discountType", type)}
        onValueChange={(value) => setField("discountValue", value)}
        onTextChange={(value) => setDraft("discountText", lang, value)}
      />
      <DraftField
        label="Shart"
        optional
        draft={values.condition}
        limit={LIMITS.condition}
        onChange={(value) => setDraft("condition", lang, value)}
        placeholder="8 mln so‘mdan har qanday divanga"
        hint="To‘ldirilsa UZ va RU majburiy. Bo‘sh bo‘lsa ilovada satr chiqmaydi."
        error={findIssue(validation.headerIssues, "condition", lang)}
      />
      <div className="grid gap-2.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <LabeledField
          label="Telefon"
          required
          hint="Xalqaro raqam ham mumkin: +992…"
          error={serverFieldError(form, "phone") ?? findIssue(validation.headerIssues, "phone", lang)}
        >
          <PhoneInput value={values.phone} onChange={(phone) => setField("phone", phone)} placeholder="90 123 45 67" readOnly={readOnly} />
        </LabeledField>
        <LabeledField
          label="Ilovadagi tartib"
          hint="Kategoriya ichida kichigi yuqorida"
          error={findIssue(validation.headerIssues, "sortOrder", lang)}
        >
          <Input
            inputMode="numeric"
            value={values.sortOrder}
            onChange={(e) => setField("sortOrder", e.target.value.replace(/\D/g, ""))}
            placeholder="0"
            readOnly={readOnly}
          />
        </LabeledField>
      </div>
      <ValidUntilField value={values.validUntil} onChange={(value) => setField("validUntil", value)} />
      <DiscountPreview values={values} />
    </div>
  );
};

const LANG_MARK_DOT: Record<"error" | "warning", string> = { error: "bg-danger", warning: "bg-content-placeholder" };
const LANG_MARK_TITLE: Record<"error" | "warning", string> = {
  error: "Majburiy maydon to‘ldirilmagan",
  warning: "To‘ldirilmagan joylarda ruscha matn ko‘rsatiladi",
};

const LanguageTabs = ({
  value,
  marks,
  onChange,
}: {
  value: Language;
  marks: Record<Language, "error" | "warning" | null>;
  onChange: (lang: Language) => void;
}) => (
  <div role="group" aria-label="Til">
    <Segmented<Language>
      value={value}
      onChange={onChange}
      shape="round"
      options={LANGUAGES.map((lang) => {
        const mark = marks[lang];
        return {
          value: lang,
          label: (
            <Tooltip title={mark ? LANG_MARK_TITLE[mark] : undefined}>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                {upper(lang)}
                {mark && <span aria-label={LANG_MARK_TITLE[mark]} className={`size-1.5 rounded-full ${LANG_MARK_DOT[mark]}`} />}
              </span>
            </Tooltip>
          ),
        };
      })}
    />
  </div>
);

const EditorHeader = ({
  title,
  status,
  readOnly,
  lang,
  marks,
  onLangChange,
}: {
  title: string;
  status: PartnerStatus;
  readOnly: boolean;
  lang: Language;
  marks: Record<Language, "error" | "warning" | null>;
  onLangChange: (lang: Language) => void;
}) => (
  <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 pr-8">
    <span className="max-w-72 truncate text-[17px] font-semibold tracking-tight">{title}</span>
    <StatusChip tone={STATUS_META[status].tone} label={STATUS_META[status].label} />
    {readOnly && <StatusChip tone="neutral" label="Faqat ko‘rish" />}
    <LanguageTabs value={lang} marks={marks} onChange={onLangChange} />
    <span className="text-xs font-normal text-content-muted">UZ va RU majburiy · TG ixtiyoriy</span>
  </div>
);

const EditorFooter = ({
  isNew,
  readOnly,
  published,
  status,
  missing,
  isUploading,
  isSaving,
  onPublishedChange,
  onClose,
  onSave,
}: {
  isNew: boolean;
  readOnly: boolean;
  published: boolean;
  status: PartnerStatus;
  missing: string[];
  isUploading: boolean;
  isSaving: boolean;
  onPublishedChange: (value: boolean) => void;
  onClose: () => void;
  onSave: () => void;
}) => {
  const expiredWhilePublished = published && status === "EXPIRED";
  const tooltip: ReactNode = isUploading ? (
    "Fayl yuklanmoqda — tugashini kuting"
  ) : missing.length > 0 ? (
    <div className="flex flex-col gap-0.5">
      <span className="font-semibold">To‘ldirilmagan:</span>
      {missing.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  ) : null;
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
      <label className="flex items-center gap-2.5 text-left sm:mr-auto">
        <Checkbox checked={published} disabled={readOnly || isSaving} onChange={(e) => onPublishedChange(e.target.checked)} aria-label="Faol" />
        <span className="flex flex-col">
          <span className="text-[13px] font-semibold text-content">Faol</span>
          <span className={`text-xs ${expiredWhilePublished ? "text-warning-strong" : "text-content-muted"}`}>
            {expiredWhilePublished ? "Muddat o‘tgan — ilovada ko‘rinmaydi, muddatni uzaytiring" : "Yoqib saqlansa ilovada chiqadi"}
          </span>
        </span>
      </label>
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        <Button onClick={onClose} disabled={isSaving}>
          Yopish
        </Button>
        {!readOnly && (
          <Tooltip title={isSaving ? undefined : tooltip}>
            <Button type="primary" loading={isSaving} disabled={!isSaving && tooltip !== null} onClick={onSave}>
              {isSaving ? "Saqlanmoqda" : isNew ? "Yaratish" : "Saqlash"}
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

const UnsavedModal = ({ open, onStay, onLeave }: { open: boolean; onStay: () => void; onLeave: () => void }) => (
  <AppModal
    open={open}
    width={420}
    title="Saqlanmagan o‘zgarishlar bor"
    onCancel={onStay}
    footer={
      <>
        <Button type="primary" autoFocus onClick={onStay}>
          Qolish
        </Button>
        <Button danger onClick={onLeave}>
          Chiqish
        </Button>
      </>
    }
  >
    <p className="text-[13px] leading-relaxed text-content-secondary">Chiqsangiz ular yo‘qoladi.</p>
  </AppModal>
);

const usePartnerSave = ({
  form,
  partnerId,
  onSaved,
  onGone,
}: {
  form: PartnerForm;
  partnerId: number | null;
  onSaved: () => void;
  onGone: () => void;
}) => {
  const toast = useApiMessage();
  const { mutate, isPending } = useSavePartner();
  return {
    isSaving: isPending,
    save: () => {
      const { request, sentKeys } = formToRequest(form.values);
      mutate(
        { id: partnerId, request },
        {
          onSuccess: (partner) => {
            toast.success("Saqlandi");
            form.reset(partnerToForm(partner));
            onSaved();
          },
          onError: (error) => {
            const issue = mapPartnerSaveError(error, sentKeys, request.logoFileId);
            if (issue === null) {
              toast.error(error);
              onGone();
              return;
            }
            form.setServerIssue(issue);
          },
        },
      );
    },
  };
};

// Create / edit partner editor (recovered from the build).
export const PartnerFormPanel = ({
  open,
  partnerId,
  readOnly,
  onClose,
  onManageCategories,
}: {
  open: boolean;
  partnerId: number | null;
  readOnly: boolean;
  onClose: () => void;
  onManageCategories?: () => void;
}) => {
  const query = usePartner(open ? partnerId : null);
  const { data: categories } = useCategories();
  const form = usePartnerForm();
  const [lang, setLang] = useState<Language>("uz");
  const [unsavedOpen, setUnsavedOpen] = useState(false);
  const isUploading = useIsMutating({ mutationKey: partnerKeys.upload }) > 0;
  const { save, isSaving } = usePartnerSave({ form, partnerId, onSaved: onClose, onGone: onClose });

  // Re-seed the form whenever the panel opens on a different target.
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const ready = query.data !== undefined && (loadedKey !== null || !query.isFetching);
  const currentKey = open ? (partnerId === null ? "new" : ready ? `p${partnerId}` : null) : null;
  if (currentKey !== loadedKey) {
    if (loadedKey === null) setLang("uz");
    setLoadedKey(currentKey);
    if (currentKey === "new") form.reset(newPartnerForm());
    else if (currentKey && query.data) form.reset(partnerToForm(query.data));
  }

  const { values, validation, serverIssue } = form;
  const status = deriveStatus(values);
  const marks = languageMarks(values, [...validation.headerIssues, ...Object.values(validation.blockIssues).flat()]);

  const requestClose = () => {
    if (isSaving) return;
    if (form.isDirty && !readOnly) setUnsavedOpen(true);
    else onClose();
  };

  const showSkeleton = open && currentKey === null && !query.isError;
  const effectiveReadOnly = readOnly || isSaving;
  const manage = readOnly ? undefined : onManageCategories;

  return (
    <PartnerEditorContext.Provider value={{ lang, readOnly: effectiveReadOnly }}>
      <SidePanel
        open={open}
        wide
        onClose={requestClose}
        title={
          <EditorHeader
            title={partnerId === null ? "Yangi hamkor" : values.name.trim() || "Hamkor"}
            status={status}
            readOnly={readOnly}
            lang={lang}
            marks={marks}
            onLangChange={setLang}
          />
        }
        footer={
          <EditorFooter
            isNew={partnerId === null}
            readOnly={readOnly}
            published={values.published}
            status={status}
            missing={validation.missing}
            isUploading={isUploading}
            isSaving={isSaving}
            onPublishedChange={(value) => form.setField("published", value)}
            onClose={requestClose}
            onSave={save}
          />
        }
      >
        {serverIssue?.kind === "general" && <Alert type="error" showIcon className="!mb-3" message={serverIssue.message} />}
        {query.isError ? (
          <TableErrorState onRetry={() => void query.refetch()} />
        ) : showSkeleton ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <div className="flex max-h-[68dvh] flex-col overflow-y-auto rounded-2xl border border-border lg:h-[68dvh] lg:flex-row lg:overflow-hidden">
            <div className="border-b border-border p-4 sm:p-5 lg:w-[440px] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0">
              <PartnerHeaderForm form={form} categories={categories} onManageCategories={manage} />
            </div>
            <BlockList form={form} />
          </div>
        )}
      </SidePanel>
      <UnsavedModal
        open={unsavedOpen}
        onStay={() => setUnsavedOpen(false)}
        onLeave={() => {
          setUnsavedOpen(false);
          onClose();
        }}
      />
    </PartnerEditorContext.Provider>
  );
};
