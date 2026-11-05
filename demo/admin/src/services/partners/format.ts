import { formatNumber } from "@/utils/format-number";
import { LANGUAGES, REQUIRED_LANGUAGES, TIME_ZONE } from "@/services/partners/constants";
import type {
  Discount,
  FormBlock,
  Issue,
  Language,
  Ml,
  Partner,
  PartnerFile,
  PartnerFormValues,
  PartnerStatus,
  ServerBlock,
  SocialNetwork,
} from "@/services/partners/types";

// --- multilingual helpers ---------------------------------------------------
export const emptyMl = (): Ml => ({ uz: "", ru: "", tg: "" });
export const toMl = (value: Partial<Ml> | null | undefined): Ml => ({
  uz: value?.uz ?? "",
  ru: value?.ru ?? "",
  tg: value?.tg ?? "",
});
// Trim for sending; empty TG becomes null.
export const trimMl = (value: Ml): { uz: string; ru: string; tg: string | null } => ({
  uz: value.uz.trim(),
  ru: value.ru.trim(),
  tg: value.tg.trim() || null,
});
export const isMlEmpty = (value: Ml): boolean => LANGUAGES.every((lang) => value[lang].trim() === "");
export const upper = (lang: Language): string => lang.toUpperCase();
const trimOrNull = (value: string): string | null => value.trim() || null;
const isBlank = (value: string): boolean => value.trim() === "";

// --- discount ---------------------------------------------------------------
const MINUS = "−";
export const discountLabel = (discount: Discount): string => {
  if (discount.type === "TEXT") return discount.text?.uz.trim() || "—";
  if (discount.value === null || discount.value <= 0) return "—";
  if (discount.type === "PERCENT") return `${MINUS}${discount.value}%`;
  return `${MINUS}${formatNumber(discount.value)} so‘m`;
};

// --- status & dates (Tashkent) ----------------------------------------------
const MONTHS = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];
const currentYear = () => Number(new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, year: "numeric" }).format());
const formatDay = (year: number, monthIndex: number, day: number): string => {
  const base = `${day}-${MONTHS[monthIndex]}`;
  return year === currentYear() ? base : `${base} ${year}`;
};

export const today = (): string => new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date());

export const formatValidUntil = (validUntil: string): string => {
  const [year, month, day] = validUntil.split("-").map(Number);
  if (!year || !month || !day) return validUntil;
  return formatDay(year, month - 1, day);
};

export const formatCreatedAt = (createdAt: string): string => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "—";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value);
  return formatDay(get("year"), get("month") - 1, get("day"));
};

// Derived status from the editor's live values.
export const deriveStatus = (values: Pick<PartnerFormValues, "published" | "validUntil">): PartnerStatus => {
  if (values.published) {
    if (values.validUntil !== null && values.validUntil < today()) return "EXPIRED";
    return "ACTIVE";
  }
  return "DRAFT";
};

// --- block emptiness + draft texts ------------------------------------------
export const isBlockEmpty = (block: FormBlock): boolean => {
  switch (block.type) {
    case "HEADING_1":
    case "PARAGRAPH":
    case "HEADING_2":
      return isMlEmpty(block.text);
    case "BULLET_LIST":
      return block.items.every(isMlEmpty);
    case "LINK":
      return isMlEmpty(block.label) && isBlank(block.url);
    case "SOCIAL_LINKS":
      return Object.values(block.links).every((v) => !v || isBlank(v));
    case "BANNER":
      return !block.image && isBlank(block.badge) && isMlEmpty(block.caption);
    case "GALLERY":
      return block.images.length === 0;
    case "ADDRESS":
      return isMlEmpty(block.text) && isBlank(block.latitude) && isBlank(block.longitude);
    case "CONTACTS":
      return isBlank(block.phone) && isBlank(block.website);
    case "WORKING_HOURS":
      return isMlEmpty(block.hours) && isMlEmpty(block.note);
    case "CALLOUT":
      return isMlEmpty(block.title) && isMlEmpty(block.text);
    case "DOCUMENT":
      return !block.document;
  }
};

