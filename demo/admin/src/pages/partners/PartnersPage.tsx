import { ArrowDownOutlined, ArrowUpOutlined, DownOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Popover, Segmented, Spin, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { isAdmin } from "@/permissions";
import { isAccessDenied } from "@/services/api-error";
import { useAuth } from "@/hooks/use-auth";
import { useApiMessage } from "@/hooks/use-api-message";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  useCategories,
  useDeletePartner,
  usePartnerCounts,
  usePartnersQuery,
  useSetPartnerPublished,
} from "@/hooks/partners";
import {
  EMPTY_STATUS_TEXT,
  STATUS_META,
  STATUS_TABS,
  WRITE_ROLE_HINT,
} from "@/services/partners/constants";
import { discountLabel, formatCreatedAt, formatValidUntil } from "@/services/partners/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { StatusChip } from "@/components/ui/StatusChip";
import { TableEmptyState } from "@/components/ui/TableEmptyState";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { RowActions, type RowAction } from "@/components/ui/RowActions";
import { PartnerAvatar } from "@/components/partners/fields";
import { CategoryManager } from "@/components/partners/CategoryManager";
import { PartnerFormPanel } from "@/components/partners/PartnerFormPanel";
import { Forbidden } from "@/pages/forbidden/Forbidden";
import type { PartnerCategory, PartnerCounts, PartnerListItem, PartnerStatus } from "@/services/partners/types";

type Tab = PartnerStatus | "ALL";

const usePartnerFilters = () => {
  const [status, setStatus] = useState<Tab>("ALL");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [oldestFirst, setOldestFirst] = useState(false);
  const [page, setPage] = useState(0);
  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const countsFilters = { categoryId: categoryId ?? undefined, search: debouncedSearch || undefined };
  return {
    status,
    categoryId,
    search,
    oldestFirst,
    countsFilters,
    filters: { ...countsFilters, status: status === "ALL" ? undefined : status, page, size: 20, oldestFirst },
    isFiltered: categoryId !== null || debouncedSearch !== "",
    setStatus: (value: Tab) => {
      setStatus(value);
      setPage(0);
    },
    setCategoryId: (value: number | null) => {
      setCategoryId(value);
      setPage(0);
    },
    setSearch: (value: string) => {
      setSearch(value);
      setPage(0);
    },
    toggleSort: () => {
      setOldestFirst((v) => !v);
      setPage(0);
    },
    setPage,
    clearFilters: () => {
      setCategoryId(null);
      setSearch("");
      setPage(0);
    },
  };
};

type PartnerFilters = ReturnType<typeof usePartnerFilters>;

const StatusTabs = ({ value, counts, onChange }: { value: Tab; counts?: PartnerCounts; onChange: (value: Tab) => void }) => (
  <div role="group" aria-label="Holat bo‘yicha filtr">
    <Segmented<Tab>
      value={value}
      onChange={onChange}
      options={STATUS_TABS.map((tab) => ({
        value: tab.value,
        label: (
          <span className="inline-flex items-center gap-1.5">
            {tab.label}
            <span className="text-xs text-content-muted tabular-nums">{counts?.[tab.countKey] ?? "·"}</span>
          </span>
        ),
      }))}
    />
  </div>
);

