import queryString from "query-string";
import { http } from "@/services/http";
import type {
  BannerCategory,
  BannerDetail,
  BannerListQuery,
  BannerRow,
  Language,
  Paginated,
  StatPoint,
  StatisticsQuery,
  UploadedFile,
} from "@/services/banners/types";

// Banner categories ("Reklama to'plamlari") --------------------------------
export const listCategories = async (): Promise<BannerCategory[]> => {
  const { data } = await http.get<{ data: BannerCategory[] }>("/api/dev/banner-category/view");
  return data.data;
};

export const saveCategory = async (payload: { id?: number; name: string }): Promise<unknown> => {
  if (payload.id) {
    const { data } = await http.put("/api/dev/banner-category/update", payload);
    return data;
  }
  const { data } = await http.post("/api/dev/banner-category/create", payload);
  return data;
};

export const deleteCategory = async (id: number): Promise<unknown> => {
  const { data } = await http.delete(`/api/dev/banner-category/delete?id=${id}`);
  return data;
};

// Banners -------------------------------------------------------------------
export const listBanners = async (query: BannerListQuery): Promise<Paginated<BannerRow>> => {
  const qs = queryString.stringifyUrl({ query: { ...query }, url: "" });
  const { data } = await http.get<Paginated<BannerRow>>(`/api/dev/banner/view${qs}`);
  return data;
};

export const getBanner = async (id: number): Promise<BannerDetail> => {
  const { data } = await http.get<{ data: BannerDetail }>(`/api/dev/banner/view?id=${id}`);
  return data.data;
};

export const saveBanner = async ({
  action,
  formData,
}: {
  action: "create" | "update";
  id?: number;
  banner_category_id: number;
  formData: FormData;
}): Promise<unknown> => {
  const url = action === "update" ? "/api/dev/banner/update" : "/api/dev/banner/create";
  const { data } = await http.post<{ data: unknown }>(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

// Files / languages / statistics --------------------------------------------
export const uploadImage = async (formData: FormData): Promise<UploadedFile> => {
  const { data } = await http.post<{ data: UploadedFile }>("/api/dev/image/upload", formData);
  return data.data;
};

export const listLanguages = async (): Promise<Language[]> => {
  const { data } = await http.get<{ data: Language[] }>("/api/dev/language/select");
  return data.data;
};

export const getStatistics = async (query: StatisticsQuery): Promise<StatPoint[]> => {
  const qs = queryString.stringifyUrl({ query: { ...query }, url: "" });
  const { data } = await http.get<{ data: StatPoint[] }>(`/api/dev/statistic/view${qs}`);
  return data.data;
};
