import { AxiosError } from "axios";
import { ApiErrorCode } from "@/constants/api-error-codes";

// Normalized API error shape (recovered from the build). The backend wraps failures in
// `{ error: { code, message: { uz }, details } }`; this flattens them into one object.
export interface ApiError {
  status: number;
  code: number;
  message: string;
  details: Record<string, unknown> | null;
  fields: Record<string, string> | null;
  retryAfterSeconds: number | null;
  providerStatus: number | null;
  providerMessage: string | null;
}

const NETWORK_ERROR_MESSAGE = "Server javob bermadi. Ulanishni tekshiring.";
const DEFAULT_ERROR_MESSAGE = "Kutilmagan xatolik. Qayta urinib ko‘ring.";

const EMPTY_DETAILS = {
  details: null,
  fields: null,
  retryAfterSeconds: null,
  providerStatus: null,
  providerMessage: null,
} satisfies Pick<
  ApiError,
  "details" | "fields" | "retryAfterSeconds" | "providerStatus" | "providerMessage"
>;

const readString = (details: Record<string, unknown> | null | undefined, key: string): string | null => {
  const value = details?.[key];
  return typeof value === "string" ? value : null;
};

const readNumber = (details: Record<string, unknown> | null | undefined, key: string): number | null => {
  const value = details?.[key];
  return typeof value === "number" ? value : null;
};

const readFields = (details: Record<string, unknown> | null | undefined): Record<string, string> | null => {
  const fields = details?.fields;
  if (!fields || typeof fields !== "object") return null;
  const entries = Object.entries(fields).filter(([, v]) => typeof v === "string") as [string, string][];
  return entries.length > 0 ? Object.fromEntries(entries) : null;
};

// Convert any thrown value into the normalized ApiError.
export const toApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return { ...EMPTY_DETAILS, status: 0, code: 0, message: NETWORK_ERROR_MESSAGE };
    }
    const data = error.response.data as
      | { error?: { code?: number; message?: { uz?: string }; details?: Record<string, unknown> }; message?: string }
      | undefined;
    const apiError = data?.error;
    const details = apiError?.details ?? null;
    return {
      status: error.response.status,
      code: apiError?.code ?? 0,
      message: apiError?.message?.uz ?? data?.message ?? error.message ?? DEFAULT_ERROR_MESSAGE,
      details,
      fields: readFields(details),
      retryAfterSeconds: readNumber(details, "retryAfterSeconds"),
      providerStatus: readNumber(details, "providerStatus"),
      providerMessage: readString(details, "providerMessage"),
    };
  }
  if (error instanceof Error) {
    return { ...EMPTY_DETAILS, status: 0, code: 0, message: error.message };
  }
  return { ...EMPTY_DETAILS, status: 0, code: 0, message: DEFAULT_ERROR_MESSAGE };
};

export const isApiError = (error: unknown): error is ApiError =>
  typeof error === "object" && !!error && "status" in error && "code" in error && "message" in error;

export const isAccessDenied = (error: unknown): boolean =>
  isApiError(error) && error.code === ApiErrorCode.ACCESS_DENIED;