const blockDraftTexts = (block: FormBlock): Ml[] => {
  switch (block.type) {
    case "HEADING_1":
    case "PARAGRAPH":
    case "HEADING_2":
    case "ADDRESS":
      return [block.text];
    case "BULLET_LIST":
      return block.items;
    case "LINK":
      return [block.label];
    case "BANNER":
      return [block.caption];
    case "WORKING_HOURS":
      return [block.hours, block.note];
    case "CALLOUT":
      return [block.title, block.text];
    default:
      return [];
  }
};

const allDraftTexts = (values: PartnerFormValues): Ml[] => [
  ...(values.discountType === "TEXT" ? [values.discountText] : []),
  values.condition,
  ...values.blocks.filter((b) => !isBlockEmpty(b)).flatMap(blockDraftTexts),
];

// Per-language tab marks: error / warning (missing TG shows RU in app).
export const languageMarks = (values: PartnerFormValues, issues: Issue[]): Record<Language, "error" | "warning" | null> => {
  const hasError = (lang: Language) => issues.some((i) => i.lang === lang && !i.quiet);
  const tgMissing = allDraftTexts(values).some((ml) => !isMlEmpty(ml) && ml.tg.trim() === "");
  return {
    uz: hasError("uz") ? "error" : null,
    ru: hasError("ru") ? "error" : null,
    tg: hasError("tg") ? "error" : tgMissing ? "warning" : null,
  };
};

// --- block factories + conversions ------------------------------------------
let blockCounter = 0;
const nextKey = () => `block-${(blockCounter += 1)}`;

export const createBlock = (type: FormBlock["type"]): FormBlock => {
  const key = nextKey();
  switch (type) {
    case "HEADING_1":
    case "PARAGRAPH":
    case "HEADING_2":
      return { key, type, text: emptyMl() };
    case "BULLET_LIST":
      return { key, type, items: [emptyMl(), emptyMl()] };
    case "LINK":
      return { key, type, label: emptyMl(), url: "" };
    case "SOCIAL_LINKS":
      return { key, type, links: {} };
    case "BANNER":
      return { key, type, image: null, badge: "", caption: emptyMl() };
    case "GALLERY":
      return { key, type, images: [] };
    case "ADDRESS":
      return { key, type, text: emptyMl(), latitude: "", longitude: "" };
    case "CONTACTS":
      return { key, type, phone: "", website: "" };
    case "WORKING_HOURS":
      return { key, type, hours: emptyMl(), note: emptyMl() };
    case "CALLOUT":
      return { key, type, title: emptyMl(), text: emptyMl() };
    case "DOCUMENT":
      return { key, type, document: null };
  }
};

const fileRef = (id: number, file: PartnerFile | undefined) => ({ id, file: file ?? null });

export const serverBlockToForm = (block: ServerBlock): FormBlock => {
  const key = nextKey();
  switch (block.type) {
    case "HEADING_1":
    case "HEADING_2":
    case "PARAGRAPH":
      return { key, type: block.type, text: toMl(block.text) };
    case "BULLET_LIST":
      return { key, type: block.type, items: block.items.map(toMl) };
    case "LINK":
      return { key, type: block.type, label: toMl(block.label), url: block.url };
    case "SOCIAL_LINKS":
      return {
        key,
        type: block.type,
        links: Object.fromEntries(block.links.map(({ network, url }) => [network, url])) as Partial<
          Record<SocialNetwork, string>
        >,
      };
    case "BANNER":
      return { key, type: block.type, image: fileRef(block.imageFileId, block.image), badge: block.badge ?? "", caption: toMl(block.caption) };
    case "GALLERY":
      return {
        key,
        type: block.type,
        images: block.imageFileIds.map((id) => fileRef(id, block.images?.find((f) => f.id === id))),
      };
    case "ADDRESS":
      return { key, type: block.type, text: toMl(block.text), latitude: String(block.latitude), longitude: String(block.longitude) };
    case "CONTACTS":
      return { key, type: block.type, phone: block.phone ?? "", website: block.website ?? "" };
    case "WORKING_HOURS":
      return { key, type: block.type, hours: toMl(block.hours), note: toMl(block.note) };
    case "CALLOUT":
      return { key, type: block.type, title: toMl(block.title), text: toMl(block.text) };
    case "DOCUMENT":
      return { key, type: block.type, document: fileRef(block.fileId, block.file) };
  }
};

