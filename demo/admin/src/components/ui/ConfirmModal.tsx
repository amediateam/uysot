import { Button } from "antd";
import type { ReactNode } from "react";
import { AppModal } from "@/components/ui/AppModal";

// Confirmation dialog (recovered from the build), with an optional audit-log note.
interface ConfirmModalProps {
  open: boolean;
  title?: ReactNode;
  description?: ReactNode;
  tone?: "neutral" | "danger";
  confirmLabel: ReactNode;
  cancelLabel?: ReactNode;
  loading?: boolean;
  auditNote?: boolean;
  extraAction?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export const ConfirmModal = ({
  open,
  title,
  description,
  tone = "neutral",
  confirmLabel,
  cancelLabel = "Bekor qilish",
  loading = false,
  auditNote = false,
  extraAction,
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) => (
  <AppModal
    open={open}
    title={title}
    onCancel={onCancel}
    footer={
      <>
        {extraAction}
        <Button onClick={onCancel}>{cancelLabel}</Button>
        <Button type="primary" danger={tone === "danger"} loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    {description && <p className="text-[13px] leading-relaxed text-content-secondary">{description}</p>}
    {children && <div className="mt-4">{children}</div>}
    {auditNote && <p className="mt-5 text-xs text-content-muted">Bu amal audit jurnaliga yoziladi.</p>}
  </AppModal>
);
