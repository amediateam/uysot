import type { ReactNode } from "react";
import type { Company } from "@/services/companies/types";

// Avatar + name/meta cell used in company tables (recovered from the build).
const NameWithAvatar = ({
  name,
  meta,
  initial,
  onClick,
}: {
  name: string;
  meta?: ReactNode;
  initial?: string;
  onClick?: () => void;
}) => (
  <div className="flex items-center gap-3">
    <div
      aria-hidden
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[13px] font-semibold text-accent"
    >
      {initial ?? name.slice(0, 1).toUpperCase()}
    </div>
    <div className="min-w-0">
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="max-w-full truncate text-left text-[14px] font-medium text-content hover:text-accent"
        >
          {name}
        </button>
      ) : (
        <p className="mb-0 truncate text-[14px] font-medium text-content">{name}</p>
      )}
      {meta && <p className="mb-0 truncate font-mono text-xs text-content-muted tabular-nums">{meta}</p>}
    </div>
  </div>
);

export const CompanyNameCell = ({ company }: { company: Company }) => (
  <NameWithAvatar name={company.companyName} meta={String(company.companyId)} />
);
