import { DatePicker, Input, Skeleton, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { isAccessDenied, isApiError } from "@/services/api-error";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useServicePayment, useServicePaymentAttempts, useServicePayments } from "@/hooks/design";
import { formatNumber } from "@/utils/format-number";
import { formatDateTime } from "@/utils/format-date-time";
import { normalizePhone, toTashkentDayBounds } from "@/utils/to-tashkent-day-bounds";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { AppSelect } from "@/components/ui/AppSelect";
import { SidePanel } from "@/components/ui/SidePanel";
import { StatusChip } from "@/components/ui/StatusChip";
import { TableEmptyState } from "@/components/ui/TableEmptyState";
import { Forbidden } from "@/pages/forbidden/Forbidden";
import { PAYMENT_STATUS_TONE } from "@/pages/design/style-catalog";
import type { ServicePayment, ServicePaymentStatus } from "@/services/design/types";

const QUERY_PARAM = "tolov";

// A payment that was accepted but later ended up failed/reversed (service delivered, then undone).
const isServedThenReversed = ({ acceptedAt, status }: ServicePayment): boolean =>
  acceptedAt !== null && (status === "FAILED" || status === "REVERSED");

const STATUS_OPTIONS = (Object.keys(PAYMENT_STATUS_TONE) as ServicePaymentStatus[]).map((value) => ({
  value,
  label: value,
}));

const TIMELINE_DOT: Record<string, string> = {
  neutral: "bg-border-strong",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  progress: "bg-progress",
};

const usePaymentFilters = () => {
  const [status, setStatus] = useState<ServicePaymentStatus>();
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [page, setPage] = useState(0);

  const debouncedPhone = useDebouncedValue(phone);
  const debouncedUserId = useDebouncedValue(userId);
  const filters = {
    purpose: "DESIGN" as const,
    status,
    phone: normalizePhone(debouncedPhone),
    userId: /^\d+$/.test(debouncedUserId) ? Number(debouncedUserId) : undefined,
    ...toTashkentDayBounds(range?.[0]?.format("YYYY-MM-DD"), range?.[1]?.format("YYYY-MM-DD")),
    page,
    size: 20,
  };

  const resetPage =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(0);
    };

  return {
    status,
    phone,
    userId,
    range,
    filters,
    hasFilters: !!(status || phone || userId || range),
    setStatus: resetPage(setStatus),
    setPhone: resetPage(setPhone),
    setUserId: resetPage(setUserId),
    setRange: resetPage(setRange),
    setPage,
    clearFilters: () => {
      setStatus(undefined);
      setPhone("");
      setUserId("");
      setRange(null);
      setPage(0);
    },
  };
};

type PaymentFilters = ReturnType<typeof usePaymentFilters>;

