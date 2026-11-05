import { Button, Pagination, Skeleton } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { isAdmin } from "@/permissions";
import { useAuth } from "@/hooks/use-auth";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useMediaUp } from "@/hooks/use-media-up";
import { useFillViewportHeight } from "@/hooks/use-fill-viewport-height";
import { useBrandsQuery } from "@/hooks/brands";
import { formatNumber } from "@/utils/format-number";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { StatusChip } from "@/components/ui/StatusChip";
import { TableEmptyState } from "@/components/ui/TableEmptyState";
import { TableErrorState } from "@/components/ui/TableErrorState";
import { BrandFormPanel } from "@/components/brands/BrandFormPanel";
import type { Brand } from "@/services/brands/types";

const MAX_COMPANY_CHIPS = 3;

const useBrandsFilters = () => {
  const [search, setSearchState] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  return {
    search,
    filters: { search: useDebouncedValue(search, 300) || undefined, page, size },
    setSearch: (value: string) => {
      setSearchState(value);
      setPage(0);
    },
    setPage: (nextPage: number, nextSize: number) => {
      setPage(nextPage);
      setSize(nextSize);
    },
  };
};

const BrandCard = ({ brand }: { brand: Brand }) => (
  <Link
    to={ROUTES.brandDetail(String(brand.id))}
    className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-sm font-medium text-content-secondary">
      {brand.name.slice(0, 1)}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-content">{brand.name}</p>
      <p className="text-xs text-content-muted">{brand.companies.length} kompaniya</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {brand.companies.slice(0, MAX_COMPANY_CHIPS).map((company) => (
          <StatusChip key={company.id} tone="neutral" label={company.companyName} />
        ))}
        {brand.companies.length > MAX_COMPANY_CHIPS && (
          <StatusChip tone="neutral" label={`+${brand.companies.length - MAX_COMPANY_CHIPS}`} />
        )}
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-6">
      <div className="text-right">
        <p className="text-lg font-semibold text-content tabular-nums">{formatNumber(brand.contractCount)}</p>
        <p className="text-xs text-content-muted">shartnoma</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-content tabular-nums">{formatNumber(brand.userCount)}</p>
        <p className="text-xs text-content-muted">mijoz</p>
      </div>
    </div>
  </Link>
);

export const BrandsPage = () => {
  const { role } = useAuth();
  const canWrite = isAdmin(role);
  const { search, setSearch, filters, setPage } = useBrandsFilters();
  const { data, isPending, isError, refetch } = useBrandsQuery(filters);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaUp("sm");
  const fillRef = useFillViewportHeight();

  const brands = data?.elements;
  const total = data?.totalElements;

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Brendlar"
        description="Uysot har bir yuridik shaxsga alohida id beradi — brend bir quruvchining bir nechta kompaniyasini ilovada bitta tanish nom ostida ko‘rsatadi."
        actions={
          canWrite && (
            <Button type="primary" onClick={openCreate}>
              Brend yaratish
            </Button>
          )
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="brend nomi" className="w-full sm:max-w-72" />
        <span className="text-[13px] text-content-muted sm:ml-auto">{formatNumber(total)} brend</span>
      </div>
      {isError ? (
        <TableErrorState onRetry={() => void refetch()} />
      ) : isPending ? (
        <div className="grid gap-3">
          {[0, 1, 2, 3].map((key) => (
            <div key={key} className="rounded-xl border border-border bg-surface p-5">
              <Skeleton active paragraph={{ rows: 1 }} />
            </div>
          ))}
        </div>
      ) : brands?.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface">
          <TableEmptyState
            title="Hali brend yaratilmagan"
            description="Brend bir quruvchining bir nechta kompaniyasini ilovada bitta nom ostida birlashtiradi. Kompaniyalar o‘zgarmaydi."
            action={canWrite ? { label: "Birinchi brendni yaratish", onClick: openCreate } : undefined}
          />
        </div>
      ) : (
        <div ref={fillRef} className="flex max-h-(--fill-height) flex-col">
          <div className="grid flex-1 auto-rows-min gap-3 overflow-y-auto pr-1">
            {brands?.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
          <div className="shrink-0 pt-3">
            <Pagination
              align="end"
              current={filters.page + 1}
              pageSize={filters.size}
              total={total ?? 0}
              showSizeChanger={false}
              simple={!isDesktop}
              showTotal={(totalCount, [from, to]) => `${from}–${to} · jami ${totalCount}`}
              onChange={(nextPage, nextSize) => setPage(Math.max(0, nextPage - 1), nextSize)}
            />
          </div>
        </div>
      )}
      <BrandFormPanel open={open} brand={editing} onClose={() => setOpen(false)} />
    </>
  );
};
