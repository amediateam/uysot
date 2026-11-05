import type { ReactNode } from "react";

// Page header with title, optional description, badge and actions (recovered from the build).
interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
}

export const PageHeader = ({ title, description, badge, actions }: PageHeaderProps) => (
  <header className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <h1 className="text-lg font-semibold tracking-tight text-content sm:truncate sm:text-xl">{title}</h1>
        {badge}
      </div>
      {description && <p className="mt-1 text-[13px] text-content-secondary">{description}</p>}
    </div>
    {actions && (
      <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:flex-nowrap">{actions}</div>
    )}
  </header>
);
