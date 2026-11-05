import { http } from "@/services/http";
import type {
  Company,
  CompanyListFilters,
  CreateCompanyPayload,
  Paginated,
  UnlinkedCompany,
  UpdateCompanyPayload,
  UysotCompany,
} from "@/services/companies/types";

// Drops undefined / empty-string params so they don't appear in the query string.
const cleanParams = <T extends object>(params: T): Partial<T> =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "")) as Partial<T>;

const UYSOT_PAGE_SIZE = 50;

// Companies API (recovered from the build).
export const listCompanies = async (filters: CompanyListFilters): Promise<Paginated<Company>> => {
  const { data } = await http.get<Paginated<Company>>("/companies", { params: cleanParams(filters) });
  return data;
};

export const createCompany = async (payload: CreateCompanyPayload): Promise<Company> => {
  const { data } = await http.post<Company>("/companies", payload);
  return data;
};

export const updateCompany = async ({ id, ...rest }: UpdateCompanyPayload): Promise<Company> => {
  const { data } = await http.patch<Company>(`/companies/${id}`, rest);
  return data;
};

export const toggleCompanyPremium = async ({
  id,
  isPremium,
}: {
  id: string;
  isPremium: boolean;
}): Promise<Company> => {
  const { data } = await http.post<Company>(`/companies/${id}/premium`, { isPremium });
  return data;
};

export const listUnlinkedCompanies = async (): Promise<UnlinkedCompany[]> => {
  const { data } = await http.get<UnlinkedCompany[]>("/companies/unlinked");
  return data;
};

export const listUysotCompanies = async (page: number): Promise<Paginated<UysotCompany>> => {
  const { data } = await http.get<Paginated<UysotCompany>>("/companies/uysot", {
    params: { page, size: UYSOT_PAGE_SIZE },
  });
  return data;
};
