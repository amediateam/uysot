import type { ChipTone } from "@/components/ui/StatusChip";
import type { Language, StoryStatus } from "@/services/stories/types";

// Status metadata, language set, field limits and filter options (recovered from the build).
export const STATUS_META: Record<StoryStatus, { label: string; tone: ChipTone }> = {
  DRAFT: { label: "Qoralama", tone: "neutral" },
  SCHEDULED: { label: "Rejalashtirilgan", tone: "accent" },
  ACTIVE: { label: "Faol", tone: "success" },
  EXPIRED: { label: "Muddati tugagan", tone: "warning" },
  ARCHIVED: { label: "Arxivlangan", tone: "neutral" },
};

export const LANGUAGES: Language[] = ["uz", "ru", "tg"];
export const REQUIRED_LANGUAGES: Language[] = ["uz", "ru"];

export const FIELD_LIMITS = { label: 30, signature: 60, body: 250, buttonText: 25 } as const;

export const FIELD_LABELS: Record<keyof typeof FIELD_LIMITS, string> = {
  label: "yorliq",
  signature: "sarlavha",
  body: "matn",
  buttonText: "tugma matni",
};

export const DISPLAY_SECONDS = { min: 3, max: 15, default: 7 };

export const ADMIN_ONLY_MESSAGE = "Bu amal ADMIN uchun";

export const TAB_OPTIONS: { value: StoryStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Hammasi" },
  { value: "ACTIVE", label: "Faol" },
  { value: "SCHEDULED", label: "Rejalashtirilgan" },
  { value: "DRAFT", label: "Qoralama" },
  { value: "EXPIRED", label: "Muddati tugagan" },
  { value: "ARCHIVED", label: "Arxiv" },
];

export const SORT_OPTIONS: { value: "PRIORITY" | "PUBLISH_AT"; label: string }[] = [
  { value: "PRIORITY", label: "Ustuvorlik" },
  { value: "PUBLISH_AT", label: "Boshlanish" },
];

export const EMPTY_TAB_TEXT: Record<StoryStatus, string> = {
  DRAFT: "Qoralama story yo‘q",
  SCHEDULED: "Rejalashtirilgan story yo‘q",
  ACTIVE: "Faol story yo‘q",
  EXPIRED: "Muddati tugagan story yo‘q",
  ARCHIVED: "Arxivda story yo‘q",
};

// Media constraints.
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const VIDEO_TYPES = ["video/mp4"];
export const MEDIA_ACCEPT = [...IMAGE_TYPES, ...VIDEO_TYPES].join(",");
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 30 * 1024 * 1024;
export const MAX_VIDEO_MS = 30000;
export const HTTPS_URL_RE = /^https:\/\/\S+$/;
export const TASHKENT_OFFSET = "+05:00";
