import { QueryClient } from "@tanstack/react-query";
import { isApiError } from "@/services/api-error";

const STALE_TIME = 60_000;

// Shared react-query client (recovered from the build). 4xx responses are not retried;
// other failures get one retry. Window-focus refetch is off.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: 5 * STALE_TIME,
      retry: (failureCount, error) => {
        if (isApiError(error) && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
