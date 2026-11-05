import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createCompany,
  listCompanies,
  listUnlinkedCompanies,
  listUysotCompanies,
  toggleCompanyPremium,
  updateCompany,
} from "@/services/companies/api";
import { companyKeys } from "@/services/companies/keys";
import type { Company, CompanyListFilters } from "@/services/companies/types";

// Companies data hooks (recovered from the build).
export const useCompaniesQuery = (filters: CompanyListFilters) =>
  useQuery({
    queryKey: companyKeys.list(filters),
    queryFn: () => listCompanies(filters),
    placeholderData: keepPreviousData,
  });

export const useUnlinkedCompaniesQuery = () =>
  useQuery({ queryKey: companyKeys.unlinked(), queryFn: listUnlinkedCompanies });

// Infinite list of Uysot companies for the company picker.
export const useUysotCompaniesInfinite = (enabled: boolean) =>
  useInfiniteQuery({
    queryKey: companyKeys.uysot(),
    queryFn: ({ pageParam }) => listUysotCompanies(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      pages.length < lastPage.totalPage ? pages.length : undefined,
    enabled,
  });

const onCompanyMutated = (queryClient: ReturnType<typeof useQueryClient>) => (company: Company) => {
  queryClient.setQueryData(companyKeys.detail(company.id), company);
  queryClient.invalidateQueries({ queryKey: companyKeys.all });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: createCompany, onSuccess: onCompanyMutated(queryClient) });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: updateCompany, onSuccess: onCompanyMutated(queryClient) });
};

export const useToggleCompanyPremium = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: toggleCompanyPremium, onSuccess: onCompanyMutated(queryClient) });
};
