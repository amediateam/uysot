import { http } from "@/services/http";
import { API_BASE_URL } from "@/config";
import { isApiError } from "@/services/api-error";
import { readAsDataUrl } from "@/utils/read-as-data-url";
import type {
  DesignOrderDetail,
  DesignOrderFilters,
  DesignOrderList,
  DesignPricing,
  DesignStyle,
  SaveStylePayload,
  ServicePayment,
  ServicePaymentFilters,
  ServicePaymentList,
} from "@/services/design/types";

const cleanParams = <T extends object>(params: T): Partial<T> =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "")) as Partial<T>;

// Absolute URL for a style's default (non-uploaded) image path.
const assetOrigin = new URL(API_BASE_URL).origin;
export const styleImageUrl = (imagePath: string): string =>
  `${assetOrigin}/${imagePath.replace(/^\/+/, "")}`;

// Pricing ---------------------------------------------------------------------
export const getDesignPricing = async (): Promise<DesignPricing> => {
  const { data } = await http.get<DesignPricing>("/design/pricing");
  return data;
};

export const updateDesignPricing = async (
  payload: Pick<DesignPricing, "pricePerRender" | "freeRenders">,
): Promise<DesignPricing> => {
  const { data } = await http.put<DesignPricing>("/design/pricing", payload);
  return data;
};

// Styles ----------------------------------------------------------------------
export const listDesignStyles = async (): Promise<DesignStyle[]> => {
  const { data } = await http.get<DesignStyle[]>("/design/styles");
  return data;
};

export const createDesignStyle = async (payload: SaveStylePayload): Promise<DesignStyle> => {
  const { data } = await http.post<DesignStyle>("/design/styles", payload);
  return data;
};

export const updateDesignStyle = async ({
  id,
  ...rest
}: SaveStylePayload & { id: number }): Promise<DesignStyle> => {
  const { data } = await http.put<DesignStyle>(`/design/styles/${id}`, rest);
  return data;
};

export const getStyleImage = async (id: number): Promise<string | null> => {
  try {
    const { data } = await http.get<Blob>(`/design/styles/${id}/image`, { responseType: "blob" });
    return await readAsDataUrl(data);
  } catch (error) {
    if (isApiError(error) && error.status === 404) return null;
    throw error;
  }
};

export const uploadStyleImage = async ({ id, file }: { id: number; file: File }): Promise<DesignStyle> => {
  const body = new FormData();
  body.append("file", file);
  const { data } = await http.post<DesignStyle>(`/design/styles/${id}/image`, body, {
    headers: { "Content-Type": null },
  });
  return data;
};

export const deleteStyleImage = async (id: number): Promise<DesignStyle> => {
  const { data } = await http.delete<DesignStyle>(`/design/styles/${id}/image`);
  return data;
};

// Orders ----------------------------------------------------------------------
// The list endpoint is 1-based; callers work with 0-based pages.
export const listDesignOrders = async ({ page, ...rest }: DesignOrderFilters): Promise<DesignOrderList> => {
  const { data } = await http.get<DesignOrderList>("/design/orders", {
    params: { ...cleanParams(rest), page: page + 1 },
  });
  return data;
};

export const getDesignOrder = async (id: number): Promise<DesignOrderDetail> => {
  const { data } = await http.get<DesignOrderDetail>(`/design/orders/${id}`);
  return data;
};

export const getOrderFile = async (orderId: number, fileId: number): Promise<Blob> => {
  const { data } = await http.get<Blob>(`/design/orders/${orderId}/files/${fileId}`, {
    responseType: "blob",
  });
  return data;
};

// Service payments ------------------------------------------------------------
export const listServicePayments = async ({
  page,
  ...rest
}: ServicePaymentFilters): Promise<ServicePaymentList> => {
  const { data } = await http.get<ServicePaymentList>("/service-payments", {
    params: { ...cleanParams(rest), page: page + 1 },
  });
  return data;
};

export const getServicePayment = async (id: number): Promise<ServicePayment> => {
  const { data } = await http.get<ServicePayment>(`/service-payments/${id}`);
  return data;
};
