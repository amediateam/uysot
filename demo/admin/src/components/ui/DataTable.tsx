import { Table } from "antd";
import type { TableProps } from "antd";
import type { ReactNode } from "react";
import { useMediaUp } from "@/hooks/use-media-up";
import { useFillViewportHeight } from "@/hooks/use-fill-viewport-height";
import { TableErrorState } from "@/components/ui/TableErrorState";

// Server-side pagination descriptor (recovered from the build). `page` is 0-based.
export interface ServerPagination {
  page: number;
  size: number;
  totalElements: number;
  onChange: (page: number, pageSize: number) => void;
}

interface DataTableProps<T> {
  columns: TableProps<T>["columns"];
  data: T[] | undefined;
  rowKey: TableProps<T>["rowKey"];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyState?: ReactNode;
  pagination?: ServerPagination | false;
  onRow?: TableProps<T>["onRow"];
  expandable?: TableProps<T>["expandable"];
  scroll?: TableProps<T>["scroll"];
}

const toOneBased = (page: number) => page + 1;
const toZeroBased = (current: number) => Math.max(0, current - 1);

// List table (recovered from the build): fills the viewport height, shows a retry state on
// error, and drives antd's pagination from the server's 0-based page descriptor.
export const DataTable = <T extends object>({
  columns,
  data,
  rowKey,
  isLoading,
  isError = false,
  onRetry,
  emptyState,
  pagination = false,
  onRow,
  expandable,
  scroll,
}: DataTableProps<T>) => {
  const isDesktop = useMediaUp("sm");
  const fillRef = useFillViewportHeight();

  if (isError && onRetry) {
    return <TableErrorState onRetry={onRetry} />;
  }

  const activePagination =
    pagination !== false && pagination.totalElements > pagination.size ? pagination : null;

  return (
    <div
      ref={fillRef}
      className={`overflow-hidden rounded-lg bg-surface shadow-card [&_.ant-table-body]:scrollbar-gutter-stable [&_.ant-table-body]:overflow-y-auto! ${
        activePagination ? "[--table-chrome:8rem]" : "[--table-chrome:3.5rem]"
      }`}
    >
      <Table<T>
        columns={columns}
        dataSource={data}
        rowKey={rowKey}
        loading={isLoading}
        onRow={onRow}
        expandable={expandable}
        scroll={{ x: "max-content", y: "calc(var(--fill-height) - var(--table-chrome))", ...scroll }}
        locale={emptyState ? { emptyText: emptyState } : undefined}
        pagination={
          activePagination
            ? {
                current: toOneBased(activePagination.page),
                pageSize: activePagination.size,
                total: activePagination.totalElements,
                showSizeChanger: false,
                simple: !isDesktop,
                showTotal: (total, [from, to]) => `${from}–${to} · jami ${total}`,
                onChange: (page, pageSize) => activePagination.onChange(toZeroBased(page), pageSize),
              }
            : false
        }
      />
    </div>
  );
};
