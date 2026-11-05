import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiErrorCode } from "@/constants/api-error-codes";
import { isApiError } from "@/services/api-error";
import {
  createDesignStyle,
  deleteStyleImage,
  getDesignOrder,
  getDesignPricing,
  getOrderFile,
  getServicePayment,
  getStyleImage,
  listDesignOrders,
  listDesignStyles,
  listServicePayments,
  updateDesignPricing,
  updateDesignStyle,
  uploadStyleImage,
} from "@/services/design/api";
import { designKeys } from "@/services/design/keys";
import { readAsDataUrl } from "@/utils/read-as-data-url";
import type {
  DesignOrderFilters,
  DesignStyle,
  ServicePayment,
  ServicePaymentFilters,
} from "@/services/design/types";

const ORDER_POLL_MS = 10_000;
const ACTIVE_ORDER_STATUSES = new Set(["CREATED", "GENERATING"]);
const ATTEMPTS_PAGE_SIZE = 100;

// Pricing ---------------------------------------------------------------------
export const useDesignPricing = () =>
  useQuery({ queryKey: designKeys.pricing(), queryFn: getDesignPricing });

export const useUpdateDesignPricing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDesignPricing,
    onSuccess: (pricing) => queryClient.setQueryData(designKeys.pricing(), pricing),
  });
};

// Styles ----------------------------------------------------------------------
// Upserts a style into the cached list so mutations reflect immediately.
const useSyncStyle = () => {
  const queryClient = useQueryClient();
  return (style: DesignStyle) =>
    queryClient.setQueryData<DesignStyle[]>(designKeys.styles(), (prev) => {
      if (!prev) return prev;
      return prev.some((s) => s.id === style.id)
        ? prev.map((s) => (s.id === style.id ? style : s))
        : [...prev, style];
    });
};

export const useDesignStyles = () =>
  useQuery({ queryKey: designKeys.styles(), queryFn: listDesignStyles });

export const useCreateDesignStyle = () => {
  const sync = useSyncStyle();
  return useMutation({ mutationFn: createDesignStyle, onSuccess: sync });
};

export const useUpdateDesignStyle = () => {
  const sync = useSyncStyle();
  return useMutation({ mutationFn: updateDesignStyle, onSuccess: sync });
};

export const useUploadStyleImage = () => {
  const sync = useSyncStyle();
  return useMutation({ mutationFn: uploadStyleImage, onSuccess: sync });
};

export const useDeleteStyleImage = () => {
  const sync = useSyncStyle();
  return useMutation({ mutationFn: deleteStyleImage, onSuccess: sync });
};

export const useStyleImage = (id: number, imagePath: string | null, enabled: boolean) =>
  useQuery({
    queryKey: designKeys.styleImage(id, imagePath ?? ""),
    queryFn: () => getStyleImage(id),
    enabled,
    staleTime: Infinity,
  });

// Orders ----------------------------------------------------------------------
export const useDesignOrders = (filters: DesignOrderFilters) =>
  useQuery({
    queryKey: designKeys.orderList(filters),
    queryFn: () => listDesignOrders(filters),
    placeholderData: keepPreviousData,
  });

export const useDesignOrder = (id: number) =>
  useQuery({
    queryKey: designKeys.orderDetail(id),
    queryFn: () => getDesignOrder(id),
    enabled: Number.isFinite(id),
    retry: (failureCount, error) =>
      !(isApiError(error) && error.code === ApiErrorCode.DESIGN_ORDER_NOT_FOUND) && failureCount < 3,
    refetchInterval: (query) =>
      ACTIVE_ORDER_STATUSES.has(query.state.data?.order.status ?? "") ? ORDER_POLL_MS : false,
  });

export const useOrderFile = (orderId: number, fileId: number) =>
  useQuery({
    queryKey: designKeys.orderFile(orderId, fileId),
    queryFn: async () => {
      try {
        return await readAsDataUrl(await getOrderFile(orderId, fileId));
      } catch (error) {
        if (isApiError(error) && error.status === 404) return null;
        throw error;
      }
    },
    staleTime: Infinity,
  });

// Service payments ------------------------------------------------------------
export const useServicePayments = (filters: ServicePaymentFilters) =>
  useQuery({
    queryKey: designKeys.paymentList(filters),
    queryFn: () => listServicePayments(filters),
    placeholderData: keepPreviousData,
  });

export const useServicePayment = (paymentId: number | null) =>
  useQuery({
    queryKey: designKeys.paymentDetail(paymentId ?? 0),
    queryFn: () => getServicePayment(paymentId ?? 0),
    enabled: paymentId !== null && Number.isFinite(paymentId),
  });

// All attempts for the same order (referenceId), sorted by attempt number.
export const useServicePaymentAttempts = (payment: ServicePayment | undefined) =>
  useQuery({
    queryKey: designKeys.paymentAttempts(payment?.userId ?? 0, payment?.referenceId ?? 0),
    queryFn: async () =>
      (
        await listServicePayments({
          purpose: "DESIGN",
          userId: payment?.userId,
          page: 0,
          size: ATTEMPTS_PAGE_SIZE,
        })
      ).elements
        .filter((item) => item.referenceId === payment?.referenceId)
        .sort((a, b) => a.attempt - b.attempt),
    enabled: payment !== undefined,
  });
