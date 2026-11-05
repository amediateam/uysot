import { Modal } from "antd";
import type { ReactNode } from "react";
import { useMediaUp } from "@/hooks/use-media-up";

// Responsive modal (recovered from the build): fixed width on desktop, near-full on mobile,
// with a right-aligned footer button row.
interface AppModalProps {
  open: boolean;
  title?: ReactNode;
  onCancel: () => void;
  footer?: ReactNode;
  width?: number;
  children?: ReactNode;
}

export const AppModal = ({ open, title, onCancel, footer, width = 480, children }: AppModalProps) => {
  const isDesktop = useMediaUp("sm");
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      footer={
        footer ? (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">{footer}</div>
        ) : null
      }
      width={isDesktop ? width : "calc(100vw - 2rem)"}
      centered
      destroyOnHidden
    >
      {children}
    </Modal>
  );
};
