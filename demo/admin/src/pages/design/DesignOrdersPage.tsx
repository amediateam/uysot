import { Button, DatePicker, Input, Progress } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import { isValidElement, cloneElement, useId, useMemo, useState, type ReactElement, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { isAccessDenied } from "@/services/api-error";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useDesignOrders, useDesignStyles } from "@/hooks/design";
import { formatNumber } from "@/utils/format-number";
import { formatDateTime } from "@/utils/format-date-time";
import { normalizePhone, toTashkentDayBounds } from "@/utils/to-tashkent-day-bounds";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { AppSelect } from "@/components/ui/AppSelect";
import { StatusChip } from "@/components/ui/StatusChip";
import { TableEmptyState } from "@/components/ui/TableEmptyState";
import {
  ORDER_STATUS,
  ORDER_STATUS_OPTIONS,
  OrderStatusChip,
  type OrderStatus,
} from "@/components/ui/OrderStatusChip";
import { Forbidden } from "@/pages/forbidden/Forbidden";
import type { DesignOrderRow, OrderPrice } from "@/services/design/types";

const { RangePicker } = DatePicker;

const toNumeric = (value: string): number | undefined => (/^\d+$/.test(value) ? Number(value) : undefined);

const useOrderFilters = () => {
  const [status, setStatus] = useState<OrderStatus>();
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");
  const [contractId, setContractId] = useState("");
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  const filters = {
    status,
    phone: normalizePhone(useDebouncedValue(phone)),
    userId: toNumeric(useDebouncedValue(userId)),
    contractId: toNumeric(useDebouncedValue(contractId)),
    ...toTashkentDayBounds(range?.[0]?.format("YYYY-MM-DD"), range?.[1]?.format("YYYY-MM-DD")),
    page,
    size,
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
    contractId,
    range,
    filters,
    hasFilters: !!(status || phone || userId || contractId || range),
    setStatus: resetPage(setStatus),
    setPhone: resetPage(setPhone),
    setUserId: resetPage(setUserId),
    setContractId: resetPage(setContractId),
    setRange: resetPage(setRange),
    setPage: (nextPage: number, nextSize: number) => {
      setPage(nextSize === size ? nextPage : 0);
      setSize(nextSize);
    },
    clearFilters: () => {
      setStatus(undefined);
      setPhone("");
      setUserId("");
      setContractId("");
      setRange(null);
      setPage(0);
    },
  };
};

type OrderFilters = ReturnType<typeof useOrderFilters>;

const PriceCell = ({ price }: { price: OrderPrice | null }) => {
  if (!price) return <span className="text-content-muted">—</span>;
  if (price.amountDue === 0) return <StatusChip tone="success" label="Tekin" />;
  return (
    <span className="text-[13px] font-medium whitespace-nowrap text-content tabular-nums">
      {formatNumber(price.amountDue)} so‘m
    </span>
  );
};

const RendersCell = ({
  produced,
  requested,
  status,
}: {
  produced: number;
  requested: number;
  status: OrderStatus;
}) => (
  <div className="flex min-w-28 flex-col gap-1 pr-6">
    <span className="text-xs text-content tabular-nums">
      {produced} / {requested}
    </span>
    <Progress
      percent={requested > 0 ? Math.round((produced / requested) * 100) : 0}
      showInfo={false}
      size={{ height: 4 }}
      strokeColor={`var(--app-${ORDER_STATUS[status].tone})`}
      trailColor="var(--app-surface-muted)"
    />
  </div>
);

const Muted = (value: ReactNode) => (
  <span className="text-xs whitespace-nowrap text-content-muted tabular-nums">{value}</span>
);

const FilterField = ({ label, children }: { label: string; children: ReactNode }) => {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="text-[11px] text-content-muted">
        {label}
      </label>
      {isValidElement(children) ? cloneElement(children as ReactElement, { id }) : children}
    </div>
  );
};

