import { App } from "antd";
import { isApiError } from "@/services/api-error";

const FALLBACK_ERROR = "Kutilmagan xatolik. Qayta urinib ko‘ring.";

// Toast helper (recovered from the build): success/error messages, mapping ApiError to its
// localized message. Relies on antd's <App> context (mounted in ThemeProvider).
export const useApiMessage = () => {
  const { message } = App.useApp();
  return {
    success: (text: string) => message.success(text),
    error: (error: unknown) => message.error(isApiError(error) ? error.message : FALLBACK_ERROR),
    errorText: (text: string) => message.error(text),
  };
};
