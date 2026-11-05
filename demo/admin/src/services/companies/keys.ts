import type { CompanyListFilters } from "@/services/companies/types";

// Companies query keys (recovered from the build).
export const companyKeys = {
  all: ["companies"] as const,
  list: (filters: CompanyListFilters) => [...companyKeys.all, "list", filters] as const,
  unlinked: () => [...companyKeys.all, "unlinked"] as const,
  uysot: () => [...companyKeys.all, "uysot"] as const,
  detail: (id: string) => [...companyKeys.all, "detail", id] as const,
};
