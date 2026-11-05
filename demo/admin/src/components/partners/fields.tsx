import { EyeOutlined } from "@ant-design/icons";
import { Image, Input, Progress } from "antd";
import type { ImageProps } from "antd";
import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";
import { usePartnerFileImage } from "@/hooks/partners";
import { upper } from "@/services/partners/format";
import { usePartnerEditor } from "@/components/partners/editor-context";
import type { FileRef, Ml } from "@/services/partners/types";

// Labeled field wrapper with optional count/note/hint/error (recovered from the build).
export const LabeledField = ({
  label,
  required,
  note,
  count,
  hint,
  error,
  children,
}: {
  label: ReactNode;
  required?: boolean;
  note?: ReactNode;
  count?: { value: number; limit: number };
  hint?: string;
  error?: string | null;
  children: ReactNode;
}) => {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const over = count !== undefined && count.value > count.limit;
  const child = isValidElement(children)
    ? cloneElement(children as ReactElement, { id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })
    : children;
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-content">
          {label}
          {required && <span aria-hidden className="ml-1 text-danger">*</span>}
          {note && <span className="ml-1 font-normal text-content-muted">{note}</span>}
        </label>
        {count && (
          <span className={`text-[11px] tabular-nums ${over ? "font-semibold text-danger-strong" : "text-content-muted"}`}>
            {count.value}/{count.limit}
          </span>
        )}
      </div>
      {child}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger-strong">
          {error}
        </p>
      ) : (
        hint && <p id={`${id}-hint`} className="text-[11px] leading-relaxed text-content-muted">{hint}</p>
      )}
    </div>
  );
};

// A single-language slice of a multilingual draft (recovered from the build). Shows the
// active language from context; TG placeholder falls back to the RU draft.
export const DraftField = ({
  label,
  draft,
  limit,
  onChange,
  required,
  optional,
  multiline,
  placeholder,
  hint,
  error,
}: {
  label: ReactNode;
  draft: Ml;
  limit: number;
  onChange: (value: string) => void;
  required?: boolean;
  optional?: boolean;
  multiline?: boolean;
  placeholder?: string;
  hint?: string;
  error?: string | null;
}) => {
  const { lang, readOnly } = usePartnerEditor();
  const value = draft[lang];
  const note = `${optional ? "· ixtiyoriy " : ""}· ${upper(lang)}`;
  const shownPlaceholder = lang === "tg" && draft.ru ? draft.ru : placeholder;
  const status = error ? ("error" as const) : undefined;
  return (
    <LabeledField label={label} required={required} note={note} count={{ value: value.trim().length, limit }} hint={hint} error={error}>
      {multiline ? (
        <Input.TextArea
          value={value}
          maxLength={limit}
          onChange={(e) => onChange(e.target.value)}
          placeholder={shownPlaceholder}
          autoSize={{ minRows: 2, maxRows: 8 }}
          readOnly={readOnly}
          status={status}
        />
      ) : (
        <Input
          value={value}
          maxLength={limit}
          onChange={(e) => onChange(e.target.value)}
          placeholder={shownPlaceholder}
          readOnly={readOnly}
          status={status}
        />
      )}
    </LabeledField>
  );
};

// Upload progress / error line (recovered from the build).
export const UploadStatus = ({
  isUploading,
  progress,
  error,
}: {
  isUploading: boolean;
  progress: number;
  error?: string | null;
}) => {
  if (isUploading) {
    return (
      <div className="flex items-center gap-2">
        <Progress percent={progress} showInfo={false} size="small" className="!m-0 flex-1" />
        <span className="text-xs text-content-muted tabular-nums">{progress}%</span>
      </div>
    );
  }
  if (error) {
    return (
      <p role="alert" className="text-xs text-danger-strong">
        {error}
      </p>
    );
  }
  return null;
};

// Renders a partner file as an image, or a fallback when unavailable (recovered from the build).
export const PartnerFileImage = ({
  file,
  className,
  fallback,
  preview = true,
}: {
  file: FileRef["file"] | null | undefined;
  className?: string;
  fallback: ReactNode;
  preview?: boolean;
}) => {
  const { data } = usePartnerFileImage(file?.id);
  if (data) {
    return (
      <Image
        src={data}
        alt=""
        rootClassName={`${className ?? ""} overflow-hidden`}
        className="size-full object-cover"
        preview={preview ? ({ cover: <EyeOutlined /> } as ImageProps["preview"]) : false}
      />
    );
  }
  return <>{fallback}</>;
};

// Partner logo avatar with initial fallback (recovered from the build).
const AVATAR_SIZE = { sm: "size-9 rounded-lg text-[13px]", md: "size-14 rounded-2xl text-lg" } as const;

export const PartnerAvatar = ({
  name,
  logo,
  size = "sm",
  preview = true,
}: {
  name: string;
  logo: FileRef["file"] | null | undefined;
  size?: "sm" | "md";
  preview?: boolean;
}) => (
  <PartnerFileImage
    file={logo}
    preview={preview}
    className={`${AVATAR_SIZE[size]} shrink-0 border border-border bg-surface`}
    fallback={
      <div
        aria-hidden
        className={`${AVATAR_SIZE[size]} flex shrink-0 items-center justify-center bg-accent-soft font-semibold text-accent`}
      >
        {name.trim().slice(0, 1).toUpperCase() || "?"}
      </div>
    }
  />
);
