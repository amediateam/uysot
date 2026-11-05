import type { Paginated } from "@/services/companies/types";
import type { Language } from "@/services/stories/types";

export type { Language };

// Partners domain types (recovered from usage in the build).
export type Ml = Record<Language, string>; // multilingual text (uz/ru/tg)
export type PartnerStatus = "ACTIVE" | "DRAFT" | "EXPIRED";
export type DiscountType = "PERCENT" | "AMOUNT" | "TEXT";

export interface PartnerFile {
  id: number;
  originalName: string;
  size: number;
}

export interface PartnerCategory {
  id: number;
  name: Ml;
  sortOrder: number;
  partnerCount: number;
}

export interface Discount {
  type: DiscountType;
  value: number | null;
  text: Ml | null;
}

// --- content blocks ---------------------------------------------------------
export type SocialNetwork = "INSTAGRAM" | "TELEGRAM" | "TIKTOK" | "X" | "YOUTUBE" | "FACEBOOK";

// Server block shapes (what the API returns / expects).
export type ServerBlock =
  | { type: "HEADING_1" | "HEADING_2" | "PARAGRAPH"; text: Ml }
  | { type: "BULLET_LIST"; items: Ml[] }
  | { type: "LINK"; label: Ml; url: string }
  | { type: "SOCIAL_LINKS"; links: { network: SocialNetwork; url: string }[] }
  | { type: "BANNER"; imageFileId: number; image?: PartnerFile; badge: string | null; caption: Ml }
  | { type: "GALLERY"; imageFileIds: number[]; images?: PartnerFile[] }
  | { type: "ADDRESS"; text: Ml; latitude: number; longitude: number }
  | { type: "CONTACTS"; phone: string | null; website: string | null }
  | { type: "WORKING_HOURS"; hours: Ml; note: Ml | null }
  | { type: "CALLOUT"; title: Ml; text: Ml }
  | { type: "DOCUMENT"; fileId: number; file?: PartnerFile };

export type BlockType = ServerBlock["type"];

export interface FileRef {
  id: number;
  file: PartnerFile | null;
}

// Editor (form) block shapes — richer, with local keys and draft strings.
export type FormBlock =
  | { key: string; type: "HEADING_1" | "HEADING_2" | "PARAGRAPH"; text: Ml }
  | { key: string; type: "BULLET_LIST"; items: Ml[] }
  | { key: string; type: "LINK"; label: Ml; url: string }
  | { key: string; type: "SOCIAL_LINKS"; links: Partial<Record<SocialNetwork, string>> }
  | { key: string; type: "BANNER"; image: FileRef | null; badge: string; caption: Ml }
  | { key: string; type: "GALLERY"; images: FileRef[] }
  | { key: string; type: "ADDRESS"; text: Ml; latitude: string; longitude: string }
  | { key: string; type: "CONTACTS"; phone: string; website: string }
  | { key: string; type: "WORKING_HOURS"; hours: Ml; note: Ml }
  | { key: string; type: "CALLOUT"; title: Ml; text: Ml }
  | { key: string; type: "DOCUMENT"; document: FileRef | null };

export interface Partner {
  id: number;
  name: string;
  category: PartnerCategory;
  logo: PartnerFile | null;
  discount: Discount;
  condition: Ml | null;
  phone: string;
  validUntil: string | null;
  sortOrder: number;
  published: boolean;
  status: PartnerStatus;
  createdAt: string;
  content: ServerBlock[];
}

export type PartnerListItem = Partner;

export interface PartnerCounts {
  all: number;
  active: number;
  draft: number;
  expired: number;
}

export interface PartnerListFilters {
  categoryId?: number;
  search?: string;
  status?: PartnerStatus;
  page: number;
  size: number;
  oldestFirst: boolean;
}

export interface PartnerCountFilters {
  categoryId?: number;
  search?: string;
}

export type PartnerList = Paginated<PartnerListItem>;

// The editor's form state.
export interface PartnerFormValues {
  categoryId: number | null;
  name: string;
  logo: FileRef | null;
  discountType: DiscountType;
  discountValue: string;
  discountText: Ml;
  condition: Ml;
  phone: string;
  validUntil: string | null;
  sortOrder: string;
  published: boolean;
  blocks: FormBlock[];
}

// Validation issue.
export interface Issue {
  field: string;
  lang: Language | null;
  message: string;
  quiet?: boolean;
}

export type UploadKind = "IMAGE" | "PDF";
