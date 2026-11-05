import { ArrowUpOutlined, ExclamationOutlined } from "@ant-design/icons";
import { Alert, Button, Segmented, Skeleton, Tooltip } from "antd";
import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { ApiErrorCode } from "@/constants/api-error-codes";
import { isAdmin } from "@/permissions";
import { isAccessDenied, isApiError } from "@/services/api-error";
import { getStoryFile } from "@/services/stories/api";
import { useAuth } from "@/hooks/use-auth";
import { useApiMessage } from "@/hooks/use-api-message";
import {
  useActiveStoryCount,
  useArchiveStory,
  usePublishStory,
  useStory,
  useUnpublishStory,
} from "@/hooks/stories";
import { formatNumber } from "@/utils/format-number";
import { formatDateTime } from "@/utils/format-date-time";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TableEmptyState } from "@/components/ui/TableEmptyState";
import { TableErrorState } from "@/components/ui/TableErrorState";
import { StoryStatusChip } from "@/components/stories/StoryStatusChip";
import { StoryPreview } from "@/components/stories/StoryPreview";
import { StoryEditorPanel } from "@/components/stories/StoryEditorPanel";
import { Forbidden } from "@/pages/forbidden/Forbidden";
import { ADMIN_ONLY_MESSAGE, LANGUAGES, STATUS_META } from "@/services/stories/constants";
import {
  actionSummary,
  formatCtr,
  isPast,
  mediaImageFileId,
  mediaSummary,
  normalizeContent,
  relativeExpire,
  resolveContent,
} from "@/services/stories/format";
import type { Language, Story } from "@/services/stories/types";

type StoryAction = "edit" | "publish" | "unpublish" | "archive";

const BADGE_TONE: Record<"accent" | "warning" | "danger", string> = {
  accent: "bg-accent-soft text-accent",
  warning: "bg-warning-soft text-warning-strong",
  danger: "bg-danger-soft text-danger",
};

const Badge = ({ tone, icon, children }: { tone: "accent" | "warning" | "danger"; icon: ReactNode; children: ReactNode }) => (
  <span className="flex items-center gap-3">
    <span className={`flex size-8.5 shrink-0 items-center justify-center rounded-full ${BADGE_TONE[tone]}`}>{icon}</span>
    {children}
  </span>
);

const Card = ({ className = "", children }: { className?: string; children: ReactNode }) => (
  <section className={`rounded-lg bg-surface shadow-card ${className}`}>{children}</section>
);

const EXPIRED_HINT = "Tugash vaqti o‘tgan — avval tahrirlang";

const availableActions = (story: Story, canWrite: boolean): { action: StoryAction; disabledReason: string | null }[] => {
  const base = canWrite ? null : ADMIN_ONLY_MESSAGE;
  const entry = (action: StoryAction, reason: string | null = null) => ({ action, disabledReason: base ?? reason });
  switch (story.status) {
    case "DRAFT":
      return [entry("edit"), entry("archive"), entry("publish", isPast(story.expireAt) ? EXPIRED_HINT : null)];
    case "ARCHIVED":
      return [
        { action: "edit" as const, disabledReason: "Arxivlangan story tahrirlanmaydi" },
        { action: "publish" as const, disabledReason: "Arxivlangan story nashr qilinmaydi" },
      ];
    default:
      return [entry("edit"), entry("unpublish"), entry("archive")];
  }
};

const ACTION_LABELS: Record<StoryAction, string> = {
  edit: "Tahrirlash",
  publish: "Nashr qilish",
  unpublish: "Nashrdan olish",
  archive: "Arxivlash",
};

const actionButtonProps = (action: StoryAction, disabled: boolean) => {
  if (action === "publish") return { type: "primary" as const };
  if (action === "archive") return { danger: true };
  if (action === "unpublish" && !disabled) {
    return { className: "border-warning-soft! bg-warning-soft! font-semibold text-warning-strong! hover:opacity-85" };
  }
  return {};
};

const statusLine = (story: Story): string => {
  switch (story.status) {
    case "ACTIVE":
      return `Ilovada ${formatDateTime(story.expireAt)} gacha ko‘rinadi · ${relativeExpire(story.expireAt)}`;
    case "SCHEDULED":
      return `Nashr qilingan, ${formatDateTime(story.publishAt)} da paydo bo‘ladi`;
    case "EXPIRED":
      return `Muddati ${formatDateTime(story.expireAt)} da tugagan. Muddatni uzaytirish uchun tahrirlang`;
    case "ARCHIVED":
      return "Faqat o‘qish. Kontent va statistika ko‘rinadi";
    default:
      return "Ilovada ko‘rinmaydi — nashr qilinmagan";
  }
};