const OrdersToolbar = ({ filters }: { filters: OrderFilters }) => (
  <div className="mb-4 grid grid-cols-1 items-end gap-2.5 rounded-lg bg-surface p-3.5 shadow-card sm:grid-cols-2 lg:grid-cols-[170px_190px_110px_120px_minmax(0,1fr)_auto]">
    <FilterField label="Status">
      <AppSelect<OrderStatus>
        value={filters.status}
        onChange={filters.setStatus}
        placeholder="Hammasi"
        options={ORDER_STATUS_OPTIONS}
      />
    </FilterField>
    <FilterField label="Telefon">
      <Input
        value={filters.phone}
        onChange={(e) => filters.setPhone(e.target.value)}
        placeholder="+998…"
        inputMode="tel"
        allowClear
        className="font-mono"
      />
    </FilterField>
    <FilterField label="userId">
      <Input
        value={filters.userId}
        onChange={(e) => filters.setUserId(e.target.value.trim())}
        placeholder="—"
        inputMode="numeric"
      />
    </FilterField>
    <FilterField label="contractId">
      <Input
        value={filters.contractId}
        onChange={(e) => filters.setContractId(e.target.value.trim())}
        placeholder="—"
        inputMode="numeric"
      />
    </FilterField>
    <FilterField label="Sana oralig‘i">
      <RangePicker
        value={filters.range}
        onChange={(value) => filters.setRange(value as [Dayjs, Dayjs] | null)}
        className="w-full"
      />
    </FilterField>
    <Button type="link" onClick={filters.clearFilters} disabled={!filters.hasFilters}>
      Tozalash
    </Button>
  </div>
);

export const DesignOrdersPage = () => {
  const navigate = useNavigate();
  const filters = useOrderFilters();
  const { data, isPending, isError, error, refetch } = useDesignOrders(filters.filters);
  const { data: styles } = useDesignStyles();
  const styleNameById = useMemo(() => new Map(styles?.map((style) => [style.id, style.name])), [styles]);

  const columns: ColumnsType<DesignOrderRow> = useMemo(
    () => [
      {
        title: "ID",
        key: "id",
        width: 80,
        render: (_v, { order }) => <span className="font-mono text-[13px] text-content-muted">#{order.id}</span>,
      },
      {
        title: "Telefon",
        key: "phone",
        render: (_v, row) => <span className="font-mono text-[13px] whitespace-nowrap text-content">{row.userPhone}</span>,
      },
      { title: "Status", key: "status", render: (_v, { order }) => <OrderStatusChip status={order.status} /> },
      {
        title: "Uslub",
        key: "style",
        render: (_v, { order }) => (
          <span className="text-[13px] text-content">
            {(order.styleId !== null && styleNameById.get(order.styleId)) || "—"}
          </span>
        ),
      },
      {
        title: "Renderlar",
        key: "renders",
        render: (_v, { order }) => (
          <RendersCell produced={order.producedImageCount} requested={order.requestedImageCount} status={order.status} />
        ),
      },
      { title: "To‘lov", key: "amount", align: "right", render: (_v, { order }) => <PriceCell price={order.price} /> },
      { title: "To‘langan", key: "paidAt", render: (_v, { order }) => Muted(formatDateTime(order.paidAt)) },
      { title: "Yaratilgan ↓", key: "createdAt", render: (_v, { order }) => Muted(formatDateTime(order.createdAt)) },
    ],
    [styleNameById],
  );

  if (isAccessDenied(error)) {
    return <Forbidden />;
  }

  return (
    <>
      <PageHeader title="AI dizayn buyurtmalari" description="Mobil ilovadan kelgan buyurtmalar — yangilari tepada." />
      <OrdersToolbar filters={filters} />
      <DataTable<DesignOrderRow>
        columns={columns}
        data={data?.elements}
        rowKey={(row) => row.order.id}
        isLoading={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        onRow={(row) => ({
          className: "cursor-pointer",
          onClick: () => navigate(ROUTES.designOrderDetail(String(row.order.id))),
        })}
        emptyState={
          filters.hasFilters ? (
            <TableEmptyState
              title="Buyurtma topilmadi"
              description="Tanlangan filtrlar bo‘yicha natija yo‘q."
              action={{ label: "Filtrni tozalash", onClick: filters.clearFilters }}
            />
          ) : (
            <TableEmptyState
              title="Hali buyurtma yo‘q"
              description="Mobil ilovadan AI dizayn buyurtmasi kelganda shu yerda chiqadi."
            />
          )
        }
        pagination={{
          page: filters.filters.page,
          size: filters.filters.size,
          totalElements: data?.totalElements ?? 0,
          onChange: filters.setPage,
        }}
      />
    </>
  );
};
