import { BLOCK_CATALOG, BLOCK_LIMITS, BLOCK_RANGES, LANGUAGES, LIMITS, REQUIRED_LANGUAGES } from "@/services/partners/constants";
import { isBlockEmpty, isMlEmpty, upper } from "@/services/partners/format";
import type { FileRef, FormBlock, Issue, Language, Ml, PartnerFormValues } from "@/services/partners/types";

const HTTP_URL_RE = /^https?:\/\/\S+$/i;
const tooLong = (max: number) => `Juda uzun — ${max} belgigacha`;
const NOT_HTTPS = "To‘liq havola kiriting: https://…";
const BAD_PHONE = "Telefon raqami noto‘g‘ri";
const FILE_GONE = "Fayl topilmadi — almashtiring";

const issue = (field: string, message: string): Issue => ({ field, lang: null, message });
const quietIssue = (field: string, message: string): Issue => ({ ...issue(field, message), quiet: true });

// Find a message for a field/lang (used by the editors to show inline errors).
export const findIssue = (
  issues: Issue[] | undefined,
  field: string,
  lang: Language,
  { includeQuiet = false }: { includeQuiet?: boolean } = {},
): string | null =>
  issues?.find(
    (i) => i.field === field && (i.lang === null || i.lang === lang) && (includeQuiet || !i.quiet),
  )?.message ?? null;

// Multilingual field validation: too-long per language + required (UZ/RU).
const validateMl = (field: string, value: Ml, max: number, required: boolean): Issue[] => {
  const result: Issue[] = [];
  for (const lang of LANGUAGES) {
    if (value[lang].trim().length > max) result.push({ field, lang, message: tooLong(max) });
  }
  if (required) {
    for (const lang of REQUIRED_LANGUAGES) {
      if (value[lang].trim()) continue;
      const other = REQUIRED_LANGUAGES.find((l) => l !== lang) ?? "uz";
      const hint = value[other].trim() ? ` — ${upper(other)} to‘ldirilgan` : "";
      result.push({ field, lang, message: `${upper(lang)} majburiy${hint}`, quiet: !hint });
    }
  }
  return result;
};

// Optional multilingual: only enforce once any language has content.
const validateOptionalMl = (field: string, value: Ml, max: number): Issue[] =>
  validateMl(field, value, max, !isMlEmpty(value));

const isValidUrl = (url: string) => HTTP_URL_RE.test(url.trim());

const isValidPhone = (phone: string): boolean => {
  const trimmed = phone.trim();
  if (!/^\+?[\d\s()-]+$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "").length;
  return digits >= 9 && digits <= 15;
};

const validateUrl = (field: string, url: string, required: boolean): Issue[] => {
  if (url.trim()) return isValidUrl(url) ? [] : [{ field, lang: null, message: NOT_HTTPS }];
  return required ? [{ field, lang: null, message: "Havola kiriting" }] : [];
};

const validateFile = (field: string, file: FileRef | null, missingMessage: string): Issue[] => {
  if (file) return file.file ? [] : [issue(field, FILE_GONE)];
  return [issue(field, missingMessage)];
};

const validateCoordinate = (field: string, value: string, bound: number): Issue[] => {
  if (!value.trim()) return [issue(field, "Xaritadagi nuqtani kiriting")];
  const num = Number(value);
  return Number.isFinite(num) && Math.abs(num) <= bound ? [] : [issue(field, "Xaritadagi nuqta noto‘g‘ri")];
};

