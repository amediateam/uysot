import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiErrorCode } from "@/constants/api-error-codes";
import { isApiError } from "@/services/api-error";
import { readAsDataUrl } from "@/utils/read-as-data-url";
import {
  deleteCategory,
  deletePartner,
  getPartner,
  getPartnerCounts,
  getPartnerFile,
  listCategories,
  listPartners,
  reorderCategories,
  saveCategory,
  savePartner,
  setPartnerPublished,
  uploadPartnerFile,
} from "@/services/partners/api";
import { partnerKeys } from "@/services/partners/keys";
import type { Partner, PartnerCountFilters, PartnerListFilters } from "@/services/partners/types";

// Invalidates categories + lists (used after category writes).
const useRefreshCategories = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: partnerKeys.categories }),
      queryClient.invalidateQueries({ queryKey: partnerKeys.lists() }),
    ]);
};

export const useCategories = () => useQuery({ queryKey: partnerKeys.categories, queryFn: listCategories });

export const useSaveCategory = () => {
  const refresh = useRefreshCategories();
  return useMutation({ mutationFn: saveCategory, onSuccess: refresh });
};

export const useReorderCategories = () => {
  const refresh = useRefreshCategories();
  return useMutation({ mutationFn: reorderCategories, onSettled: refresh });
};

export const useDeleteCategory = () => {
  const refresh = useRefreshCategories();
  return useMutation({ mutationFn: deleteCategory, onSuccess: refresh });
};

// Partner cache helpers.
const usePartnerCache = () => {
  const queryClient = useQueryClient();
  const refreshLists = () => {
    queryClient.invalidateQueries({ queryKey: partnerKeys.lists() });
    queryClient.invalidateQueries({ queryKey: partnerKeys.countsAll() });
    queryClient.invalidateQueries({ queryKey: partnerKeys.categories });
  };
  return {
    queryClient,
    refreshLists,
    syncPartner: (partner: Partner) => {
      queryClient.setQueryData(partnerKeys.detail(partner.id), partner);
      refreshLists();
    },
  };
};

export const usePartnersQuery = (filters: PartnerListFilters) =>
  useQuery({
    queryKey: partnerKeys.list(filters),
    queryFn: () => listPartners(filters),
    placeholderData: keepPreviousData,
  });

export const usePartnerCounts = (filters: PartnerCountFilters) =>
  useQuery({
    queryKey: partnerKeys.counts(filters),
    queryFn: () => getPartnerCounts(filters),
    placeholderData: keepPreviousData,
  });

export const usePartner = (id: number | null) =>
  useQuery({
    queryKey: partnerKeys.detail(id ?? NaN),
    queryFn: () => getPartner(id ?? NaN),
    enabled: id !== null,
    staleTime: 0,
    refetchOnMount: "always",
  });

export const useDeletePartner = () => {
  const { queryClient, refreshLists } = usePartnerCache();
  return useMutation({
    mutationFn: deletePartner,
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: partnerKeys.detail(id) });
      refreshLists();
    },
    onError: (error) => {
      if (isApiError(error) && error.code === ApiErrorCode.PARTNER_NOT_FOUND) refreshLists();
    },
  });
};

export const useSetPartnerPublished = () => {
  const { syncPartner, refreshLists } = usePartnerCache();
  return useMutation({
    mutationFn: setPartnerPublished,
    onSuccess: syncPartner,
    onError: (error) => {
      if (isApiError(error) && error.code === ApiErrorCode.PARTNER_NOT_FOUND) refreshLists();
    },
  });
};

export const useSavePartner = () => {
  const { syncPartner, refreshLists } = usePartnerCache();
  return useMutation({
    mutationFn: savePartner,
    onSuccess: syncPartner,
    onError: (error) => {
      if (
        isApiError(error) &&
        (error.code === ApiErrorCode.PARTNER_NOT_FOUND || error.code === ApiErrorCode.PARTNER_CATEGORY_NOT_FOUND)
      ) {
        refreshLists();
      }
    },
  });
};

export const useUploadPartnerFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: partnerKeys.upload,
    mutationFn: uploadPartnerFile,
    onSuccess: async (file, { file: raw, kind }) => {
      if (kind !== "IMAGE") return;
      const dataUrl = await readAsDataUrl(raw).catch(() => null);
      if (dataUrl) queryClient.setQueryData(partnerKeys.file(file.id), dataUrl);
    },
  });
};

// Partner file as a data URL (logo / banner / gallery / document previews).
export const usePartnerFileImage = (fileId: number | null | undefined) =>
  useQuery({
    queryKey: partnerKeys.file(typeof fileId === "number" ? fileId : NaN),
    queryFn: () => getPartnerFile(fileId as number),
    enabled: typeof fileId === "number" && Number.isFinite(fileId),
    staleTime: Infinity,
    retry: false,
  });
