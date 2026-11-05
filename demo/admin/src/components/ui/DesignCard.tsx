import type { ReactNode } from "react";

// Simple surface card with optional title/extra header (recovered from the build).
interface DesignCardProps {
  title?: ReactNode;
  extra?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export const DesignCard = ({ title, extra, className = "", children }: DesignCardProps) => (
  <section className={`flex flex-col gap-3 rounded-lg bg-surface p-5 shadow-card ${className}`}>
    {(title || extra) && (
      <div className="flex items-center justify-between gap-3">
        {title && <h2 className="text-[15px] font-semibold text-content">{title}</h2>}
        {extra}
      </div>
    )}
    {children}
  </section>
);
