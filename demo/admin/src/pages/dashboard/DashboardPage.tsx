import { Alert, Button, Skeleton } from "antd";
import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { isAdmin } from "@/permissions";
import { isApiError } from "@/services/api-error";
import { useAuth } from "@/hooks/use-auth";
import { useDashboardQuery } from "@/hooks/dashboard";
import { formatNumber } from "@/utils/format-number";
import { formatDateTime } from "@/utils/format-date-time";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusChip } from "@/components/ui/StatusChip";
import { CompanyFormPanel } from "@/components/companies/CompanyFormPanel";

const SummaryCard = ({
  title,
  badge,
  linkTo,
  linkLabel,
  children,
}: {
  title: ReactNode;
  badge?: ReactNode;
  linkTo?: string;
  linkLabel?: string;
  children: ReactNode;
}) => (
  <section className="flex flex-col rounded-xl border border-border bg-surface p-5">
    <div className="mb-4 flex items-center gap-2">
      <h2 className="text-sm font-medium text-content">{title}</h2>
      {badge}
    </div>
    <div className="flex-1">{children}</div>
    {linkTo && linkLabel && (
      <Link to={linkTo} className="mt-4 text-[13px] font-medium text-accent hover:text-accent-hover">
        {linkLabel}
      </Link>
    )}
  </section>
);

const Metric = ({
  value,
  unit,
  emptyLabel,
}: {
  value: number | null;
  unit: string;
  emptyLabel?: string;
}) => {
  if (value === null && emptyLabel) {
    return <p className="text-xl font-medium text-content-muted">{emptyLabel}</p>;
  }
  return (
    <p className="flex items-baseline gap-2">
      <span className="text-3xl font-semibold text-content tabular-nums">{formatNumber(value)}</span>
      <span className="text-[13px] text-content-muted">{unit}</span>
    </p>
  );
};

export const DashboardPage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { data, isPending, isError, error, refetch } = useDashboardQuery();
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Bosh sahifa"
        description="Ish navbati va joriy holat — faqat bazadagi ma’lumot bo‘yicha."
        actions={
          isAdmin(role) && (
            <Button type="primary" onClick={() => setOpen(true)}>
              Kompaniya qo‘shish
            </Button>
          )
        }
      />
      <CompanyFormPanel
        open={open}
        company={null}
        onClose={() => setOpen(false)}
        onCreated={() => navigate(ROUTES.companies)}
      />
      {isError && (
        <Alert
          type="error"
          showIcon
          className="mb-6"
          message="Server javob bermadi"
          description={isApiError(error) ? error.message : undefined}
          action={
            <Button size="small" onClick={() => void refetch()}>
              Qayta urinish
            </Button>
          }
        />
      )}
      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((key) => (
            <div key={key} className="rounded-xl border border-border bg-surface p-5">
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard
            title="Biriktirilmagan kompaniyalar"
            badge={
              <div className="mb-1.5">
                <StatusChip tone="warning" label="navbat" />
              </div>
            }
            linkTo={ROUTES.companiesUnlinked}
            linkLabel="ko‘rish →"
          >
            <Metric value={data?.unlinkedCount ?? null} unit="kompaniya" />
            <p className="mt-2 text-[13px] text-content-muted">Shartnomalarda uchraydi, bazamizda yo‘q.</p>
          </SummaryCard>
          {data?.eskiz && (
            <SummaryCard title="Eskiz balansi" linkTo={ROUTES.eskiz} linkLabel="sozlamalar →">
              <Metric value={data.eskiz.balance} unit="SMS" emptyLabel="ma’lumot yo‘q" />
              <p className="mt-2 text-[13px] text-content-muted">{data.eskiz.activeUsername}</p>
              {data.eskiz.balance === null && (
                <p className="mt-2 text-xs leading-relaxed text-content-muted">
                  Eskiz balansni qaytarmadi. Bu xato emas — SMS yuborish ishlashda davom etadi.
                </p>
              )}
            </SummaryCard>
          )}
          <SummaryCard title="Kompaniyalar" linkTo={ROUTES.companies} linkLabel="ro‘yxatga o‘tish →">
            <Metric value={data?.companies.total ?? null} unit="jami" />
            <div className="mt-3 flex items-center gap-2">
              <StatusChip tone="accent" label={`PRO · ${formatNumber(data?.companies.premium)}`} />
              <span className="text-[13px] text-content-muted">
                qolgan {formatNumber(data?.companies.plain)} oddiy
              </span>
            </div>
          </SummaryCard>
        </div>
      )}
      {data?.recentAudit && (
        <section className="mt-4 rounded-xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-content">Audit jurnali — oxirgi 8 yozuv</h2>
            <Link to={ROUTES.audit} className="text-[13px] font-medium text-accent">
              Hammasi
            </Link>
          </div>
          <ul className="flex flex-col">
            {data.recentAudit.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center gap-4 border-b border-border py-2.5 text-[13px] last:border-b-0"
              >
                <span className="w-40 shrink-0 text-content-muted tabular-nums">{formatDateTime(entry.createdAt)}</span>
                <span className="w-44 shrink-0 truncate text-content">{entry.fullName ?? "—"}</span>
                <span className="truncate font-mono text-xs text-content-secondary">{entry.action}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};
