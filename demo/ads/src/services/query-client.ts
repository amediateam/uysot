import { QueryClient } from "@tanstack/react-query";
import { message } from "antd";
import type { AxiosError } from "axios";

// Global API error toast (recovered from the build): shows the localized (uz) message
// from the error envelope, or a generic fallback.
export const showApiError = (error: unknown): void => {
  const response = (error as AxiosError<{ message?: Record<string, string> }>)?.response;
  if (response?.status === 401) {
    message.error(response?.data?.message?.uz);
  }
  if (response?.data?.message && Object.keys(response.data.message).length > 0) {
    message.error(response.data.message.uz);
  } else {
    message.error("Xatolik mavjud");
  }
};

// Shared react-query client (recovered from the build).
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      // The original passed the handler as throwOnError; it reports the error and never throws.
      throwOnError: (error) => {
        showApiError(error);
        return false;
      },
    },
    mutations: {
      onError: showApiError,
    },
  },
});
