import { Button } from "antd";
import type { ReactNode } from "react";

// Empty-list placeholder (recovered from the build).
interface TableEmptyStateProps {
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  action?: { label: ReactNode; onClick: () => void };
}

export const TableEmptyState = ({ title, description, icon, action }: TableEmptyStateProps) => (
  <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
    {icon && (
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-content-muted">
        {icon}
      </div>
    )}
    <p className="text-sm font-medium text-content">{title}</p>
    <p className="mt-1 max-w-md text-[13px] leading-relaxed text-content-secondary">{description}</p>
    {action && (
      <Button type="primary" className="mt-5" onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </div>
);
