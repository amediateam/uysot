import { message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/query-keys";
import {
  deleteCategory,
  getBanner,
  getStatistics,
  listBanners,
  listCategories,
  listLanguages,
  saveBanner,
  saveCategory,
  uploadImage,
} from "@/services/banners/api";
import type {
  BannerListQuery,
  Language,
  StatisticsQuery,
} from "@/services/banners/types";

// Categories ----------------------------------------------------------------
export const useBannerCategories = () =>
  useQuery({ queryKey: [QueryKeys.BANNER_CATEGORY_VIEW], queryFn: listCategories });

export const useSaveBannerCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.BANNER_CATEGORY_VIEW] }),
  });
};

export const useDeleteBannerCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.BANNER_CATEGORY_VIEW] }),
  });
};

// Banners -------------------------------------------------------------------
export const useBanners = (query: BannerListQuery) =>
  useQuery({ queryKey: [QueryKeys.BANNER_VIEW, query], queryFn: () => listBanners(query) });

export const useBanner = (id: number | undefined) =>
  useQuery({
    queryKey: [QueryKeys.BANNER_VIEW, id],
    queryFn: () => getBanner(id as number),
    enabled: !!id,
  });

// Save banner (create/update). On success invalidates the matching list and closes the modal.
export const useSaveBanner = ({
  bannerListQuery,
  onDone,
}: {
  bannerListQuery: { page?: number | null; size?: number };
  onDone: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveBanner,
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.BANNER_VIEW, { banner_category_id: variables.banner_category_id, ...bannerListQuery }],
      });
      onDone();
      message.success("Muvaffaqiyatli");
    },
  });
};

// Files / languages / statistics --------------------------------------------
export const useUploadImage = () => useMutation({ mutationFn: uploadImage });

export const useLanguages = (options?: { select?: (languages: Language[]) => void }) =>
  useQuery({
    queryKey: ["languages"],
    queryFn: listLanguages,
    select: options?.select
      ? (languages) => {
          options.select?.(languages);
          return languages;
        }
      : undefined,
  });

export const useStatistics = (query: StatisticsQuery) =>
  useQuery({
    queryKey: [QueryKeys.STATISTIC_VIEW, query],
    queryFn: () => getStatistics(query),
    enabled: !!query.banner_id,
  });
