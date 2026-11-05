import type { BrandListFilters } from "@/services/brands/types";

// Brands query keys (recovered from the build).
export const brandKeys = {
  all: ["brands"] as const,
  list: (filters: BrandListFilters) => [...brandKeys.all, "list", filters] as const,
  detail: (id: number) => [...brandKeys.all, "detail", id] as const,
  logo: (id: number) => [...brandKeys.all, "logo", id] as const,
};