const CategoryFilter = ({
  value,
  categories,
  isLoading,
  isError,
  onChange,
  onManage,
}: {
  value: number | null;
  categories?: PartnerCategory[];
  isLoading: boolean;
  isError: boolean;
  onChange: (value: number | null) => void;
  onManage?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const selected = categories?.find((c) => c.id === value);
  const hasAny = !!categories?.length;
  const select = (id: number | null) => {
    onChange(id);
    setOpen(false);
  };
  const manageButton = onManage && (
    <Button
      size="small"
      block
      icon={<SettingOutlined />}
      onClick={() => {
        setOpen(false);
        onManage();
      }}
    >
      Kategoriyalarni boshqarish
    </Button>
  );
  const content = (
    <div className="flex w-64 flex-col">
      {hasAny ? (
        <>
          <ul className="flex max-h-72 flex-col overflow-y-auto">
            {categories?.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => select(category.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] hover:bg-surface-muted ${
                    category.id === value ? "font-semibold text-accent" : "text-content"
                  }`}
                >
                  <span className="truncate">{category.name.uz}</span>
                  <span className="text-xs text-content-muted tabular-nums">{category.partnerCount}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-1 flex items-center gap-2 border-t border-border px-1 pt-2">
            {manageButton && <div className="min-w-0 flex-1">{manageButton}</div>}
            {value !== null && (
              <Button size="small" type="text" onClick={() => select(null)}>
                Tozalash
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 px-2 py-4 text-center">
          {isLoading ? <Spin size="small" /> : <span className="text-[13px] text-content-muted">{isError ? "Kategoriyalarni yuklab bo‘lmadi" : "Kategoriya hali yo‘q"}</span>}
          {!isLoading && manageButton}
        </div>
      )}
    </div>
  );
  return (
    <Popover open={open} onOpenChange={setOpen} trigger="click" placement="bottomLeft" content={content} arrow={false}>
      <Button>
        <span className="text-content-muted">Kategoriya:</span>
        <span className="max-w-40 truncate">{selected?.name.uz ?? "hammasi"}</span>
        <DownOutlined className="text-xs text-content-muted" />
      </Button>
    </Popover>
  );
};

const PartnerRowActions = ({
  partner,
  canWrite,
  onOpen,
  onTogglePublish,
  onDelete,
}: {
  partner: PartnerListItem;
  canWrite: boolean;
  onOpen: (partner: PartnerListItem) => void;
  onTogglePublish: (partner: PartnerListItem, publish: boolean) => void;
  onDelete: (partner: PartnerListItem) => void;
}) => {
  const guard = { disabled: !canWrite, disabledReason: WRITE_ROLE_HINT };
  const toggle: RowAction =
    partner.status === "DRAFT"
      ? { key: "publish", label: "Nashr qilish", onClick: () => onTogglePublish(partner, true), ...guard }
      : { key: "hide", label: "Yashirish", onClick: () => onTogglePublish(partner, false), ...guard };
  return (
    <RowActions
      label={`${partner.name} amallari`}
      actions={[
        { key: "open", label: canWrite ? "Tahrirlash" : "Ko‘rish", onClick: () => onOpen(partner) },
        ...(partner.status === "EXPIRED" && canWrite
          ? [{ key: "extend", label: "Muddatni uzaytirish", onClick: () => onOpen(partner) } as RowAction]
          : []),
        toggle,
        { key: "delete", label: "O‘chirish", danger: true, dividerBefore: true, onClick: () => onDelete(partner), ...guard },
      ]}
    />
  );
};

const buildColumns = ({
  canWrite,
  oldestFirst,
  onToggleSort,
  onOpen,
  onTogglePublish,
  onDelete,
}: {
  canWrite: boolean;
  oldestFirst: boolean;
  onToggleSort: () => void;
  onOpen: (partner: PartnerListItem) => void;
  onTogglePublish: (partner: PartnerListItem, publish: boolean) => void;
  onDelete: (partner: PartnerListItem) => void;
}): ColumnsType<PartnerListItem> => [
  {
    title: "Hamkor",
    key: "partner",
    render: (_v, partner) => (
      <div className="flex min-w-48 items-center gap-3">
        <PartnerAvatar name={partner.name} logo={partner.logo} />
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => onOpen(partner)}
            className="max-w-full truncate text-left text-[14px] font-medium text-content hover:text-accent"
          >
            {partner.name}
          </button>
          <p className="mb-0 truncate text-xs text-content-muted">{partner.category.name.uz}</p>
        </div>
      </div>
    ),
  },
  {
    title: "Chegirma",
    key: "discount",
    width: 170,
    render: (_v, partner) => (
      <span className="inline-flex shrink-0 items-center rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-content tabular-nums">
        {discountLabel(partner.discount)}
      </span>
    ),
  },
  {
    title: "Shart",
    key: "condition",
    width: 260,
    render: (_v, partner) =>
      partner.condition ? (
        <Tooltip title={partner.condition.uz}>
          <p className="mb-0 max-w-60 truncate text-[13px] text-content-secondary">{partner.condition.uz}</p>
        </Tooltip>
      ) : (
        <span className="text-content-muted">—</span>
      ),
  },
  {
    title: "Holat",
    key: "status",
    width: 140,
    render: (_v, partner) => <StatusChip tone={STATUS_META[partner.status].tone} label={STATUS_META[partner.status].label} />,
  },
  {
    title: "Muddat",
    key: "validUntil",
    width: 110,
    render: (_v, partner) =>
      partner.validUntil ? (
        <span className={`text-[13px] tabular-nums ${partner.status === "EXPIRED" ? "font-medium text-warning-strong" : "text-content"}`}>
          {formatValidUntil(partner.validUntil)}
        </span>
      ) : (
        <span className="text-[13px] text-content-muted">Muddatsiz</span>
      ),
  },
  {
    title: (
      <button
        type="button"
        onClick={onToggleSort}
        aria-label={oldestFirst ? "Yaratilgan: eskisi birinchi" : "Yaratilgan: yangisi birinchi"}
        className="inline-flex items-center gap-1 font-medium hover:text-accent"
      >
        Yaratilgan {oldestFirst ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      </button>
    ),
    key: "createdAt",
    width: 120,
    render: (_v, partner) => <span className="font-mono text-[13px] text-content-muted tabular-nums">{formatCreatedAt(partner.createdAt)}</span>,
  },
  {
    title: <span className="sr-only">Amallar</span>,
    key: "actions",
    width: 64,
    align: "right",
    render: (_v, partner) => (
      <PartnerRowActions partner={partner} canWrite={canWrite} onOpen={onOpen} onTogglePublish={onTogglePublish} onDelete={onDelete} />
    ),
  },
];

const PartnersEmpty = ({
  counts,
  status,
  isFiltered,
  filterLabels,
  onCreate,
  onClearFilters,
}: {
  counts?: PartnerCounts;
  status: Tab;
  isFiltered: boolean;
  filterLabels: (string | undefined)[];
  onCreate?: () => void;
  onClearFilters: () => void;
}) => {
  if (isFiltered && counts?.all === 0) {
    const labels = filterLabels.filter(Boolean).map((label) => `«${label}»`);
    return (
      <TableEmptyState
        title="Hech narsa topilmadi"
        description={`${labels.join(" · ")} bo‘yicha hamkor yo‘q.`}
        action={{ label: "Filtrlarni tozalash", onClick: onClearFilters }}
      />
    );
  }
  if (counts?.all === 0) {
    return (
      <TableEmptyState
        title="Hali hamkor yo‘q"
        description="Birinchi chegirmani qo‘shing — nashr qilingach ilovada chiqadi."
        action={onCreate ? { label: "Hamkor qo‘shish", onClick: onCreate } : undefined}
      />
    );
  }
  return <p className="py-14 text-center text-[13px] text-content-muted">{status === "ALL" ? "Hamkor yo‘q." : EMPTY_STATUS_TEXT[status]}</p>;
};

const PartnersTable = ({
  canWrite,
  onOpen,
  onCreate,
  onDelete,
  onManageCategories,
}: {
  canWrite: boolean;
  onOpen: (id: number) => void;
  onCreate: () => void;
  onDelete: (partner: PartnerListItem) => void;
  onManageCategories: () => void;
}) => {
  const toast = useApiMessage();
  const filters = usePartnerFilters();
  const partners = usePartnersQuery(filters.filters);
  const { data: counts } = usePartnerCounts(filters.countsFilters);
  const categories = useCategories();
  const { mutate: togglePublish } = useSetPartnerPublished();

  const columns = buildColumns({
    canWrite,
    oldestFirst: filters.oldestFirst,
    onToggleSort: filters.toggleSort,
    onOpen: (partner) => onOpen(partner.id),
    onTogglePublish: (partner, publish) =>
      togglePublish(
        { id: partner.id, publish },
        {
          onSuccess: (updated) => {
            if (!publish) {
              toast.success(`«${updated.name}» yashirildi`);
              return;
            }
            if (updated.status === "EXPIRED") {
              toast.errorText(`«${updated.name}» nashr qilindi, lekin muddati o‘tgan — ilovada ko‘rinmaydi`);
              return;
            }
            toast.success(`«${updated.name}» nashr qilindi`);
          },
          onError: (error) => toast.error(error),
        },
      ),
    onDelete,
  });

  if (isAccessDenied(partners.error)) {
    return <Forbidden />;
  }

  const activeCategoryName = categories.data?.find((c) => c.id === filters.categoryId)?.name.uz;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <StatusTabs value={filters.status} counts={counts} onChange={filters.setStatus} />
        <CategoryFilter
          value={filters.categoryId}
          categories={categories.data}
          isLoading={categories.isPending}
          isError={categories.isError}
          onChange={filters.setCategoryId}
          onManage={canWrite ? onManageCategories : undefined}
        />
        <SearchInput
          value={filters.search}
          onChange={filters.setSearch}
          placeholder="hamkor nomi"
          label="Hamkor qidirish"
          className="w-full sm:ml-auto sm:w-64"
        />
      </div>
      <DataTable<PartnerListItem>
        columns={columns}
        data={partners.data?.elements}
        rowKey="id"
        isLoading={partners.isPending}
        isError={partners.isError}
        onRetry={() => void partners.refetch()}
        emptyState={
          <PartnersEmpty
            counts={counts}
            status={filters.status}
            isFiltered={filters.isFiltered}
            filterLabels={[activeCategoryName, filters.search.trim()]}
            onCreate={canWrite ? onCreate : undefined}
            onClearFilters={filters.clearFilters}
          />
        }
        pagination={{
          page: filters.filters.page,
          size: filters.filters.size,
          totalElements: partners.data?.totalElements ?? 0,
          onChange: (page) => filters.setPage(page),
        }}
      />
    </>
  );
};

export const PartnersPage = () => {
  const { role } = useAuth();
  const canWrite = isAdmin(role);
  const toast = useApiMessage();
  const { mutate: deletePartner, isPending: isDeleting } = useDeletePartner();
  const [editor, setEditor] = useState<{ partnerId: number | null } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PartnerListItem | null>(null);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const openCreate = () => setEditor({ partnerId: null });

  return (
    <>
      <PageHeader
        title="Hamkor chegirmalari"
        description="Ilovadagi «Hamkorlar» bo‘limi — faqat faol va muddati o‘tmaganlar ko‘rinadi."
        badge={!canWrite && <StatusChip tone="neutral" label="Faqat ko‘rish" />}
        actions={
          <Tooltip title={canWrite ? undefined : WRITE_ROLE_HINT}>
            <Button type="primary" disabled={!canWrite} onClick={openCreate}>
              Hamkor qo‘shish
            </Button>
          </Tooltip>
        }
      />
      <PartnersTable
        canWrite={canWrite}
        onOpen={(partnerId) => setEditor({ partnerId })}
        onCreate={openCreate}
        onDelete={setDeleteTarget}
        onManageCategories={() => setCategoriesOpen(true)}
      />
      <PartnerFormPanel
        open={editor !== null}
        partnerId={editor?.partnerId ?? null}
        readOnly={!canWrite}
        onClose={() => setEditor(null)}
        onManageCategories={() => setCategoriesOpen(true)}
      />
      <ConfirmDelete
        partner={deleteTarget}
        loading={isDeleting}
        onConfirm={() => {
          if (!deleteTarget) return;
          deletePartner(deleteTarget.id, {
            onSuccess: () => {
              toast.success(`«${deleteTarget.name}» o‘chirildi`);
              setDeleteTarget(null);
            },
            onError: (error) => {
              toast.error(error);
              setDeleteTarget(null);
            },
          });
        }}
        onCancel={() => setDeleteTarget(null)}
      />
      <CategoryManager open={categoriesOpen} onClose={() => setCategoriesOpen(false)} />
    </>
  );
};

// Delete-partner confirmation (recovered from the build).
const ConfirmDelete = ({
  partner,
  loading,
  onConfirm,
  onCancel,
}: {
  partner: PartnerListItem | null;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <ConfirmModal
    open={partner !== null}
    tone="danger"
    title={`«${partner?.name ?? ""}» hamkorini o‘chirasizmi?`}
    description="Hamkor va uning barcha fayllari (logo, banner, galereya, hujjatlar) butunlay o‘chiriladi. Bu amalni qaytarib bo‘lmaydi."
    confirmLabel="O‘chirish"
    loading={loading}
    onConfirm={onConfirm}
    onCancel={onCancel}
  />
);
