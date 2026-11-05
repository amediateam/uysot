import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useOperatorsQuery } from "@/hooks/operators";
import { formatNumber } from "@/utils/format-number";
import { formatDate, formatDateTime } from "@/utils/format-date-time";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { StatusChip } from "@/components/ui/StatusChip";
import { TableEmptyState } from "@/components/ui/TableEmptyState";
import { ROLE_TONE } from "@/components/operators/role-constants";
import { OperatorFormPanel } from "@/components/operators/OperatorFormPanel";
import { ResetPasswordPanel } from "@/components/operators/ResetPasswordPanel";
import { StatusToggleModal } from "@/components/operators/StatusToggleModal";
import type { Operator } from "@/services/operators/types";

const OperatorsTable = ({
  onResetPassword,
  onToggleStatus,
}: {
  onResetPassword: (operator: Operator) => void;
  onToggleStatus: (operator: Operator) => void;
}) => {
  const { admin } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const debouncedSearch = useDebouncedValue(search, 300);
  const { data, isPending, isError, refetch } = useOperatorsQuery({
    search: debouncedSearch || undefined,
    page,
    size: 20,
  });

  const columns: ColumnsType<Operator> = [
    {
      title: "Login",
      key: "username",
      render: (_v, record) => (
        <Link
          to={ROUTES.operatorDetail(record.id)}
          className="text-[13px] font-medium text-content hover:text-accent"
        >
          {record.username}
        </Link>
      ),
    },
    {
      title: "To‘liq ism",
      key: "fullName",
      render: (_v, record) => (
        <div>
          <p className="text-[13px] text-content">{record.fullName}</p>
          <p className="text-xs text-content-muted">yaratilgan {formatDate(record.createdAt)}</p>
        </div>
      ),
    },
    {
      title: "Rol",
      key: "role",
      width: 150,
      render: (_v, record) => <StatusChip tone={ROLE_TONE[record.role]} label={record.role} />,
    },
    {
      title: "Holat",
      key: "status",
      width: 130,
      render: (_v, record) => (
        <StatusChip
          tone={record.status === "ACTIVE" ? "success" : "danger"}
          label={record.status === "ACTIVE" ? "Faol" : "Bloklangan"}
        />
      ),
    },
    {
      title: "Oxirgi kirish",
      key: "lastLogin",
      width: 190,
      render: (_v, record) => (
        <span className="text-[13px] text-content-muted">{formatDateTime(record.lastLoginAt)}</span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 60,
      align: "right",
      render: (_v, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              { key: "edit", label: <Link to={ROUTES.operatorDetail(record.id)}>Tahrirlash</Link> },
              { key: "reset", label: "Parolni tiklash", onClick: () => onResetPassword(record) },
              {
                key: "status",
                label: record.status === "ACTIVE" ? "Bloklash" : "Blokdan chiqarish",
                danger: record.status === "ACTIVE",
                disabled: record.id === admin?.id,
                onClick: () => onToggleStatus(record),
              },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} aria-label="Qator amallari" />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="login yoki ism" className="w-full sm:max-w-72" />
        <span className="text-[13px] text-content-muted sm:ml-auto">
          {formatNumber(data?.totalElements)} operator
        </span>
      </div>
      <DataTable<Operator>
        columns={columns}
        data={data?.elements}
        rowKey="id"
        isLoading={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        emptyState={
          <TableEmptyState
            title="Operator topilmadi"
            description={`“${search}” bo‘yicha operator yo‘q. Login yoki ismni tekshirib ko‘ring.`}
            action={{ label: "Qidiruvni tozalash", onClick: () => setSearch("") }}
          />
        }
        pagination={{
          page,
          size: 20,
          totalElements: data?.totalElements ?? 0,
          onChange: (nextPage) => setPage(nextPage),
        }}
      />
    </>
  );
};

export const OperatorsPage = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<Operator | null>(null);
  const [statusTarget, setStatusTarget] = useState<Operator | null>(null);

  return (
    <>
      <PageHeader
        title="Operatorlar"
        description="Panelga kirish huquqi bor xodimlar va ularning rollari."
        actions={
          <Button type="primary" onClick={() => setAddOpen(true)}>
            Operator qo‘shish
          </Button>
        }
      />
      <OperatorsTable onResetPassword={setResetTarget} onToggleStatus={setStatusTarget} />
      <OperatorFormPanel open={addOpen} onClose={() => setAddOpen(false)} />
      <ResetPasswordPanel open={resetTarget !== null} operator={resetTarget} onClose={() => setResetTarget(null)} />
      <StatusToggleModal operator={statusTarget} onClose={() => setStatusTarget(null)} />
    </>
  );
};
