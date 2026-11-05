import { Button, Segmented, Skeleton } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { useApiMessage } from "@/hooks/use-api-message";
import {
  useOperatorQuery,
  useOperatorSessionsQuery,
  useRevokeAllSessions,
  useRevokeSession,
  useUpdateOperator,
} from "@/hooks/operators";
import { formatDateTime } from "@/utils/format-date-time";
import { formatUserAgent } from "@/utils/format-user-agent";
import { DataTable } from "@/components/ui/DataTable";
import { StatusChip } from "@/components/ui/StatusChip";
import { TableEmptyState } from "@/components/ui/TableEmptyState";
import { TableErrorState } from "@/components/ui/TableErrorState";
import { ROLE_OPTIONS } from "@/components/operators/role-constants";
import { ResetPasswordPanel } from "@/components/operators/ResetPasswordPanel";
import { StatusToggleModal } from "@/components/operators/StatusToggleModal";
import type { Operator, OperatorSession } from "@/services/operators/types";
import type { Role } from "@/permissions";

const OperatorHeader = ({
  operator,
  onResetPassword,
  onToggleStatus,
}: {
  operator: Operator;
  onResetPassword: () => void;
  onToggleStatus: () => void;
}) => {
  const toast = useApiMessage();
  const { admin } = useAuth();
  const { mutate, isPending } = useUpdateOperator();
  const disabled = operator.id === admin?.id;
  const isActive = operator.status === "ACTIVE";

  return (
    <>
      <nav className="mb-4 flex items-center gap-1.5 text-[13px] text-content-muted">
        <Link to={ROUTES.operators} className="hover:text-accent">
          Operatorlar
        </Link>
        <span>/</span>
        <span className="text-content">{operator.username}</span>
      </nav>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-base font-semibold text-accent">
            {operator.fullName.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold tracking-tight text-content">{operator.fullName}</h1>
              <StatusChip
                tone={isActive ? "success" : "danger"}
                label={isActive ? "Faol" : "Bloklangan"}
              />
            </div>
            <p className="text-[13px] text-content-muted">
              {operator.username} · yaratilgan {formatDateTime(operator.createdAt)}
            </p>
            <div className="mt-4">
              <p className="mb-1.5 text-xs text-content-muted">Rol</p>
              <Segmented<Role>
                value={operator.role}
                options={ROLE_OPTIONS}
                disabled={disabled || isPending}
                onChange={(role) =>
                  mutate(
                    { id: operator.id, fullName: operator.fullName, role },
                    {
                      onSuccess: () => toast.success("Rol yangilandi"),
                      onError: (error) => toast.error(error),
                    },
                  )
                }
              />
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button onClick={onResetPassword}>Parolni tiklash</Button>
          <Button danger={isActive} disabled={disabled} onClick={onToggleStatus}>
            {isActive ? "Bloklash" : "Blokdan chiqarish"}
          </Button>
        </div>
      </header>
    </>
  );
};

const SessionsTable = ({ operatorId }: { operatorId: number }) => {
  const toast = useApiMessage();
  const { data, isPending } = useOperatorSessionsQuery(operatorId);
  const revokeOne = useRevokeSession(operatorId);
  const revokeAll = useRevokeAllSessions(operatorId);

  const columns: ColumnsType<OperatorSession> = [
    {
      title: "IP",
      key: "ip",
      width: 140,
      render: (_v, record) => <span className="font-mono text-[13px] text-content">{record.ip}</span>,
    },
    {
      title: "Qurilma",
      key: "device",
      render: (_v, record) => <span className="text-[13px] text-content">{formatUserAgent(record.userAgent)}</span>,
    },
    {
      title: "Yaratilgan",
      key: "createdAt",
      width: 175,
      render: (_v, record) => <span className="text-[13px] text-content-muted">{formatDateTime(record.createdAt)}</span>,
    },
    {
      title: "Oxirgi so‘rov",
      key: "lastUsedAt",
      width: 175,
      render: (_v, record) => (
        <span className="text-[13px] text-content-muted">{formatDateTime(record.lastUsedAt)}</span>
      ),
    },
    {
      title: "Tugash vaqti",
      key: "expiresAt",
      width: 175,
      render: (_v, record) => <span className="text-[13px] text-content-muted">{formatDateTime(record.expiresAt)}</span>,
    },
    {
      title: "",
      key: "actions",
      width: 150,
      align: "right",
      render: (_v, record) => (
        <Button
          type="link"
          size="small"
          onClick={() =>
            revokeOne.mutate(record.id, {
              onSuccess: () => toast.success("Sessiya uzildi"),
              onError: (error) => toast.error(error),
            })
          }
        >
          Sessiyani uzish
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-content">Faol sessiyalar</h2>
          <p className="mt-0.5 text-xs text-content-muted">
            Sessiyani uzsangiz, o‘sha qurilma keyingi so‘rovdayoq tashqarida qoladi — darhol kuchga kiradi.
          </p>
        </div>
        {(data?.length ?? 0) > 0 && (
          <Button
            loading={revokeAll.isPending}
            onClick={() =>
              revokeAll.mutate(undefined, {
                onSuccess: ({ revoked }) => toast.success(`${revoked} ta sessiya uzildi`),
                onError: (error) => toast.error(error),
              })
            }
          >
            Barcha sessiyalarni uzish
          </Button>
        )}
      </div>
      <DataTable<OperatorSession>
        columns={columns}
        data={data}
        rowKey="id"
        isLoading={isPending}
        emptyState={
          <TableEmptyState
            title="Faol sessiya yo‘q"
            description="Operator hozir hech qaysi qurilmadan kirmagan."
          />
        }
        pagination={false}
      />
    </>
  );
};

export const OperatorDetailPage = () => {
  const { operatorId } = useParams();
  const id = Number(operatorId);
  const { data, isPending, isError, refetch } = useOperatorQuery(id);
  const [resetOpen, setResetOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  if (isError) {
    return <TableErrorState onRetry={() => void refetch()} />;
  }
  if (isPending || !data) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  return (
    <>
      <OperatorHeader
        operator={data}
        onResetPassword={() => setResetOpen(true)}
        onToggleStatus={() => setStatusOpen(true)}
      />
      <SessionsTable operatorId={id} />
      <ResetPasswordPanel open={resetOpen} operator={data} onClose={() => setResetOpen(false)} />
      <StatusToggleModal operator={statusOpen ? data : null} onClose={() => setStatusOpen(false)} />
    </>
  );
};