const validateBlock = (block: FormBlock): Issue[] => {
  switch (block.type) {
    case "HEADING_1":
    case "PARAGRAPH":
    case "HEADING_2":
      return validateMl("text", block.text, BLOCK_LIMITS[block.type], true);
    case "BULLET_LIST": {
      const tooFew =
        block.items.filter((i) => !isMlEmpty(i)).length < BLOCK_RANGES.listMin
          ? [issue("items", `Kamida ${BLOCK_RANGES.listMin} ta band`)]
          : [];
      const items = block.items.flatMap((item, index) =>
        isMlEmpty(item) ? [] : validateMl(`items[${index}]`, item, BLOCK_LIMITS.listItem, true),
      );
      return [...tooFew, ...items];
    }
    case "LINK":
      return [...validateMl("label", block.label, BLOCK_LIMITS.linkLabel, true), ...validateUrl("url", block.url, true)];
    case "SOCIAL_LINKS": {
      const links = Object.entries(block.links).filter(([, url]) => url?.trim());
      if (links.length === 0) return [issue("links", "Kamida 1 ta havola")];
      return links.flatMap(([network, url]) => validateUrl(`links.${network}`, url ?? "", true));
    }
    case "BANNER":
      return [
        ...validateFile("imageFileId", block.image, "Rasm yuklang"),
        ...(block.badge.trim().length > BLOCK_LIMITS.bannerBadge ? [issue("badge", tooLong(BLOCK_LIMITS.bannerBadge))] : []),
        ...validateMl("caption", block.caption, BLOCK_LIMITS.bannerCaption, true),
      ];
    case "GALLERY": {
      const missing = block.images.some((i) => !i.file) ? [issue("imageFileIds", FILE_GONE)] : [];
      const tooFew =
        block.images.length < BLOCK_RANGES.galleryMin ? [issue("imageFileIds", `Kamida ${BLOCK_RANGES.galleryMin} ta surat`)] : [];
      return [...tooFew, ...missing];
    }
    case "ADDRESS":
      return [
        ...validateMl("text", block.text, BLOCK_LIMITS.address, true),
        ...validateCoordinate("latitude", block.latitude, 90),
        ...validateCoordinate("longitude", block.longitude, 180),
      ];
    case "CONTACTS":
      if (!block.phone.trim() && !block.website.trim()) return [issue("phone", "Telefon yoki saytdan kamida bittasi")];
      return [
        ...(block.phone.trim() && !isValidPhone(block.phone) ? [issue("phone", BAD_PHONE)] : []),
        ...validateUrl("website", block.website, false),
      ];
    case "WORKING_HOURS":
      return [
        ...validateMl("hours", block.hours, BLOCK_LIMITS.hours, true),
        ...validateOptionalMl("note", block.note, BLOCK_LIMITS.hoursNote),
      ];
    case "CALLOUT":
      return [
        ...validateMl("title", block.title, BLOCK_LIMITS.calloutTitle, true),
        ...validateMl("text", block.text, BLOCK_LIMITS.calloutText, true),
      ];
    case "DOCUMENT":
      return validateFile("fileId", block.document, "PDF yuklang");
  }
};

const validateDiscount = (values: PartnerFormValues): Issue[] => {
  if (values.discountType === "TEXT") return validateMl("discountText", values.discountText, LIMITS.discountText, true);
  const value = Number(values.discountValue);
  if (!values.discountValue || value <= 0) return [quietIssue("discountValue", "Chegirma qiymatini kiriting")];
  if (values.discountType === "PERCENT" && value > LIMITS.percentMax) return [issue("discountValue", "Foiz 1 dan 100 gacha")];
  return [];
};

const validateHeader = (values: PartnerFormValues): Issue[] => [
  ...(values.categoryId === null ? [quietIssue("categoryId", "Kategoriyani tanlang")] : []),
  ...(values.name.trim() ? [] : [quietIssue("name", "Nomini kiriting")]),
  ...(values.name.trim().length > LIMITS.name ? [issue("name", tooLong(LIMITS.name))] : []),
  ...validateDiscount(values),
  ...validateOptionalMl("condition", values.condition, LIMITS.condition),
  ...(values.phone.trim()
    ? isValidPhone(values.phone)
      ? []
      : [issue("phone", BAD_PHONE)]
    : [quietIssue("phone", "Telefon raqamini kiriting")]),
  ...(values.sortOrder !== "" && !/^\d+$/.test(values.sortOrder) ? [issue("sortOrder", "0 yoki undan katta butun son")] : []),
];

const FIELD_LABELS: Record<string, string> = {
  categoryId: "Kategoriya",
  name: "Nomi",
  discountValue: "Chegirma qiymati",
  discountText: "Chegirma matni",
  condition: "Shart",
  phone: "Telefon",
  sortOrder: "Ilovadagi tartib",
};
const issueSummary = (issue: Issue, label: string) => (issue.lang ? `${label} — ${upper(issue.lang)} matni` : label);

export interface Validation {
  headerIssues: Issue[];
  blockIssues: Record<string, Issue[]>;
  missing: string[];
  isValid: boolean;
}

export const validatePartner = (values: PartnerFormValues): Validation => {
  const headerIssues = validateHeader(values);
  const blockIssues: Record<string, Issue[]> = {};
  const missingList = headerIssues.map((i) => issueSummary(i, FIELD_LABELS[i.field] ?? i.field));
  const seen = new Set<string>();

  values.blocks.forEach((block, index) => {
    if (isBlockEmpty(block)) return;
    const issues = validateBlock(block);
    const meta = BLOCK_CATALOG[block.type];
    if (meta.once && seen.has(block.type)) issues.push(issue("type", "Tavsifda faqat bitta bo‘ladi"));
    seen.add(block.type);
    if (issues.length > 0) {
      blockIssues[block.key] = issues;
      missingList.push(`Tavsif — ${index + 1} · ${meta.label}`);
    }
  });

  if (values.blocks.filter((b) => !isBlockEmpty(b)).length > LIMITS.maxBlocks) {
    missingList.push(`Tavsifda ${LIMITS.maxBlocks} tadan ko‘p blok`);
  }

  const missing = [...new Set(missingList)];
  return { headerIssues, blockIssues, missing, isValid: missing.length === 0 };
};
