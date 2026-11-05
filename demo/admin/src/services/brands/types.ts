import type { Company, Paginated } from "@/services/companies/types";

// Brands domain types (recovered from usage in the build).
export interface Brand {
  id: number;
  name: string;
  companies: Company[];
  contractCount: number;
  userCount: number;
  // Legacy logo URL; `logoFile` marks logos uploaded through this panel (removable).
  logo?: string | null;
  logoFile?: boolean;
}

export interface BrandListFilters {
  search?: string;
  page: number;
  size: number;
}

export type BrandList = Paginated<Brand>;

export interface CreateBrandPayload {
  name: string;
}

export interface UpdateBrandPayload {
  id: number;
  name: string;
}
