import { ApiErrorCode } from "@/constants/api-error-codes";
import { isApiError } from "@/services/api-error";

// Server-side content reason codes → messages (recovered from the build).
const REASON_MESSAGES: Record<string, string> = {
  REQUIRED: "To‘ldirilishi shart (UZ va RU)",
  TOO_LONG: "Juda uzun",
  TOO_MANY: "Juda ko‘p",
  TOO_FEW: "Juda kam",
  DUPLICATE: "Takrorlangan",
  INVALID_URL: "To‘liq havola kiriting: https://…",
  INVALID_PHONE: "Telefon raqami noto‘g‘ri",
  OUT_OF_RANGE: "Xaritadagi nuqta noto‘g‘ri",
};

export type ServerIssue =
  | { kind: "general"; message: string }
  | { kind: "field"; field: string; message: string }
  | { kind: "block"; blockKey: string; field: string; message: string };

const readNumber = (details: Record<string, unknown> | null | undefined, key: string): number | null => {
  const value = details?.[key];
  return typeof value === "number" ? value : null;
};
const readString = (details: Record<string, unknown> | null | undefined, key: string): string | null => {
  const value = details?.[key];
  return typeof value === "string" ? value : null;
};

const VALIDATION_FIELDS = ["categoryId", "discount", "phone", "name", "logo"];

// Maps a save error onto the partner form. Returns null when the partner is simply gone
// (caller refreshes the list and closes).
export const mapPartnerSaveError = (
  error: unknown,
  sentKeys: string[],
  logoFileId: number | null,
): ServerIssue | null => {
  if (!isApiError(error)) return { kind: "general", message: "Kutilmagan xatolik. Qayta urinib ko‘ring." };
  const { code, details, message } = error;
  switch (code) {
    case ApiErrorCode.PARTNER_NOT_FOUND:
      return null;
    case ApiErrorCode.PARTNER_CATEGORY_NOT_FOUND:
      return { kind: "field", field: "categoryId", message: "Hamkor kategoriyasi topilmadi" };
    case ApiErrorCode.PARTNER_DISCOUNT_INVALID:
      return { kind: "field", field: "discount", message: "Chegirma noto‘g‘ri kiritilgan" };
    case ApiErrorCode.PARTNER_CONTENT_INVALID: {
      const blockIndex = readNumber(details, "blockIndex");
      const blockKey = blockIndex === null ? undefined : sentKeys[blockIndex];
      const reason = REASON_MESSAGES[readString(details, "reason") ?? ""] ?? message;
      if (blockKey) {
        return { kind: "block", blockKey, field: readString(details, "field") ?? "", message: reason };
      }
      return { kind: "general", message: `Tavsifda xato bor — ${reason.toLowerCase()}` };
    }
    case ApiErrorCode.PARTNER_FILE_NOT_FOUND:
    case ApiErrorCode.PARTNER_FILE_TYPE_MISMATCH: {
      const fileId = readNumber(details, "fileId");
      if (fileId !== null && fileId === logoFileId) {
        return { kind: "field", field: "logo", message: "Fayl topilmadi — almashtiring" };
      }
      return { kind: "general", message };
    }
    case ApiErrorCode.VALIDATION_ERROR: {
      const field = VALIDATION_FIELDS.find((f) => error.fields?.[f]);
      if (field) return { kind: "field", field, message: error.fields?.[field] ?? message };
      return { kind: "general", message };
    }
    default:
      return { kind: "general", message };
  }
};

// Upload error → message (recovered from the build).
export const uploadErrorMessage = (error: unknown, kind: "IMAGE" | "PDF"): string => {
  if (isApiError(error) && error.code === ApiErrorCode.PARTNER_FILE_TYPE_MISMATCH) {
    return kind === "PDF" ? "Fayl turi mos emas — PDF kerak" : "Fayl turi mos emas — rasm kerak";
  }
  if (isApiError(error)) return error.message;
  return "Faylni yuklab bo‘lmadi. Qayta urinib ko‘ring.";
};
