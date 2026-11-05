import { Button, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { isAdmin } from "@/permissions";
import { isAccessDenied } from "@/services/api-error";
import { useAuth } from "@/hooks/use-auth";
import { useStoriesQuery } from "@/hooks/stories";
import { formatNumber } from "@/utils/format-number";
import { formatDateTime } from "@/utils/format-date-time";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusChip } from "@/components/ui/StatusChip";
import { FilterSegmented } from "@/components/ui/FilterSegmented";
import { TableEmptyState } from "@/components/ui/TableEmptyState";
import { StoryStatusChip } from "@/components/stories/StoryStatusChip";
import { StoryMediaThumb } from "@/components/stories/StoryMediaThumb";
import { StoryEditorPanel } from "@/components/stories/StoryEditorPanel";
import { Forbidden } from "@/pages/forbidden/Forbidden";
import {
  ADMIN_ONLY_MESSAGE,
  EMPTY_TAB_TEXT,
  LANGUAGES,
  SORT_OPTIONS,
  TAB_OPTIONS,
} from "@/services/stories/constants";
import { actionLabel } from "@/services/stories/format";
import type { Language, StoryListItem, StoryStatus } from "@/services/stories/types";

type Tab = StoryStatus | "ALL";

const useStoriesFilters = () => {
  const [tab, setTab] = useState<Tab>("ALL");
  const [sort, setSort] = useState<"PRIORITY" | "PUBLISH_AT">("PRIORITY");
  const [page, setPage] = useState(0);
  return {
    tab,
    sort,
    filters: { status: tab === "ALL" ? undefined : tab, sort, page, size: 20 } as const,
    setTab: (next: Tab) => {
      setTab(next);
      setPage(0);
    },
    setSort: (next: "PRIORITY" | "PUBLISH_AT") => {
      setSort(next);
      setPage(0);
    },
    setPage,
  };
};

const LanguagePills = ({ languages }: { languages: Language[] }) => (
  <span className="flex items-center gap-1 font-mono">
    {LANGUAGES.map((lang) => (
      <span
        key={lang}
        className={`rounded-full bg-surface-muted px-1.5 ${
          languages.includes(lang) ? "text-content-secondary" : "text-content-placeholder"
        }`}
      >
        {lang}
      </span>
    ))}
  </span>
);

const NUM_CLASS = "text-[13px] font-medium tabular-nums";

const columns: ColumnsType<StoryListItem> = [
  {
    key: "media",
    width: 56,
    render: (_v, row) => <StoryMediaThumb fileId={row.previewFileId} mediaType={row.mediaType} />,
  },
  {
    title: "Sarlavha (uz)",
    key: "signature",
    render: (_v, row) => (
      <div className="flex max-w-105 min-w-56 flex-col gap-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="font-mono text-xs text-content-muted">#{row.id}</span>
          <Link
            to={ROUTES.storyDetail(String(row.id))}
            onClick={(e) => e.stopPropagation()}
            className="truncate text-[14px] font-medium text-content hover:text-accent"
          >
            {row.signature}
          </Link>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-content-muted">
          <span className="font-mono">{row.mediaType}</span>
          <span>·</span>
          <LanguagePills languages={row.languages} />
        </div>
      </div>
    ),
  },
  { title: "Status", key: "status", width: 150, render: (_v, row) => <StoryStatusChip status={row.status} /> },
  {
    title: "Harakat",
    key: "action",
    width: 200,
    render: (_v, row) => (
      <p className={`mb-0 max-w-48 truncate font-mono text-xs ${row.action.type === "NONE" ? "text-content-muted" : "text-content-secondary"}`}>
        {actionLabel(row.action)}
      </p>
    ),
  },
  {
    title: "Ustuv.",
    key: "priority",
    width: 70,
    align: "right",
    render: (_v, row) => <span className="text-[13px] tabular-nums">{row.priority}</span>,
  },
  {
    title: "Muddat",
    key: "period",
    width: 190,
    render: (_v, row) => (
      <div className="flex flex-col text-xs whitespace-nowrap tabular-nums">
        <span className="text-content">{formatDateTime(row.publishAt)}</span>
        <span className="text-content-muted">→ {formatDateTime(row.expireAt)}</span>
      </div>
    ),
  },
  {
    title: "Ko‘rish",
    key: "views",
    width: 90,
    align: "right",
    render: (_v, row) => <span className={NUM_CLASS}>{formatNumber(row.viewsCount)}</span>,
  },
  {
    title: "Bosish",
    key: "clicks",
    width: 80,
    align: "right",
    render: (_v, row) => <span className={NUM_CLASS}>{formatNumber(row.clicksCount)}</span>,
  },
];

const StoriesEmpty = ({ tab, onCreate }: { tab: Tab; onCreate?: () => void }) => {
  if (tab === "ALL") {
    return (
      <TableEmptyState
        title="Hali story yo‘q"
        description="Birinchisini yarating — u qoralama bo‘lib saqlanadi."
        action={onCreate ? { label: "Story yaratish", onClick: onCreate } : undefined}
      />
    );
  }
  return <p className="py-14 text-center text-[13px] text-content-muted">{EMPTY_TAB_TEXT[tab]}</p>;
};

const StoriesTable = ({ onCreate }: { onCreate?: () => void }) => {
  const navigate = useNavigate();
  const filters = useStoriesFilters();
  const { data, isPending, isError, error, refetch } = useStoriesQuery(filters.filters);

  if (isAccessDenied(error)) {
    return <Forbidden />;
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="max-w-full overflow-x-auto">
          <FilterSegmented<Tab> label="Holat bo‘yicha filtr" value={filters.tab} options={TAB_OPTIONS} onChange={filters.setTab} />
        </div>
        <FilterSegmented label="Saralash" value={filters.sort} options={SORT_OPTIONS} onChange={filters.setSort} />
      </div>
      <DataTable<StoryListItem>
        columns={columns}
        data={data?.elements}
        rowKey="id"
        isLoading={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        emptyState={<StoriesEmpty tab={filters.tab} onCreate={onCreate} />}
        onRow={(row) => ({
          onClick: () => navigate(ROUTES.storyDetail(String(row.id))),
          className: `cursor-pointer ${row.status === "EXPIRED" || row.status === "ARCHIVED" ? "opacity-60" : ""}`,
        })}
        pagination={{
          page: filters.filters.page,
          size: filters.filters.size,
          totalElements: data?.totalElements ?? 0,
          onChange: (nextPage) => filters.setPage(nextPage),
        }}
      />
    </>
  );
};

export const StoriesPage = () => {
  const { role } = useAuth();
  const canWrite = isAdmin(role);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Story"
        description="Mobil ilova bosh sahifasidagi story’lar. Holat nashr va muddat vaqtidan hisoblanadi."
        badge={!canWrite && <StatusChip tone="neutral" label="Faqat ko‘rish" />}
        actions={
          <Tooltip title={canWrite ? undefined : ADMIN_ONLY_MESSAGE}>
            <Button type="primary" disabled={!canWrite} onClick={() => setOpen(true)}>
              Story yaratish
            </Button>
          </Tooltip>
        }
      />
      <StoriesTable onCreate={canWrite ? () => setOpen(true) : undefined} />
      <StoryEditorPanel
        open={open}
        storyId={null}
        onClose={() => setOpen(false)}
        onSaved={(story) => navigate(ROUTES.storyDetail(String(story.id)))}
      />
    </>
  );
};
