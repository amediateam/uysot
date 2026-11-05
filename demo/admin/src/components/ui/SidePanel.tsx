import { Drawer } from "antd";
import type { DrawerProps } from "antd";
import type { ReactNode } from "react";
import { useMediaUp } from "@/hooks/use-media-up";

// Responsive side drawer (recovered from the build). Three layouts: a standard form
// panel, a `detail` panel (title on the right, wider header), and a `wide` panel.
interface SidePanelProps {
  open: boolean;
  title?: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  detail?: boolean;
  wide?: boolean;
  children?: ReactNode;
}

const DETAIL_HEADER =
  "border-b-0! px-6! pt-6! pb-2! [&_.ant-drawer-close]:size-7! [&_.ant-drawer-close]:rounded-full! [&_.ant-drawer-close]:bg-surface-muted! [&_.ant-drawer-close]:text-content-muted!";

export const SidePanel = ({
  open,
  title,
  onClose,
  footer,
  detail = false,
  wide = false,
  children,
}: SidePanelProps) => {
  const isDesktop = useMediaUp("sm");
  const width = isDesktop ? (wide ? "min(1000px, 100vw)" : detail ? 480 : 460) : "100%";
  return (
    <Drawer
      open={open}
      title={title}
      onClose={onClose}
      width={width}
      destroyOnHidden
      closable={{ "aria-label": "Yopish", placement: detail ? "end" : "start" }}
      classNames={
        (detail
          ? { header: DETAIL_HEADER, title: "text-[17px]! font-semibold!", body: "px-6! pt-2!" }
          : wide
            ? { body: "p-0!" }
            : undefined) as DrawerProps["classNames"]
      }
      footer={
        footer && (
          <div className="flex flex-col-reverse gap-2 py-1 sm:flex-row sm:justify-end">{footer}</div>
        )
      }
    >
      {children}
    </Drawer>
  );
};
