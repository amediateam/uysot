import type { PartnerCountFilters, PartnerListFilters } from "@/services/partners/types";

// Partners query keys (recovered from the build).
export const partnerKeys = {
  all: ["partners"] as const,
  lists: () => [...partnerKeys.all, "list"] as const,
  list: (filters: PartnerListFilters) => [...partnerKeys.lists(), filters] as const,
  countsAll: () => [...partnerKeys.all, "counts"] as const,
  counts: (filters: PartnerCountFilters) => [...partnerKeys.countsAll(), filters] as const,
  detail: (id: number) => [...partnerKeys.all, "detail", id] as const,
  upload: ["partners", "upload"] as const,
  categories: ["partner-categories"] as const,
  file: (id: number) => ["partner-files", id] as const,
};