const ActionButtons = ({ story, canWrite, onAction }: { story: Story; canWrite: boolean; onAction: (action: StoryAction) => void }) => (
  <div className="flex flex-wrap gap-2">
    {availableActions(story, canWrite).map(({ action, disabledReason }) => (
      <Tooltip key={action} title={disabledReason}>
        <Button {...actionButtonProps(action, disabledReason !== null)} disabled={disabledReason !== null} onClick={() => onAction(action)}>
          {ACTION_LABELS[action]}
        </Button>
      </Tooltip>
    ))}
  </div>
);

const DetailHeader = ({ story, canWrite, onAction }: { story: Story; canWrite: boolean; onAction: (action: StoryAction) => void }) => (
  <>
    <nav className="mb-4 flex items-center gap-2 text-[13px] text-content-muted">
      <Link to={ROUTES.stories} className="hover:text-accent">
        Story
      </Link>
      <span>/</span>
      <span className="font-mono font-medium text-content">#{story.id}</span>
    </nav>
    <header className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-content">{story.content.uz.signature}</h1>
          <StoryStatusChip status={story.status} />
        </div>
        <p className="text-[13px] text-content-muted">{statusLine(story)}</p>
      </div>
      <ActionButtons story={story} canWrite={canWrite} onAction={onAction} />
    </header>
  </>
);

const CONTENT_FIELDS: { field: "label" | "signature" | "body" | "buttonText"; label: string }[] = [
  { field: "label", label: "Yorliq" },
  { field: "signature", label: "Sarlavha" },
  { field: "body", label: "Matn" },
  { field: "buttonText", label: "Tugma" },
];
const CELL = "border-t border-row-border px-5 py-3";

