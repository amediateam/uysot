import { DISPLAY_SECONDS, LANGUAGES, TASHKENT_OFFSET } from "@/services/stories/constants";
import type {
  Language,
  SavedContent,
  Story,
  StoryAction,
  StoryContent,
  StoryFormValues,
  StoryMediaType,
  StoryRequest,
} from "@/services/stories/types";

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;
// The app shows Tashkent-local times; this offset bridges ISO strings and the +05:00 wall clock.
const TASHKENT_OFFSET_MS = 18_000_000;

// Grapheme-aware length (emoji count as one), matching the build's input counters.
export const glyphLength = (value: string): number => [...value].length;

export const formatDuration = (ms: number | null | undefined): string => {
  if (!ms || ms <= 0) return "—";
  const totalSeconds = Math.round(ms / 1000);
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
};

export const mediaSummary = (
  type: StoryMediaType,
  durationMs: number | null,
  displaySeconds: number | null,
): string =>
  type === "VIDEO"
    ? `VIDEO · ${formatDuration(durationMs)}`
    : `IMAGE · ${displaySeconds ?? Math.round((durationMs ?? 0) / 1000)} s`;

// Short, list-friendly action label.
export const actionLabel = (action: StoryAction): string => {
  if (action.type === "NONE" || !action.value) return "—";
  if (action.type === "INTERNAL") return `→ ${action.value}`;
  return `↗ ${action.value.replace(/^https:\/\//, "")}`;
};

// Full action summary, e.g. "INTERNAL → home".
export const actionSummary = (action: StoryAction): string =>
  action.type === "NONE" || !action.value ? "NONE" : `${action.type} → ${action.value}`;

export const formatCtr = (ctr: number | null): string =>
  ctr === null ? "—" : (ctr * 100).toFixed(1).replace(".", ",");

