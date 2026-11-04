import { createQueryKeys } from "@lukemorales/query-key-factory";

export const authQueryKeys = createQueryKeys("auth", {
  user: (params: { accessToken: string | null }) => [params],
  refresh: () => [""],
});