const ContentTable = ({ story }: { story: Story }) => (
  <Card className="overflow-hidden">
    <h2 className="border-b border-row-border px-5 py-4 text-[15px] font-semibold text-content">Kontent</h2>
    <div className="overflow-x-auto">
      <div className="grid min-w-160 grid-cols-[110px_repeat(3,minmax(0,1fr))] text-[13px]">
        <span className="bg-surface-muted px-5 py-2.5" />
        {LANGUAGES.map((lang) => (
          <span key={lang} className="bg-surface-muted px-5 py-2.5 font-mono text-xs font-semibold text-content">
            {lang}
          </span>
        ))}
        {CONTENT_FIELDS.map(({ field, label }) => (
          <div key={field} className="contents">
            <span className={`${CELL} text-xs text-content-muted`}>{label}</span>
            {LANGUAGES.map((lang) => {
              const value = story.content[lang]?.[field];
              return (
                <span key={lang} className={`${CELL} leading-normal break-words ${value ? "text-content" : "text-content-muted"}`}>
                  {value || "—"}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  </Card>
);

const MetaGrid = ({ story }: { story: Story }) => {
  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: "Media", value: mediaSummary(story.mediaType, story.durationMs, story.displaySeconds) },
    { label: "Harakat", value: actionSummary(story.action), mono: true },
    { label: "Boshlanish", value: formatDateTime(story.publishAt) },
    { label: "Tugash", value: formatDateTime(story.expireAt) },
    { label: "Ustuvorlik", value: String(story.priority) },
    { label: "Nashr qilingan", value: formatDateTime(story.publishedAt) },
    { label: "Yaratgan", value: story.createdBy?.fullName ?? "—" },
    { label: "Yaratilgan", value: formatDateTime(story.createdAt) },
    { label: "Fayl", value: story.media?.path ?? "Media topilmadi", mono: !!story.media },
    { label: "Yangilangan", value: formatDateTime(story.updatedAt) },
  ];
  return (
    <Card className="grid grid-cols-[120px_minmax(0,1fr)] gap-x-4 gap-y-2.5 px-5 py-4.5 text-[13px] lg:grid-cols-[150px_minmax(0,1fr)_150px_minmax(0,1fr)]">
      {rows.map(({ label, value, mono }) => (
        <div key={label} className="contents">
          <span className="text-xs text-content-muted">{label}</span>
          <span title={value} className={`truncate text-content tabular-nums ${mono ? "font-mono text-xs" : ""}`}>
            {value}
          </span>
        </div>
      ))}
    </Card>
  );
};

const StatsCard = ({ story }: { story: Story }) => {
  const { stats } = story;
  if (!stats || (story.status === "SCHEDULED" && stats.views === 0)) {
    return (
      <Card className="flex flex-col gap-1 px-6 py-5">
        <p className="text-[15px] font-semibold text-content">Hali ko‘rsatilmagan</p>
        <p className="text-[13px] text-content-muted">Statistika story ilovada ko‘rina boshlagach to‘planadi.</p>
      </Card>
    );
  }
  const metrics = [
    { label: "Ko‘rishlar", value: formatNumber(stats.views), unit: "" },
    { label: "Unikal tomoshabin", value: formatNumber(stats.uniqueViewers), unit: "" },
    { label: "Bosishlar", value: formatNumber(stats.clicks), unit: "" },
    { label: "CTR", value: formatCtr(stats.ctr), unit: stats.ctr === null ? "" : "%" },
  ];
  return (
    <Card className="grid grid-cols-2 gap-y-5 px-1 py-5.5 sm:grid-cols-4">
      {metrics.map((metric, index) => (
        <div
          key={metric.label}
          className={`flex flex-col gap-1 px-5 ${index % 2 ? "border-l border-border" : ""} ${index === 2 ? "sm:border-l sm:border-border" : ""}`}
        >
          <p className="flex items-baseline gap-1.5">
            <span className="text-[32px] leading-none font-bold tracking-tight text-content tabular-nums">{metric.value}</span>
            {metric.unit && <span className="text-[13px] text-content-muted">{metric.unit}</span>}
          </p>
          <p className="text-xs text-content-muted">{metric.label}</p>
        </div>
      ))}
    </Card>
  );
};

const useFileOpener = () => {
  const [isOpening, setIsOpening] = useState(false);
  const toast = useApiMessage();
  return {
    isOpening,
    openFile: async (fileId: number) => {
      const tab = window.open("", "_blank");
      if (!tab) {
        toast.errorText("Brauzer yangi oynani ochishga ruxsat bermadi.");
        return;
      }
      setIsOpening(true);
      try {
        const url = URL.createObjectURL(await getStoryFile(fileId));
        tab.location.href = url;
        window.setTimeout(() => URL.revokeObjectURL(url), 120_000);
      } catch (error) {
        tab.close();
        toast.error(error);
      } finally {
        setIsOpening(false);
      }
    },
  };
};

const PreviewCard = ({ story }: { story: Story }) => {
  const [lang, setLang] = useState<Language>("uz");
  const { content, fallbackNote } = resolveContent(
    { uz: normalizeContent(story.content.uz), ru: normalizeContent(story.content.ru), tg: story.content.tg && normalizeContent(story.content.tg) },
    lang,
  );
  const { openFile, isOpening } = useFileOpener();
  const { media } = story;
  return (
    <Card className="flex flex-col items-center gap-2.5 p-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-[13px] font-semibold text-content">Preview</h2>
        <div role="group" aria-label="Preview tili">
          <Segmented<Language>
            size="small"
            value={lang}
            onChange={setLang}
            options={LANGUAGES.map((l) => ({ value: l, label: <span className="font-mono text-[11px]">{l}</span> }))}
          />
        </div>
      </div>
      <StoryPreview
        size="sm"
        content={content}
        showButton={story.action.type !== "NONE"}
        media={{ type: story.mediaType, imageFileId: mediaImageFileId(story.mediaType, media?.id ?? null, story.poster?.id ?? null) }}
      />
      {fallbackNote && (
        <p className="w-full rounded-[10px] bg-warning-soft px-2.5 py-2 text-center text-[11px] text-warning-strong">{fallbackNote}</p>
      )}
      {media ? (
        <Button type="link" size="small" loading={isOpening} onClick={() => void openFile(media.id)} className="text-xs! font-semibold">
          Mediani ochish →
        </Button>
      ) : (
        <p className="text-xs text-content-muted">Media topilmadi</p>
      )}
    </Card>
  );
};

const PublishModal = ({ story, open, onClose }: { story: Story; open: boolean; onClose: () => void }) => {
  const toast = useApiMessage();
  const { mutate, isPending } = usePublishStory();
  const { data: activeCount } = useActiveStoryCount(open);
  const [expiredError, setExpiredError] = useState<string | null>(null);
  const close = () => {
    setExpiredError(null);
    onClose();
  };
  const scheduled = !isPast(story.publishAt);
  return (
    <ConfirmModal
      open={open}
      title={
        <Badge tone="accent" icon={<ArrowUpOutlined />}>
          Story #{story.id} ni nashr qilish
        </Badge>
      }
      description={
        scheduled ? (
          <>
            Boshlanish vaqti hali kelmagan — story <b className="font-semibold">Rejalashtirilgan</b> bo‘ladi va ilovada{" "}
            <span className="tabular-nums">{formatDateTime(story.publishAt)}</span> da paydo bo‘ladi.
          </>
        ) : (
          <>
            Story darhol <b className="font-semibold">Faol</b> bo‘ladi va ilovada{" "}
            <span className="tabular-nums">{formatDateTime(story.expireAt)}</span> gacha ko‘rinadi.
          </>
        )
      }
      confirmLabel="Nashr qilish"
      loading={isPending}
      onCancel={close}
      onConfirm={() =>
        mutate(story.id, {
          onSuccess: (published) => {
            const when = published.status === "SCHEDULED" ? ` · ${formatDateTime(published.publishAt)}` : "";
            toast.success(`Story #${published.id} nashr qilindi · ${STATUS_META[published.status].label}${when}`);
            close();
          },
          onError: (error) => {
            if (isApiError(error) && error.code === ApiErrorCode.STORY_EXPIRED) {
              setExpiredError(error.message);
              return;
            }
            toast.error(error);
            close();
          },
        })
      }
    >
      {(activeCount ?? 0) >= 20 || expiredError ? (
        <div className="flex flex-col gap-2">
          {(activeCount ?? 0) >= 20 && (
            <Alert type="warning" showIcon message={`Hozir ${activeCount} ta faol story bor — 20 tagacha tavsiya etiladi.`} />
          )}
          {expiredError && <Alert type="error" showIcon message={expiredError} />}
        </div>
      ) : null}
    </ConfirmModal>
  );
};

const UnpublishModal = ({ storyId, open, onClose }: { storyId: number; open: boolean; onClose: () => void }) => {
  const toast = useApiMessage();
  const { mutate, isPending } = useUnpublishStory();
  return (
    <ConfirmModal
      open={open}
      tone="neutral"
      title={
        <Badge tone="warning" icon={<ExclamationOutlined />}>
          Nashrdan olish
        </Badge>
      }
      description="Story ilovadan darhol yo‘qoladi va qoralamaga qaytadi. Statistika saqlanadi, istalgan payt qayta nashr qilish mumkin."
      confirmLabel="Nashrdan olish"
      loading={isPending}
      onCancel={onClose}
      onConfirm={() =>
        mutate(storyId, {
          onSuccess: () => toast.success(`Story #${storyId} nashrdan olindi · Qoralama`),
          onError: (error) => toast.error(error),
          onSettled: onClose,
        })
      }
    />
  );
};

const ArchiveModal = ({ storyId, open, onClose }: { storyId: number; open: boolean; onClose: () => void }) => {
  const toast = useApiMessage();
  const navigate = useNavigate();
  const { mutate, isPending } = useArchiveStory();
  return (
    <ConfirmModal
      open={open}
      tone="danger"
      title={
        <Badge tone="danger" icon={<ExclamationOutlined />}>
          Story #{storyId} ni arxivlash
        </Badge>
      }
      description="Arxivlangan story ilovada ko‘rinmaydi, tahrirlanmaydi va qayta nashr qilinmaydi. Bu amalni panel orqali qaytarib bo‘lmaydi."
      confirmLabel="Arxivlash"
      loading={isPending}
      onConfirm={() =>
        mutate(storyId, {
          onSuccess: () => {
            toast.success(`Story #${storyId} arxivlandi`);
            onClose();
            navigate(ROUTES.stories);
          },
          onError: (error) => {
            toast.error(error);
            onClose();
          },
        })
      }
      onCancel={onClose}
    />
  );
};

export const StoryDetailPage = () => {
  const { storyId } = useParams();
  const id = Number(storyId);
  const navigate = useNavigate();
  const { role } = useAuth();
  const { data, isPending, isError, error, refetch } = useStory(id);
  const [action, setAction] = useState<StoryAction | null>(null);
  const close = () => setAction(null);

  if (isAccessDenied(error)) {
    return <Forbidden />;
  }
  if (!Number.isFinite(id) || (isApiError(error) && error.code === ApiErrorCode.STORY_NOT_FOUND)) {
    return (
      <Card>
        <TableEmptyState
          title="Story topilmadi"
          description={`#${storyId ?? ""} raqamli story yo‘q.`}
          action={{ label: "Ro‘yxatga qaytish", onClick: () => navigate(ROUTES.stories) }}
        />
      </Card>
    );
  }
  if (isError) {
    return <TableErrorState onRetry={() => void refetch()} />;
  }
  if (isPending) {
    return <Skeleton active paragraph={{ rows: 10 }} />;
  }

  return (
    <>
      <DetailHeader story={data} canWrite={isAdmin(role)} onAction={setAction} />
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-4">
          <StatsCard story={data} />
          <ContentTable story={data} />
          <MetaGrid story={data} />
        </div>
        <PreviewCard story={data} />
      </div>
      <StoryEditorPanel open={action === "edit"} storyId={data.id} onClose={close} />
      <PublishModal story={data} open={action === "publish"} onClose={close} />
      <UnpublishModal storyId={data.id} open={action === "unpublish"} onClose={close} />
      <ArchiveModal storyId={data.id} open={action === "archive"} onClose={close} />
    </>
  );
};
