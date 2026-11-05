import { DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import { useState } from "react";
import { useAuditFiltersQuery, useAuditQuery } from "@/hooks/audit";
import { formatNumber } from "@/utils/format-number";
import { formatDateTime } from "@/utils/format-date-time";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { AppSelect } from "@/components/ui/AppSelect";
import { TableEmptyState } from "@/components/ui/TableEmptyState";
import type { AuditEntry, AuditFilters } from "@/services/audit/types";

const { RangePicker } = DatePicker;

const useAuditFiltersState = () => {
  const [adminId, setAdminId] = useState<number>();
  const [action, setAction] = useState<string>();
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [page, setPage] = useState(0);
  return {
    adminId,
    action,
    range,
    page,
    filters: {
      adminId,
      action,
      from: range?.[0]?.startOf("day").toISOString(),
      to: range?.[1]?.endOf("day").toISOString(),
      page,
      size: 20,
    } satisfies AuditFilters,
    setAdminId: (value: number | undefined) => {
      setAdminId(value);
      setPage(0);
    },
    setAction: (value: string | undefined) => {
      setAction(value);
      setPage(0);
    },
    setRange: (value: [Dayjs, Dayjs] | null) => {
      setRange(value);
      setPage(0);
    },
    setPage,
    clearFilters: () => {
      setAdminId(undefined);
      setAction(undefined);
      setRange(null);
      setPage(0);
    },
  };
};

type AuditFiltersState = ReturnType<typeof useAuditFiltersState>;

// Raw (`admin.*`) vs semantic action names are grouped separately in the filter.
const isRawAction = (action: string) => action.split(".")[0] === "admin";

const AuditToolbar = ({ filters, totalElements }: { filters: AuditFiltersState; totalElements?: number }) => {
  const { data } = useAuditFiltersQuery();
  const actions = data?.actions ?? [];
  const actionOptions = [
    {
      label: "Semantik amallar",
      options: actions.filter((a) => !isRawAction(a)).map((a) => ({ value: a, label: a })),
    },
    {
      label: "Xom so‘rovlar",
      options: actions.filter(isRawAction).map((a) => ({ value: a, label: a })),
    },
  ];

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <span className="shrink-0 text-[13px] text-content-muted">Operator:</span>
        <AppSelect<number>
          value={filters.adminId}
          onChange={filters.setAdminId}
          placeholder="hammasi"
          allowClear
          className="w-full sm:w-auto sm:min-w-48"
          options={(data?.operators ?? []).map((operator) => ({
            value: operator.adminId,
            label: operator.fullName,
          }))}
        />
      </div>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <span className="shrink-0 text-[13px] text-content-muted">Amal:</span>
        <AppSelect<string>
          value={filters.action}
          onChange={filters.setAction}
          placeholder="hammasi"
          allowClear
          className="w-full sm:w-auto sm:min-w-64"
          options={actionOptions}
        />
      </div>
      <RangePicker value={filters.range} onChange={(value) => filters.setRange(value as [Dayjs, Dayjs] | null)} className="w-full sm:w-auto" />
      <span className="text-[13px] text-content-muted sm:ml-auto">{formatNumber(totalElements)} yozuv</span>
    </div>
  );
};

const PayloadDetail = ({ entry }: { entry: AuditEntry }) => {
  if (entry.payload) {
    return (
      <div className="px-4 py-3">
        <div className="mb-2 flex items-baseline gap-2">
          <span className="text-xs font-medium text-content">payload</span>
          <span className="text-xs text-content-muted">maxfiy qiymatlar maskalangan</span>
        </div>
        <pre className="overflow-x-auto rounded-lg bg-surface-muted px-4 py-3 font-mono text-xs leading-relaxed text-content">
          {JSON.stringify(entry.payload, null, 2)}
        </pre>
        <p className="mt-2 text-xs text-content-muted">
          Maskalanish ataylab: parol va token jurnalga hech qachon ochiq yozilmaydi.
        </p>
      </div>
    );
  }
  return <p className="px-4 py-3 text-[13px] text-content-muted">payload yo‘q</p>;
};

const columns: ColumnsType<AuditEntry> = [
  {
    title: "Vaqt",
    key: "createdAt",
    width: 180,
    render: (_v, record) => (
      <span className="text-[13px] whitespace-nowrap text-content-muted tabular-nums">
        {formatDateTime(record.createdAt)}
      </span>
    ),
  },
  {
    title: "Operator",
    key: "operator",
    width: 190,
    render: (_v, record) =>
      record.adminId ? (
        <div>
          <p className="text-[13px] text-content">{record.fullName}</p>
          <p className="text-xs text-content-muted">{record.username}</p>
        </div>
      ) : (
        <span className="text-content-muted">—</span>
      ),
  },
  {
    title: "Amal",
    key: "action",
    render: (_v, record) => <span className="font-mono text-xs whitespace-nowrap text-content">{record.action}</span>,
  },
  {
    title: "Metod va yo‘l",
    key: "path",
    render: (_v, record) =>
      record.path ? (
        <span className="font-mono text-xs whitespace-nowrap text-content-secondary">
          {record.method} {record.path}
        </span>
      ) : (
        <span className="text-content-muted">—</span>
      ),
  },
  {
    title: "Status",
    key: "statusCode",
    width: 90,
    render: (_v, record) =>
      record.statusCode ? (
        <span className="text-[13px] text-content tabular-nums">{record.statusCode}</span>
      ) : (
        <span className="text-content-muted">—</span>
      ),
  },
  {
    title: "IP",
    key: "ip",
    width: 130,
    render: (_v, record) => <span className="font-mono text-xs text-content-muted">{record.ip ?? "—"}</span>,
  },
];

export const AuditPage = () => {
  const filters = useAuditFiltersState();
  const { data, isPending, isError, refetch } = useAuditQuery(filters.filters);

  return (
    <>
      <PageHeader
        title="Audit jurnali"
        description="Har bir o‘zgartiruvchi so‘rov yoziladi. Parol va token qiymatlari maskalanadi."
      />
      <AuditToolbar filters={filters} totalElements={data?.totalElements} />
      <DataTable<AuditEntry>
        columns={columns}
        data={data?.elements}
        rowKey="id"
        isLoading={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        emptyState={
          <TableEmptyState
            title="Yozuv topilmadi"
            description="Tanlangan filtrlar bo‘yicha audit yozuvi yo‘q. Sana oralig‘ini kengaytiring yoki filtrni tozalang."
            action={{ label: "Filtrni tozalash", onClick: filters.clearFilters }}
          />
        }
        expandable={{ expandedRowRender: (entry) => <PayloadDetail entry={entry} /> }}
        pagination={{
          page: filters.page,
          size: filters.filters.size,
          totalElements: data?.totalElements ?? 0,
          onChange: filters.setPage,
        }}
      />
    </>
  );
};
