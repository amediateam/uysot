import { Button, Switch } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { isAdmin } from "@/permissions";
import { useAuth } from "@/hooks/use-auth";
import { useApiMessage } from "@/hooks/use-api-message";
import { formatNumber } from "@/utils/format-number";
import { formatDateTime } from "@/utils/format-date-time";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { StatusChip } from "@/components/ui/StatusChip";
import { FilterSegmented } from "@/components/ui/FilterSegmented";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TableEmptyState } from "@/components/ui/TableEmptyState";
import { CompanyNameCell } from "@/components/companies/CompanyNameCell";
import { CompanyFormPanel } from "@/components/companies/CompanyFormPanel";
import { useCompaniesQuery, useToggleCompanyPremium } from "@/hooks/companies";
import { useCompaniesUi } from "@/pages/companies/companies-ui";
import type { Company } from "@/services/companies/types";

type PremiumFilterKey = "all" | "premium" | "plain";

const PREMIUM_OPTIONS: { value: PremiumFilterKey; label: string }[] = [
  { value: "all", label: "Hammasi" },
  { value: "premium", label: "Faqat PRO" },
  { value: "plain", label: "Faqat oddiy" },
];

const PREMIUM_FILTER_VALUE: Record<PremiumFilterKey, boolean | null> = {
  all: null,
  premium: true,
  plain: false,
};

interface PremiumTarget {
  company: Company;
  nextValue: boolean;
}

const CompaniesToolbar = ({
  search,
  isPremium,
  totalElements,
  onSearchChange,
  onPremiumChange,
}: {
  search: string;
  isPremium: boolean | null;
  totalElements?: number;
  onSearchChange: (value: string) => void;
  onPremiumChange: (value: boolean | null) => void;
}) => (
  <div className="mb-4 flex flex-wrap items-center gap-3">
    <SearchInput
      value={search}
      onChange={onSearchChange}
      placeholder="nom yoki Uysot id"
      label="Kompaniya qidirish"
    />
    <FilterSegmented<PremiumFilterKey>
      value={isPremium === null ? "all" : isPremium ? "premium" : "plain"}
      options={PREMIUM_OPTIONS}
      onChange={(key) => onPremiumChange(PREMIUM_FILTER_VALUE[key])}
      label="PRO bo‘yicha filtr"
    />
    <span className="text-[13px] text-content-muted tabular-nums sm:ml-auto">
      {formatNumber(totalElements)} kompaniya
    </span>
  </div>
);

const PremiumCell = ({
  company,
  canWrite,
  isPending,
  onRequestChange,
}: {
  company: Company;
  canWrite: boolean;
  isPending: boolean;
  onRequestChange: (company: Company, nextValue: boolean) => void;
}) => {
  if (canWrite) {
    return (
      <Switch
        checked={company.isPremium}
        loading={isPending}
        onChange={(next) => onRequestChange(company, next)}
        aria-label={`${company.companyName} PRO rejasi`}
      />
    );
  }
  return company.isPremium ? (
    <StatusChip tone="accent" label="PRO" />
  ) : (
    <StatusChip tone="neutral" label="oddiy" />
  );
};

