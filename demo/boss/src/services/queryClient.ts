import { QueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { AxiosError } from "axios";
import { ZodError } from "zod";
import { errorResponseSchema } from "./errorSchema";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
    mutations: {
      onError(error) {
        if (error instanceof ZodError) {
          console.error(error.message);
        } else if (error instanceof AxiosError) {
          const parsed = errorResponseSchema.parse(error.response?.data);
          message.error(parsed.message);
        }
      },
    },
  },
});
