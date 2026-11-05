import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  attachCompanies,
  createBrand,
  deleteBrand,
  deleteBrandLogo,
  detachCompany,
  getBrand,
  getBrandLogo,
  listBrands,
  updateBrand,
  uploadBrandLogo,
} from "@/services/brands/api";
import { brandKeys } from "@/services/brands/keys";
import { companyKeys } from "@/services/companies/keys";
import type { Brand, BrandListFilters } from "@/services/brands/types";

// Keeps brand caches in sync after a mutation that returns the updated brand.
const useBrandSync = () => {
  const queryClient = useQueryClient();
  return {
    queryClient,
    syncBrand: (brand: Brand) => {
      queryClient.setQueryData(brandKeys.detail(brand.id), brand);
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  };
};

export const useBrandsQuery = (filters: BrandListFilters) =>
  useQuery({
    queryKey: brandKeys.list(filters),
    queryFn: () => listBrands(filters),
    placeholderData: keepPreviousData,
  });

export const useBrandQuery = (id: number) =>
  useQuery({ queryKey: brandKeys.detail(id), queryFn: () => getBrand(id), enabled: Number.isFinite(id) });

export const useCreateBrand = () => {
  const { syncBrand } = useBrandSync();
  return useMutation({ mutationFn: createBrand, onSuccess: syncBrand });
};

export const useUpdateBrand = () => {
  const { syncBrand } = useBrandSync();
  return useMutation({ mutationFn: updateBrand, onSuccess: syncBrand });
};

export const useDeleteBrand = () => {
  const { queryClient } = useBrandSync();
  return useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
};

export const useAttachCompanies = (brandId: number) => {
  const { syncBrand } = useBrandSync();
  return useMutation({
    mutationFn: (payload: { companyIds: string[] }) => attachCompanies(brandId, payload),
    onSuccess: syncBrand,
  });
};

export const useDetachCompany = (brandId: number) => {
  const { syncBrand } = useBrandSync();
  return useMutation({
    mutationFn: (companyId: string) => detachCompany(brandId, companyId),
    onSuccess: syncBrand,
  });
};

export const useBrandLogoQuery = (id: number, enabled: boolean) =>
  useQuery({
    queryKey: brandKeys.logo(id),
    queryFn: () => getBrandLogo(id),
    enabled: Number.isFinite(id) && enabled,
    staleTime: Infinity,
  });

export const useUploadBrandLogo = () => {
  const { queryClient, syncBrand } = useBrandSync();
  return useMutation({
    mutationFn: uploadBrandLogo,
    onSuccess: (brand) => {
      syncBrand(brand);
      queryClient.invalidateQueries({ queryKey: brandKeys.logo(brand.id) });
    },
  });
};

export const useDeleteBrandLogo = () => {
  const { queryClient, syncBrand } = useBrandSync();
  return useMutation({
    mutationFn: deleteBrandLogo,
    onSuccess: (brand) => {
      syncBrand(brand);
      queryClient.invalidateQueries({ queryKey: brandKeys.logo(brand.id) });
    },
  });
};

// Resolves a brand's logo source: fetched data URL for uploaded logos, else the legacy URL.
const trimOrNull = (value: string | null | undefined) => value?.trim() || null;

export const useBrandLogo = (brand: Brand | null): { src: string | null; isLoading: boolean } => {
  const hasUploadedFile = !!brand?.logoFile;
  const { data, isLoading } = useBrandLogoQuery(brand?.id ?? NaN, hasUploadedFile);
  if (hasUploadedFile) {
    return { src: data ?? null, isLoading };
  }
  return { src: brand?.logoFile ? null : trimOrNull(brand?.logo), isLoading: false };
};