const PremiumConfirm = ({
  target,
  loading,
  onConfirm,
  onCancel,
}: {
  target: PremiumTarget | null;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const enabling = target?.nextValue ?? false;
  return (
    <ConfirmModal
      open={target !== null}
      title={enabling ? "PRO rejasini yoqish?" : "PRO rejasini o‘chirish?"}
      tone={enabling ? "neutral" : "danger"}
      confirmLabel={enabling ? "PRO ni yoqish" : "PRO ni o‘chirish"}
      loading={loading}
      auditNote
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {target && (
        <>
          <div className="flex items-center gap-3 rounded-lg bg-surface-muted px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-sm font-medium text-content-secondary">
              {target.company.companyName.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-content">{target.company.companyName}</p>
              <p className="text-xs text-content-muted tabular-nums">{target.company.companyId}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6">
            <div>
              <p className="text-xl font-semibold text-content tabular-nums">
                {formatNumber(target.company.contractCount)}
              </p>
              <p className="text-xs text-content-muted">shartnoma</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-content tabular-nums">
                {formatNumber(target.company.userCount)}
              </p>
              <p className="text-xs text-content-muted">mijoz</p>
            </div>
            <p className="text-[13px] text-content-secondary">ta’sir qiladi</p>
          </div>
        </>
      )}
    </ConfirmModal>
  );
};

const CompaniesTable = ({ canWrite, onEdit }: { canWrite: boolean; onEdit: (company: Company) => void }) => {
  const toast = useApiMessage();
  const { ui, filters, setSearch, setPremiumFilter, setPage, clearFilters } = useCompaniesUi();
  const { data, isPending, isError, refetch } = useCompaniesQuery(filters);
  const togglePremium = useToggleCompanyPremium();
  const [target, setTarget] = useState<PremiumTarget | null>(null);

  const onConfirm = () => {
    if (!target) return;
    const { company, nextValue } = target;
    togglePremium.mutate(
      { id: company.id, isPremium: nextValue },
      {
        onSuccess: (updated) => {
          setTarget(null);
          toast.success(
            `${updated.isPremium ? "PRO yoqildi" : "PRO o‘chirildi"} · ${updated.companyName} · ${updated.companyId}`,
          );
        },
        onError: (error) => toast.error(error),
      },
    );
  };

  const columns: ColumnsType<Company> = [
    { title: "Kompaniya", key: "company", render: (_v, record) => <CompanyNameCell company={record} /> },
    {
      title: "Brend",
      key: "brand",
      width: 130,
      render: (_v, record) =>
        record.brand ? (
          <span className="text-[13px] text-content">{record.brand.name}</span>
        ) : (
          <span className="text-content-muted">—</span>
        ),
    },
    {
      title: "PRO",
      key: "premium",
      width: 96,
      render: (_v, record) => (
        <PremiumCell
          company={record}
          canWrite={canWrite}
          isPending={togglePremium.isPending && target?.company.id === record.id}
          onRequestChange={(company, nextValue) => setTarget({ company, nextValue })}
        />
      ),
    },
    {
      title: "Shartnoma",
      key: "contracts",
      align: "right",
      width: 120,
      render: (_v, record) => (
        <span className="font-mono text-[14px] font-medium text-content tabular-nums">
          {formatNumber(record.contractCount)}
        </span>
      ),
    },
    {
      title: "Mijoz",
      key: "users",
      align: "right",
      width: 110,
      render: (_v, record) => (
        <span className="font-mono text-[14px] font-medium text-content tabular-nums">
          {formatNumber(record.userCount)}
        </span>
      ),
    },
    {
      title: "Oxirgi o‘zgarish",
      key: "updated",
      align: "right",
      width: 160,
      render: (_v, record) => (
        <span className="font-mono text-[13px] text-content-muted tabular-nums">
          {formatDateTime(record.updatedAt ?? record.insertAt)}
        </span>
      ),
    },
  ];

  if (canWrite) {
    columns.push({
      title: <span className="sr-only">Amallar</span>,
      key: "actions",
      width: 110,
      align: "right",
      render: (_v, record) => (
        <Button type="link" size="small" onClick={() => onEdit(record)}>
          Tahrirlash
        </Button>
      ),
    });
  }

  return (
    <>
      <CompaniesToolbar
        search={ui.search}
        isPremium={ui.isPremium}
        totalElements={data?.totalElements}
        onSearchChange={setSearch}
        onPremiumChange={setPremiumFilter}
      />
      <DataTable<Company>
        columns={columns}
        data={data?.elements}
        rowKey="id"
        isLoading={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        emptyState={
          <TableEmptyState
            title="Natija topilmadi"
            description={`“${ui.search}” bo‘yicha kompaniya yo‘q. Nomni yoki Uysot id ni tekshirib ko‘ring.`}
            action={{ label: "Qidiruvni tozalash", onClick: clearFilters }}
          />
        }
        pagination={{
          page: filters.page,
          size: filters.size,
          totalElements: data?.totalElements ?? 0,
          onChange: setPage,
        }}
      />
      <PremiumConfirm
        target={target}
        loading={togglePremium.isPending}
        onConfirm={onConfirm}
        onCancel={() => setTarget(null)}
      />
    </>
  );
};

export const CompaniesPage = () => {
  const { role } = useAuth();
  const canWrite = isAdmin(role);
  const [editing, setEditing] = useState<Company | null>(null);
  const [open, setOpen] = useState(false);

  const onEdit = (company: Company | null) => {
    setEditing(company);
    setOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Kompaniyalar"
        description={
          canWrite
            ? "Uysot bazasidagi kompaniyalar, PRO rejasi va bog‘langan shartnomalar."
            : "Faqat ko‘rish uchun — o‘zgartirish ruxsati yo‘q."
        }
        badge={!canWrite && <StatusChip tone="neutral" label="VIEWER · faqat o‘qish" />}
        actions={
          canWrite && (
            <Button type="primary" onClick={() => onEdit(null)}>
              Kompaniya qo‘shish
            </Button>
          )
        }
      />
      <CompaniesTable canWrite={canWrite} onEdit={onEdit} />
      <CompanyFormPanel open={open} company={editing} onClose={() => setOpen(false)} />
    </>
  );
};
