import { EyeOutlined } from "@ant-design/icons";
import { Button, Checkbox, Image, Skeleton } from "antd";
import type { ImageProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { isAdmin } from "@/permissions";
import { useAuth } from "@/hooks/use-auth";
import { useApiMessage } from "@/hooks/use-api-message";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useCompaniesQuery } from "@/hooks/companies";
import {
  useAttachCompanies,
  useBrandLogo,
  useBrandQuery,
  useDeleteBrand,
  useDetachCompany,
} from "@/hooks/brands";
import { formatNumber } from "@/utils/format-number";
import { AppModal } from "@/components/ui/AppModal";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { StatusChip } from "@/components/ui/StatusChip";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TableEmptyState } from "@/components/ui/TableEmptyState";
import { TableErrorState } from "@/components/ui/TableErrorState";
import { BrandFormPanel } from "@/components/brands/BrandFormPanel";
import type { Brand } from "@/services/brands/types";
import type { Company } from "@/services/companies/types";

const PICKER_PAGE_SIZE = 50;

const AttachCompaniesModal = ({
  open,
  brandId,
  onClose,
}: {
  open: boolean;
  brandId: number;
  onClose: () => void;
}) => {
  const toast = useApiMessage();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const debouncedSearch = useDebouncedValue(search, 300);
  const { data, isPending } = useCompaniesQuery({
    search: debouncedSearch || undefined,
    page: 0,
    size: PICKER_PAGE_SIZE,
  });
  const attach = useAttachCompanies(brandId);
  const candidates = (data?.elements ?? []).filter((company) => company.brand?.id !== brandId);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  return (
    <AppModal
      open={open}
      title="Kompaniya biriktirish"
      onCancel={onClose}
      footer={
        <>
          <Button onClick={onClose}>Bekor qilish</Button>
          <Button
            type="primary"
            disabled={selected.length === 0}
            loading={attach.isPending}
            onClick={() =>
              attach.mutate(
                { companyIds: selected },
                {
                  onSuccess: () => {
                    toast.success(`${selected.length} ta kompaniya biriktirildi`);
                    setSelected([]);
                    onClose();
                  },
                  onError: (error) => toast.error(error),
                },
              )
            }
          >
            {selected.length === 0 ? "Kompaniya tanlanmagan" : `${selected.length} ta kompaniya biriktirilsin`}
          </Button>
        </>
      }
    >
      <p className="text-[13px] leading-relaxed text-content-secondary">
        Biriktirish faqat qo‘shadi — belgilanmagan kompaniyalar brenddan chiqarilmaydi.
      </p>
      <SearchInput value={search} onChange={setSearch} placeholder="nom yoki companyId" className="!mt-4" />
      <div className="mt-3 max-h-80 overflow-y-auto">
        {isPending ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <ul className="flex flex-col">
            {candidates.map((company) => (
              <li key={company.id} className="border-b border-border py-2.5 last:border-b-0">
                <Checkbox
                  checked={selected.includes(company.id)}
                  onChange={() => toggle(company.id)}
                  className="w-full"
                >
                  <span className="flex flex-wrap items-baseline gap-2">
                    <span className="text-[13px] font-medium text-content">{company.companyName}</span>
                    <span className="text-xs text-content-muted tabular-nums">{company.companyId}</span>
                    {company.brand && (
                      <span className="text-xs text-warning-strong">{company.brand.name} brendidan ko‘chiriladi</span>
                    )}
                  </span>
                </Checkbox>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppModal>
  );
};

const BrandCompaniesTable = ({
  brandId,
  companies,
  canWrite,
  onAttach,
}: {
  brandId: number;
  companies: Company[];
  canWrite: boolean;
  onAttach: () => void;
}) => {
  const toast = useApiMessage();
  const detach = useDetachCompany(brandId);
  const columns: ColumnsType<Company> = [
    {
      title: "Kompaniya",
      key: "name",
      render: (_v, record) => <span className="text-[13px] font-medium text-content">{record.companyName}</span>,
    },
    {
      title: "companyId",
      key: "companyId",
      width: 130,
      render: (_v, record) => <span className="text-content-muted tabular-nums">{record.companyId}</span>,
    },
    {
      title: "PRO",
      key: "premium",
      width: 100,
      render: (_v, record) =>
        record.isPremium ? <StatusChip tone="accent" label="PRO" /> : <StatusChip tone="neutral" label="oddiy" />,
    },
    {
      title: "Shartnoma",
      key: "contracts",
      align: "right",
      width: 120,
      render: (_v, record) => <span className="text-content tabular-nums">{formatNumber(record.contractCount)}</span>,
    },
    {
      title: "Mijoz",
      key: "users",
      align: "right",
      width: 110,
      render: (_v, record) => <span className="text-content tabular-nums">{formatNumber(record.userCount)}</span>,
    },
  ];

  if (canWrite) {
    columns.push({
      title: "",
      key: "actions",
      width: 170,
      align: "right",
      render: (_v, record) => (
        <Button
          type="link"
          size="small"
          onClick={() =>
            detach.mutate(record.id, {
              onSuccess: () => toast.success("Kompaniya brenddan chiqarildi"),
              onError: (error) => toast.error(error),
            })
          }
        >
          Brenddan chiqarish
        </Button>
      ),
    });
  }

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-content">Brend kompaniyalari</h2>
        {canWrite && (
          <Button type="primary" onClick={onAttach}>
            Kompaniya biriktirish
          </Button>
        )}
      </div>
      <DataTable<Company>
        columns={columns}
        data={companies}
        rowKey="id"
        isLoading={false}
        emptyState={
          <TableEmptyState
            title="Brendga kompaniya biriktirilmagan"
            description="Brend bor, lekin hozircha bo‘sh. Kompaniya biriktirilmaguncha ilovada ko‘rinmaydi."
            action={canWrite ? { label: "Kompaniya biriktirish", onClick: onAttach } : undefined}
          />
        }
        pagination={false}
      />
    </>
  );
};

const DeleteBrandModal = ({ open, brand, onCancel }: { open: boolean; brand: Brand; onCancel: () => void }) => {
  const navigate = useNavigate();
  const toast = useApiMessage();
  const remove = useDeleteBrand();
  return (
    <ConfirmModal
      open={open}
      tone="danger"
      title={`“${brand.name}” brendi o‘chirilsinmi?`}
      description="Kompaniyalar guruhdan chiqadi, lekin o‘chmaydi va hech kimning PRO rejasi yo‘qolmaydi. Ilovada ular yana alohida nom bilan ko‘rinadi. Brendni keyin qayta yaratish mumkin."
      confirmLabel="Brendni o‘chirish"
      loading={remove.isPending}
      auditNote
      onCancel={onCancel}
      onConfirm={() =>
        remove.mutate(brand.id, {
          onSuccess: () => {
            toast.success("Brend o‘chirildi");
            navigate(ROUTES.brands, { replace: true });
          },
          onError: (error) => toast.error(error),
        })
      }
    >
      <p className="mb-2 text-xs font-medium text-content-secondary">
        Guruhdan chiqadigan {brand.companies.length} kompaniya
      </p>
      <ul className="max-h-48 overflow-y-auto rounded-lg bg-surface-muted px-4 py-3">
        {brand.companies.map((company) => (
          <li key={company.id} className="py-0.5 text-[13px] text-content">
            {company.companyName} · <span className="tabular-nums">{company.companyId}</span>
          </li>
        ))}
      </ul>
    </ConfirmModal>
  );
};

const BrandLogo = ({ src, isLoading, name }: { src: string | null; isLoading: boolean; name: string }) => {
  const [brokenSrc, setBrokenSrc] = useState<string | null>(null);
  const base = "size-12 shrink-0 rounded-xl bg-surface-muted";
  if (isLoading) {
    return <div className={`${base} animate-pulse`} />;
  }
  if (!src || brokenSrc === src) {
    return (
      <div className={`${base} flex items-center justify-center text-base font-medium text-content-secondary`}>
        {name.slice(0, 1)}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={name}
      onError={() => setBrokenSrc(src)}
      rootClassName={`${base} overflow-hidden`}
      className="size-12 object-cover"
      preview={{ cover: <EyeOutlined className="text-base" /> } as ImageProps["preview"]}
    />
  );
};

const BrandDetailHeader = ({
  brand,
  canWrite,
  onEdit,
  onDelete,
}: {
  brand: Brand;
  canWrite: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const { src, isLoading } = useBrandLogo(brand);
  return (
    <>
      <nav className="mb-4 flex items-center gap-1.5 text-[13px] text-content-muted">
        <Link to={ROUTES.brands} className="hover:text-accent">
          Brendlar
        </Link>
        <span>/</span>
        <span className="text-content">{brand.name}</span>
      </nav>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <BrandLogo src={src} isLoading={isLoading} name={brand.name} />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-content">{brand.name}</h1>
            <p className="text-[13px] text-content-muted">{brand.companies.length} kompaniya</p>
            <div className="mt-3 flex flex-wrap items-end gap-6">
              <div>
                <p className="text-lg font-semibold text-content tabular-nums">{formatNumber(brand.contractCount)}</p>
                <p className="text-xs text-content-muted">shartnoma</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-content tabular-nums">{formatNumber(brand.userCount)}</p>
                <p className="text-xs text-content-muted">mijoz</p>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-content-muted">
                kompaniyalar yig‘indisi — ikki kompaniyada shartnomasi bor mijoz ikki marta sanaladi
              </p>
            </div>
          </div>
        </div>
        {canWrite && (
          <div className="flex shrink-0 items-center gap-2">
            <Button onClick={onEdit}>Tahrirlash</Button>
            <Button danger onClick={onDelete}>
              O‘chirish
            </Button>
          </div>
        )}
      </header>
    </>
  );
};

export const BrandDetailPage = () => {
  const { brandId } = useParams();
  const { role } = useAuth();
  const canWrite = isAdmin(role);
  const id = Number(brandId);
  const { data, isPending, isError, refetch } = useBrandQuery(id);
  const [editOpen, setEditOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isError) {
    return <TableErrorState onRetry={() => void refetch()} />;
  }
  if (isPending || !data) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  return (
    <>
      <BrandDetailHeader
        brand={data}
        canWrite={canWrite}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteOpen(true)}
      />
      <BrandCompaniesTable
        brandId={id}
        companies={data.companies}
        canWrite={canWrite}
        onAttach={() => setAttachOpen(true)}
      />
      <BrandFormPanel open={editOpen} brand={data} onClose={() => setEditOpen(false)} />
      <AttachCompaniesModal open={attachOpen} brandId={id} onClose={() => setAttachOpen(false)} />
      <DeleteBrandModal open={deleteOpen} brand={data} onCancel={() => setDeleteOpen(false)} />
    </>
  );
};
