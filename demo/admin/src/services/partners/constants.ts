import type { ChipTone } from "@/components/ui/StatusChip";
import type { BlockType, DiscountType, Language, PartnerStatus, SocialNetwork } from "@/services/partners/types";

// Field + media limits (recovered from the build).
export const LIMITS = {
  name: 60,
  condition: 80,
  discountText: 20,
  categoryName: 40,
  maxBlocks: 40,
  pdfMaxMb: 10,
  imageMaxMb: 10,
  bannerWidth: 1000,
  bannerAspect: 2,
  percentMax: 100,
};

export const BLOCK_LIMITS = {
  HEADING_1: 60,
  PARAGRAPH: 500,
  HEADING_2: 40,
  listItem: 80,
  linkLabel: 30,
  bannerBadge: 20,
  bannerCaption: 40,
  address: 120,
  hours: 40,
  hoursNote: 40,
  calloutTitle: 40,
  calloutText: 120,
  url: 2048,
} as const;

export const BLOCK_RANGES = { listMin: 2, listMax: 8, galleryMin: 2, galleryMax: 20, socialMin: 1 };

export const SOCIAL_NETWORKS: { key: SocialNetwork; label: string }[] = [
  { key: "INSTAGRAM", label: "Instagram" },
  { key: "TELEGRAM", label: "Telegram" },
  { key: "TIKTOK", label: "TikTok" },
  { key: "X", label: "X" },
  { key: "YOUTUBE", label: "YouTube" },
  { key: "FACEBOOK", label: "Facebook" },
];

export const BLOCK_CATALOG: Record<BlockType, { label: string; once?: boolean }> = {
  PARAGRAPH: { label: "Matn" },
  HEADING_1: { label: "Sarlavha H1", once: true },
  HEADING_2: { label: "Sarlavha H2" },
  BULLET_LIST: { label: "Ro‘yxat" },
  LINK: { label: "Havola" },
  SOCIAL_LINKS: { label: "Ijtimoiy tarmoqlar" },
  BANNER: { label: "Banner" },
  GALLERY: { label: "Galereya" },
  ADDRESS: { label: "Manzil" },
  CONTACTS: { label: "Kontaktlar" },
  WORKING_HOURS: { label: "Ish vaqti" },
  CALLOUT: { label: "Muhim", once: true },
  DOCUMENT: { label: "Hujjat" },
};
// Insertion order of the "add block" menu.
export const BLOCK_ORDER = Object.keys(BLOCK_CATALOG) as BlockType[];

export const STATUS_META: Record<PartnerStatus, { label: string; tone: ChipTone }> = {
  ACTIVE: { label: "Faol", tone: "success" },
  DRAFT: { label: "Qoralama", tone: "neutral" },
  EXPIRED: { label: "Muddati o‘tgan", tone: "warning" },
};

export const STATUS_TABS: { value: PartnerStatus | "ALL"; label: string; countKey: keyof import("@/services/partners/types").PartnerCounts }[] = [
  { value: "ALL", label: "Barchasi", countKey: "all" },
  { value: "ACTIVE", label: "Faol", countKey: "active" },
  { value: "DRAFT", label: "Qoralama", countKey: "draft" },
  { value: "EXPIRED", label: "Muddati o‘tgan", countKey: "expired" },
];

export const EMPTY_STATUS_TEXT: Record<PartnerStatus, string> = {
  ACTIVE: "Faol hamkor yo‘q.",
  DRAFT: "Qoralama hamkor yo‘q.",
  EXPIRED: "Muddati o‘tgan hamkor yo‘q.",
};

export const DISCOUNT_TYPES: { value: DiscountType; label: string }[] = [
  { value: "PERCENT", label: "Foiz" },
  { value: "AMOUNT", label: "Summa" },
  { value: "TEXT", label: "Boshqa shart" },
];

export const WRITE_ROLE_HINT = "Bu amal ADMIN va SUPER_ADMIN uchun";
export const LANGUAGES: Language[] = ["uz", "ru", "tg"];
export const REQUIRED_LANGUAGES: Language[] = ["uz", "ru"];
export const TIME_ZONE = "Asia/Tashkent";
