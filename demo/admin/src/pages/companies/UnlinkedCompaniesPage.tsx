import { CheckCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { isAdmin } from "@/permissions";
import { useAuth } from "@/hooks/use-auth";
import { formatNumber } from "@/utils/format-number";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusChip } from "@/components/ui/StatusChip";
import { TableEmptyState } from "@/components/ui/TableEmptyState";
import { CompanyFormPanel } from "@/components/companies/CompanyFormPanel";
import { useUnlinkedCompaniesQuery } from "@/hooks/companies";
import type { UnlinkedCompany } from "@/services/companies/types";

// Companies that appear in contracts but aren't in our database yet (recovered from the build).
export const UnlinkedCompaniesPage = () => {
  const { role } = useAuth();
  const canWrite = isAdmin(role);
  const { data, isPending, isError, refetch } = useUnlinkedCompaniesQuery();
  const [presetCompanyId, setPresetCompanyId] = useState<number>();
  const [open, setOpen] = useState(false);

  const columns: ColumnsType<UnlinkedCompany> = [
    {
      title: "Uysot id",
      key: "companyId",
      render: (_v, record) => (
        <span className="text-[13px] font-medium text-content tabular-nums">{record.companyId}</span>
      ),
    },
    {
      title: "Shartnoma",
      key: "contracts",
      align: "right",
      width: 130,
      render: (_v, record) => <span className="text-content tabular-nums">{formatNumber(record.contractCount)}</span>,
    },
    {
      title: "Mijoz",
      key: "users",
      align: "right",
      width: 120,
      render: (_v, record) => <span className="text-content tabular-nums">{formatNumber(record.userCount)}</span>,
    },
  ];

  if (canWrite) {
    columns.push({
      title: "",
      key: "actions",
      width: 120,
      align: "right",
      render: (_v, record) => (
        <Button
          size="small"
          onClick={() => {
            setPresetCompanyId(record.companyId);
            setOpen(true);
          }}
        >
          Qo‘shish
        </Button>
      ),
    });
  }

  return (
    <>
      <PageHeader
        title="Biriktirilmagan kompaniyalar"
        description="Shartnomalarda uchraydi, bazamizda yo‘q — eng band bo‘lgani tepada."
        badge={data?.length ? <StatusChip tone="warning" label={`${data.length} navbatda`} /> : undefined}
      />
      <DataTable<UnlinkedCompany>
        columns={columns}
        data={data}
        rowKey="companyId"
        isLoading={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        emptyState={
          <TableEmptyState
            icon={<CheckCircleOutlined />}
            title="Hammasi biriktirilgan"
            description="Navbat bo‘sh. Yaxshi ish."
          />
        }
        pagination={false}
      />
      <CompanyFormPanel
        open={open}
        company={null}
        presetCompanyId={presetCompanyId}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