const AttemptsTimeline = ({ payment }: { payment: ServicePayment }) => {
  const { data, isPending, isError } = useServicePaymentAttempts(payment);
  return (
    <section className="flex flex-col gap-2.5">
      <h3 className="text-[13px] font-semibold text-content">Buyurtma #{payment.referenceId} bo‘yicha urinishlar</h3>
      {isPending ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : isError ? (
        <p className="text-xs text-content-muted">Urinishlarni yuklab bo‘lmadi.</p>
      ) : (
        <ol>
          {data.map((attempt, index) => {
            const tone = PAYMENT_STATUS_TONE[attempt.status];
            const isLast = index === data.length - 1;
            return (
              <li key={attempt.id} className="flex gap-3">
                <div className="flex w-3.5 flex-col items-center">
                  <span className={`mt-1 size-2.5 rounded-full ${TIMELINE_DOT[tone]}`} />
                  {!isLast && <span className="mt-1 w-0.5 flex-1 bg-border" />}
                </div>
                <div className="flex flex-1 flex-col gap-1.5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-content">Urinish {attempt.attempt}</span>
                    <StatusChip tone={tone} label={attempt.status} />
                    <span className="ml-auto text-[11px] text-content-muted tabular-nums">
                      {formatDateTime(attempt.createdAt)}
                    </span>
                  </div>
                  {attempt.lastError && (
                    <p className="rounded-md bg-danger-soft px-2.5 py-2 font-mono text-[11px] leading-normal text-danger-strong">
                      {attempt.lastError}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
};

const detailRows = (payment: ServicePayment): [string, string][] => [
  ["Buyurtma", `#${payment.referenceId} · urinish ${payment.attempt}`],
  ["userId", String(payment.userId)],
  ["Telefon", payment.userPhone],
  ["Karta", payment.maskedPan ?? "—"],
  ["externalId", payment.externalId ?? "—"],
  ["transactionId", payment.transactionId ?? "—"],
  ["Qabul qilingan", formatDateTime(payment.acceptedAt)],
  ["Yaratilgan", formatDateTime(payment.createdAt)],
  ["lastError", payment.lastError ?? "—"],
];

const PaymentDetailPanel = ({ paymentId, onClose }: { paymentId: number | null; onClose: () => void }) => {
  const { data, isPending, error } = useServicePayment(paymentId);
  return (
    <SidePanel
      open={paymentId !== null}
      title={
        <span className="flex items-center gap-2.5">
          To‘lov {formatNumber(paymentId)}
          {data && <StatusChip tone={PAYMENT_STATUS_TONE[data.status]} label={data.status} />}
        </span>
      }
      onClose={onClose}
      detail
    >
      {error ? (
        <p className="text-[13px] text-danger-strong">
          {isAccessDenied(error)
            ? "Bu bo‘lim sizning rolingiz uchun ochiq emas"
            : isApiError(error)
              ? error.message
              : "To‘lovni yuklab bo‘lmadi."}
        </p>
      ) : isPending ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <div className="flex flex-col gap-4">
          <p className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-[32px] leading-none font-bold tracking-tight text-content tabular-nums">
              {formatNumber(data.amount)}
            </span>
            <span className="text-[13px] text-content-muted">
              so‘m · {data.acceptedAt ? `✓ qabul qilingan ${formatDateTime(data.acceptedAt)}` : "qabul qilinmagan"}
            </span>
          </p>
          <dl className="grid grid-cols-[130px_minmax(0,1fr)] gap-x-3 gap-y-2.5 rounded-md bg-surface-muted p-3.5 text-xs">
            {detailRows(data).map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-content-muted">{label}</dt>
                <dd className="truncate font-mono text-content" title={value}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          {data.ofdUrl && (
            <a href={data.ofdUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold">
              OFD chekini ochish →
            </a>
          )}
          <AttemptsTimeline payment={data} />
        </div>
      )}
    </SidePanel>
  );
};

const AcceptedCell = ({ payment }: { payment: ServicePayment }) => (
  <div className="flex flex-col gap-px text-xs whitespace-nowrap">
    {payment.acceptedAt ? (
      <span className="font-medium text-success-strong">
        ✓ Qabul qilingan <span className="font-normal text-content-muted tabular-nums">{formatDateTime(payment.acceptedAt)}</span>
      </span>
    ) : (
      <span className="text-content-muted">Qabul qilinmagan</span>
    )}
    {isServedThenReversed(payment) && (
      <span className="text-[11px] font-semibold text-warning-strong">⚠ Xizmat berilgan, keyin bekor qilingan</span>
    )}
  </div>
);

const PaymentsToolbar = ({ filters }: { filters: PaymentFilters }) => (
  <div className="mb-4 flex flex-wrap items-center gap-2.5">
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <span className="shrink-0 text-[13px] text-content-muted">Status:</span>
      <AppSelect<ServicePaymentStatus>
        value={filters.status}
        onChange={filters.setStatus}
        placeholder="hammasi"
        className="w-full font-mono sm:w-40"
        options={STATUS_OPTIONS}
      />
    </div>
    <Input
      value={filters.phone}
      onChange={(e) => filters.setPhone(e.target.value)}
      placeholder="+998…"
      aria-label="Telefon"
      inputMode="tel"
      allowClear
      className="w-full font-mono sm:w-45"
    />
    <Input
      value={filters.userId}
      onChange={(e) => filters.setUserId(e.target.value.trim())}
      placeholder="userId"
      aria-label="userId"
      inputMode="numeric"
      className="w-full sm:w-28"
    />
    <DatePicker.RangePicker
      value={filters.range}
      onChange={(value) => filters.setRange(value as [Dayjs, Dayjs] | null)}
      className="w-full sm:w-auto"
    />
    {filters.hasFilters && (
      <Button type="link" onClick={filters.clearFilters}>
        Tozalash
      </Button>
    )}
  </div>
);

const columns: ColumnsType<ServicePayment> = [
  { title: "ID", key: "id", width: 80, render: (_v, row) => <span className="font-mono text-xs text-content-muted">{row.id}</span> },
  {
    title: "Telefon",
    key: "phone",
    render: (_v, row) => <span className="font-mono text-xs whitespace-nowrap text-content">{row.userPhone}</span>,
  },
  {
    title: "Buyurtma",
    key: "referenceId",
    render: (_v, row) => (
      <Link
        to={ROUTES.designOrderDetail(String(row.referenceId))}
        onClick={(e) => e.stopPropagation()}
        className="font-mono text-xs"
      >
        #{row.referenceId}
      </Link>
    ),
  },
  { title: "№", key: "attempt", width: 56, render: (_v, row) => <span className="text-xs text-content-muted tabular-nums">{row.attempt}</span> },
  {
    title: "Summa",
    key: "amount",
    align: "right",
    render: (_v, row) => (
      <span className="text-[13px] font-medium whitespace-nowrap text-content tabular-nums">{formatNumber(row.amount)}</span>
    ),
  },
  {
    title: "Karta",
    key: "maskedPan",
    render: (_v, row) => <span className="font-mono text-xs whitespace-nowrap text-content-secondary">{row.maskedPan ?? "—"}</span>,
  },
  {
    title: "Status",
    key: "status",
    render: (_v, row) => <StatusChip tone={PAYMENT_STATUS_TONE[row.status]} label={row.status} />,
  },
  { title: "Qabul qilingan", key: "acceptedAt", render: (_v, payment) => <AcceptedCell payment={payment} /> },
];

export const ServicePaymentsPage = () => {
  const filters = usePaymentFilters();
  const { data, isPending, isError, error, refetch } = useServicePayments(filters.filters);
  const [searchParams, setSearchParams] = useSearchParams();
  const parsed = Number(searchParams.get(QUERY_PARAM));
  const paymentId = Number.isInteger(parsed) && parsed > 0 ? parsed : null;

  const openPayment = (id: number | null) =>
    setSearchParams(
      (params) => {
        if (id === null) params.delete(QUERY_PARAM);
        else params.set(QUERY_PARAM, String(id));
        return params;
      },
      { replace: true },
    );

  if (isAccessDenied(error)) {
    return <Forbidden />;
  }

  return (
    <>
      <PageHeader
        title="Xizmat to‘lovlari"
        description="Xizmat berilganini status emas, «Qabul qilingan» vaqti belgilaydi."
      />
      <PaymentsToolbar filters={filters} />
      <DataTable<ServicePayment>
        columns={columns}
        data={data?.elements}
        rowKey="id"
        isLoading={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        onRow={(payment) => ({
          className: `cursor-pointer ${isServedThenReversed(payment) ? "[&>td]:bg-warning-soft/50!" : ""}`,
          onClick: () => openPayment(payment.id),
        })}
        emptyState={
          <TableEmptyState
            title="To‘lov topilmadi"
            description={
              filters.hasFilters ? "Tanlangan filtrlar bo‘yicha natija yo‘q." : "AI dizayn uchun hali to‘lov qilinmagan."
            }
            action={filters.hasFilters ? { label: "Filtrni tozalash", onClick: filters.clearFilters } : undefined}
          />
        }
        pagination={{
          page: filters.filters.page,
          size: filters.filters.size,
          totalElements: data?.totalElements ?? 0,
          onChange: filters.setPage,
        }}
      />
      <PaymentDetailPanel paymentId={paymentId} onClose={() => openPayment(null)} />
    </>
  );
};
