// Companies domain types (recovered from usage in the build).
export interface Paginated<T> {
  elements: T[];
  totalElements: number;
  totalPage: number;
}

export interface Company {
  id: string;
  companyId: number;
  companyName: string;
  isPremium: boolean;
  brand: { id: number; name: string } | null;
  contractCount: number;
  userCount: number;
  updatedAt: string | null;
  insertAt: string;
}

export interface UnlinkedCompany {
  companyId: number;
  contractCount: number;
  userCount: number;
}

export interface UysotCompany {
  companyId: number;
  name: string;
  linked: boolean;
}

export interface CompanyListFilters {
  search?: string;
  isPremium?: boolean;
  page: number;
  size: number;
}

export interface CreateCompanyPayload {
  companyId: number;
  companyName: string;
  isPremium: boolean;
}

export interface UpdateCompanyPayload {
  id: string;
  companyName: string;
}
