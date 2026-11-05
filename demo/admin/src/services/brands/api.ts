import { http } from "@/services/http";
import { isApiError } from "@/services/api-error";
import { readAsDataUrl } from "@/utils/read-as-data-url";
import type {
  Brand,
  BrandList,
  BrandListFilters,
  CreateBrandPayload,
  UpdateBrandPayload,
} from "@/services/brands/types";

const cleanParams = <T extends object>(params: T): Partial<T> =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "")) as Partial<T>;

// Brands API (recovered from the build).
export const listBrands = async (filters: BrandListFilters): Promise<BrandList> => {
  const { data } = await http.get<BrandList>("/brands", { params: cleanParams(filters) });
  return data;
};

export const getBrand = async (id: number): Promise<Brand> => {
  const { data } = await http.get<Brand>(`/brands/${id}`);
  return data;
};

export const createBrand = async (payload: CreateBrandPayload): Promise<Brand> => {
  const { data } = await http.post<Brand>("/brands", payload);
  return data;
};

export const updateBrand = async ({ id, ...rest }: UpdateBrandPayload): Promise<Brand> => {
  const { data } = await http.patch<Brand>(`/brands/${id}`, rest);
  return data;
};

export const deleteBrand = async (id: number): Promise<void> => {
  const { data } = await http.delete<void>(`/brands/${id}`);
  return data;
};

export const attachCompanies = async (brandId: number, payload: { companyIds: string[] }): Promise<Brand> => {
  const { data } = await http.post<Brand>(`/brands/${brandId}/companies`, payload);
  return data;
};

export const detachCompany = async (brandId: number, companyId: string): Promise<Brand> => {
  const { data } = await http.delete<Brand>(`/brands/${brandId}/companies/${companyId}`);
  return data;
};

// Returns the brand logo as a data: URL, or null when there's none (404).
export const getBrandLogo = async (id: number): Promise<string | null> => {
  try {
    const { data } = await http.get<Blob>(`/brands/${id}/logo`, { responseType: "blob" });
    return await readAsDataUrl(data);
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const uploadBrandLogo = async ({ id, file }: { id: number; file: File }): Promise<Brand> => {
  const body = new FormData();
  body.append("file", file);
  // Let the browser set the multipart boundary by clearing the default JSON type.
  const { data } = await http.post<Brand>(`/brands/${id}/logo`, body, {
    headers: { "Content-Type": null },
  });
  return data;
};

export const deleteBrandLogo = async (id: number): Promise<Brand> => {
  const { data } = await http.delete<Brand>(`/brands/${id}/logo`);
  return data;
};