export const formatFileSize = (bytes: number | null): string | null => {
  if (bytes === null) return null;
  if (bytes < 1_048_576) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1_048_576).toFixed(1).replace(".", ",")} MB`;
};

export const isPast = (iso: string): boolean => Date.parse(iso) <= Date.now();

export const periodDuration = (publishAt: string, expireAt: string): string | null => {
  const diff = Date.parse(expireAt) - Date.parse(publishAt);
  if (!Number.isFinite(diff) || diff <= 0) return null;
  const days = Math.floor(diff / DAY_MS);
  const hours = Math.floor((diff % DAY_MS) / HOUR_MS);
  if (days === 0 && hours === 0) return `${Math.max(1, Math.round(diff / 60000))} daqiqa`;
  return [days && `${days} kun`, hours && `${hours} soat`].filter(Boolean).join(" ");
};

export const relativeExpire = (iso: string): string => {
  const diff = Date.parse(iso) - Date.now();
  if (diff <= 0) return "muddati tugadi";
  if (diff < DAY_MS) return "bugun tugaydi";
  return `${Math.ceil(diff / DAY_MS)} kun qoldi`;
};

// For a VIDEO the displayable image is the poster; for an IMAGE it's the media file itself.
export const mediaImageFileId = (
  type: StoryMediaType,
  mediaFileId: number | null,
  posterFileId: number | null,
): number | null => (type === "VIDEO" ? posterFileId : mediaFileId);

export const emptyContent = (): StoryContent => ({ label: "", signature: "", body: "", buttonText: "" });

export const normalizeContent = (content: Partial<StoryContent> | null | undefined): StoryContent => ({
  label: content?.label ?? "",
  signature: content?.signature ?? "",
  body: content?.body ?? "",
  buttonText: content?.buttonText ?? "",
});

export const isEmptyContent = (content: StoryContent): boolean =>
  Object.values(content).every((value) => value.trim() === "");

// --- Date helpers (Tashkent wall clock) -------------------------------------
// ISO -> "YYYY-MM-DDTHH:mm" in Tashkent local time.
export const toLocalInput = (iso: string): string =>
  new Date(Date.parse(iso) + TASHKENT_OFFSET_MS).toISOString().slice(0, 16);

// "YYYY-MM-DDTHH:mm" -> "...:00+05:00".
export const toOffsetIso = (localInput: string): string => `${localInput}:00${TASHKENT_OFFSET}`;

export const nowOffsetIso = (): string => toOffsetIso(toLocalInput(new Date().toISOString()));

export const addDaysOffsetIso = (iso: string, days: number): string =>
  toOffsetIso(toLocalInput(new Date(Date.parse(iso) + days * DAY_MS).toISOString()));

// --- Form <-> request / story conversions -----------------------------------
export const newFormValues = (): StoryFormValues => {
  const publishAt = nowOffsetIso();
  return {
    media: null,
    displaySeconds: DISPLAY_SECONDS.default,
    content: { uz: emptyContent(), ru: emptyContent(), tg: emptyContent() },
    actionType: "NONE",
    internalTarget: null,
    externalUrl: "",
    priority: 0,
    publishAt,
    expireAt: addDaysOffsetIso(publishAt, 7),
  };
};

export const storyToForm = (story: Story): StoryFormValues => {
  const { media, poster, action } = story;
  return {
    media: media && {
      mediaType: story.mediaType,
      mediaFileId: media.id,
      posterFileId: poster?.id ?? null,
      durationMs: story.mediaType === "VIDEO" ? story.durationMs : null,
      name: media.originalName,
      size: media.size,
      format: media.format.toUpperCase(),
    },
    displaySeconds: story.displaySeconds ?? DISPLAY_SECONDS.default,
    content: {
      uz: normalizeContent(story.content.uz),
      ru: normalizeContent(story.content.ru),
      tg: normalizeContent(story.content.tg),
    },
    actionType: action.type,
    internalTarget: action.type === "INTERNAL" ? action.value : null,
    externalUrl: action.type === "EXTERNAL" ? (action.value ?? "") : "",
    priority: story.priority,
    publishAt: story.publishAt,
    expireAt: story.expireAt,
  };
};

const trimOrNull = (value: string): string | null => value.trim() || null;

const toSavedContent = (content: StoryContent, requireButton: boolean): SavedContent => ({
  label: trimOrNull(content.label),
  signature: content.signature.trim(),
  body: trimOrNull(content.body),
  buttonText: requireButton ? trimOrNull(content.buttonText) : null,
});

export const formToRequest = (values: StoryFormValues): StoryRequest => {
  const { media, actionType } = values;
  const hasAction = actionType !== "NONE";
  const isVideo = media?.mediaType === "VIDEO";
  const saved = Object.fromEntries(
    LANGUAGES.map((lang) => [lang, toSavedContent(values.content[lang], hasAction)]),
  ) as Record<Language, SavedContent>;
  return {
    mediaFileId: media?.mediaFileId ?? 0,
    posterFileId: isVideo ? (media?.posterFileId ?? null) : null,
    displaySeconds: isVideo ? null : values.displaySeconds,
    content: { uz: saved.uz, ru: saved.ru, tg: isEmptyContent(values.content.tg) ? null : saved.tg },
    action: {
      type: actionType,
      value:
        actionType === "INTERNAL"
          ? values.internalTarget
          : actionType === "EXTERNAL"
            ? values.externalUrl.trim()
            : null,
      params: {},
    },
    priority: values.priority ?? 0,
    publishAt: values.publishAt,
    expireAt: values.expireAt,
  };
};

// Resolve a language's content for preview, falling back to RU for TG.
export const resolveContent = (
  content: Record<Language, StoryContent | null | undefined>,
  lang: Language,
): { content: StoryContent; fallbackNote: string | null } => {
  const current = content[lang];
  if (lang === "tg" && (!current || isEmptyContent(current)) && content.ru) {
    return { content: content.ru, fallbackNote: "tg kiritilmagan — ilovada ru ko‘rinadi" };
  }
  return { content: current ?? emptyContent(), fallbackNote: null };
};