export const formBlockToServer = (block: FormBlock): ServerBlock => {
  switch (block.type) {
    case "HEADING_1":
    case "HEADING_2":
    case "PARAGRAPH":
      return { type: block.type, text: trimMl(block.text) as Ml };
    case "BULLET_LIST":
      return { type: block.type, items: block.items.filter((i) => !isMlEmpty(i)).map((i) => trimMl(i) as Ml) };
    case "LINK":
      return { type: block.type, label: trimMl(block.label) as Ml, url: block.url.trim() };
    case "SOCIAL_LINKS":
      return {
        type: block.type,
        links: SOCIAL_NETWORKS_KEYS.map((key) => ({ network: key, url: block.links[key]?.trim() ?? "" })).filter((l) => l.url),
      };
    case "BANNER":
      return { type: block.type, imageFileId: block.image?.id ?? 0, badge: trimOrNull(block.badge), caption: trimMl(block.caption) as Ml };
    case "GALLERY":
      return { type: block.type, imageFileIds: block.images.map((i) => i.id) };
    case "ADDRESS":
      return { type: block.type, text: trimMl(block.text) as Ml, latitude: Number(block.latitude), longitude: Number(block.longitude) };
    case "CONTACTS":
      return { type: block.type, phone: trimOrNull(block.phone), website: trimOrNull(block.website) };
    case "WORKING_HOURS":
      return { type: block.type, hours: trimMl(block.hours) as Ml, note: isMlEmpty(block.note) ? null : (trimMl(block.note) as Ml) };
    case "CALLOUT":
      return { type: block.type, title: trimMl(block.title) as Ml, text: trimMl(block.text) as Ml };
    case "DOCUMENT":
      return { type: block.type, fileId: block.document?.id ?? 0 };
  }
};

// Social network key order (kept local to avoid a constants import cycle).
const SOCIAL_NETWORKS_KEYS: SocialNetwork[] = ["INSTAGRAM", "TELEGRAM", "TIKTOK", "X", "YOUTUBE", "FACEBOOK"];

export const newPartnerForm = (): PartnerFormValues => ({
  categoryId: null,
  name: "",
  logo: null,
  discountType: "PERCENT",
  discountValue: "",
  discountText: emptyMl(),
  condition: emptyMl(),
  phone: "",
  validUntil: null,
  sortOrder: "0",
  published: false,
  blocks: [createBlock("HEADING_1"), createBlock("PARAGRAPH")],
});

export const partnerToForm = (partner: Partner): PartnerFormValues => ({
  categoryId: partner.category.id,
  name: partner.name,
  logo: partner.logo ? { id: partner.logo.id, file: partner.logo } : null,
  discountType: partner.discount.type,
  discountValue: partner.discount.value === null ? "" : String(partner.discount.value),
  discountText: toMl(partner.discount.text),
  condition: toMl(partner.condition),
  phone: partner.phone,
  validUntil: partner.validUntil,
  sortOrder: String(partner.sortOrder),
  published: partner.published,
  blocks: partner.content.map(serverBlockToForm),
});

export interface PartnerRequest {
  categoryId: number;
  name: string;
  logoFileId: number | null;
  discount: Discount;
  condition: { uz: string; ru: string; tg: string | null } | null;
  phone: string;
  validUntil: string | null;
  sortOrder: number;
  published: boolean;
  blocks: ServerBlock[];
}

export const formToRequest = (values: PartnerFormValues): { sentKeys: string[]; request: PartnerRequest } => {
  const blocks = values.blocks.filter((b) => !isBlockEmpty(b));
  const isTextDiscount = values.discountType === "TEXT";
  return {
    sentKeys: blocks.map((b) => b.key),
    request: {
      categoryId: values.categoryId ?? 0,
      name: values.name.trim(),
      logoFileId: values.logo?.id ?? null,
      discount: {
        type: values.discountType,
        value: isTextDiscount ? null : Number(values.discountValue),
        text: isTextDiscount ? (trimMl(values.discountText) as Ml) : null,
      },
      condition: isMlEmpty(values.condition) ? null : trimMl(values.condition),
      phone: values.phone.trim(),
      validUntil: values.validUntil,
      sortOrder: Number(values.sortOrder || 0),
      published: values.published,
      blocks: blocks.map(formBlockToServer),
    },
  };
};

export { REQUIRED_LANGUAGES };
