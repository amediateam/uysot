import { http } from "@/services/http";
import { isApiError } from "@/services/api-error";
import { readAsDataUrl } from "@/utils/read-as-data-url";
import type { PartnerRequest } from "@/services/partners/format";
import type {
  Ml,
  Partner,
  PartnerCategory,
  PartnerCountFilters,
  PartnerCounts,
  PartnerFile,
  PartnerList,
  PartnerListFilters,
  UploadKind,
} from "@/services/partners/types";

const cleanParams = <T extends object>(params: T): Partial<T> =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "")) as Partial<T>;

// --- categories -------------------------------------------------------------
export const listCategories = async (): Promise<PartnerCategory[]> => {
  const { data } = await http.get<PartnerCategory[]>("/partner-categories");
  return data;
};

export const saveCategory = async ({
  id,
  ...rest
}: {
  id: number | null;
  name: { uz: string; ru: string; tg: string | null };
  sortOrder: number;
}): Promise<PartnerCategory> => {
  const { data } =
    id === null
      ? await http.post<PartnerCategory>("/partner-categories", rest)
      : await http.put<PartnerCategory>(`/partner-categories/${id}`, rest);
  return data;
};

export const reorderCategories = async (
  items: { id: number; name: Ml; sortOrder: number }[],
): Promise<void> => {
  await Promise.all(items.map(({ id, name, sortOrder }) => http.put(`/partner-categories/${id}`, { name, sortOrder })));
};

export const deleteCategory = async (id: number): Promise<void> => {
  await http.delete(`/partner-categories/${id}`);
};

// --- partners ---------------------------------------------------------------
export const listPartners = async (filters: PartnerListFilters): Promise<PartnerList> => {
  const { data } = await http.get<PartnerList>("/partners", { params: cleanParams(filters) });
  return data;
};

export const getPartnerCounts = async (filters: PartnerCountFilters): Promise<PartnerCounts> => {
  const { data } = await http.get<PartnerCounts>("/partners/counts", { params: cleanParams(filters) });
  return data;
};

export const getPartner = async (id: number): Promise<Partner> => {
  const { data } = await http.get<Partner>(`/partners/${id}`);
  return data;
};

export const savePartner = async ({ id, request }: { id: number | null; request: PartnerRequest }): Promise<Partner> => {
  const { data } =
    id === null ? await http.post<Partner>("/partners", request) : await http.put<Partner>(`/partners/${id}`, request);
  return data;
};

export const deletePartner = async (id: number): Promise<number> => {
  await http.delete(`/partners/${id}`);
  return id;
};

export const setPartnerPublished = async ({ id, publish }: { id: number; publish: boolean }): Promise<Partner> => {
  const { data } = await http.post<Partner>(`/partners/${id}/${publish ? "publish" : "unpublish"}`);
  return data;
};

// --- files ------------------------------------------------------------------
export const uploadPartnerFile = async ({
  file,
  kind,
  onProgress,
}: {
  file: Blob;
  kind: UploadKind;
  onProgress?: (percent: number) => void;
}): Promise<PartnerFile> => {
  const body = new FormData();
  body.append("file", file);
  body.append("kind", kind);
  const { data } = await http.post<PartnerFile>("/partners/files", body, {
    headers: { "Content-Type": null },
    onUploadProgress: (event) => {
      if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100));
    },
  });
  return data;
};

export const getPartnerFile = async (id: number): Promise<string | null> => {
  try {
    const { data } = await http.get<Blob>(`/partners/files/${id}`, { responseType: "blob" });
    return await readAsDataUrl(data);
  } catch (error) {
    if (isApiError(error) && error.status === 404) return null;
    throw error;
  }
};
