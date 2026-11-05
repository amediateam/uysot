import type { Paginated } from "@/services/companies/types";
import type { OrderStatus } from "@/components/ui/OrderStatusChip";

// Design domain types (recovered from usage in the build).
export interface DesignPricing {
  pricePerRender: number;
  freeRenders: number;
  updatedAt: string | null;
}

export interface DesignStyle {
  id: number;
  code: string;
  name: string;
  promptText: string;
  pricePerSqm: number;
  active: boolean;
  imagePath: string | null;
  imageUploaded: boolean;
  imageFileName: string | null;
}

export interface SaveStylePayload {
  code: string;
  promptText: string;
  pricePerSqm: number;
  active: boolean;
}

export interface OrderPrice {
  totalRenders: number;
  freeRenders: number;
  paidRenders: number;
  pricePerRender: number;
  amountDue: number;
}

export interface DesignOrder {
  id: number;
  status: OrderStatus;
  styleId: number | null;
  contractId: number | null;
  flatId: number | null;
  producedImageCount: number;
  requestedImageCount: number;
  totalEstimatedCost: number | null;
  price: OrderPrice | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  rooms: DesignRoom[];
}

export interface DesignRoom {
  id: number;
  label: string;
  type: string;
  combinedWithToilet: boolean | null;
  areaSqm: number | null;
  estimatedCost: number | null;
  imageCount: number;
  renders: { fileId: number }[];
}

export interface DesignOrderRow {
  order: DesignOrder;
  userPhone: string;
}

export interface DesignOrderDetail {
  order: DesignOrder;
  userId: number;
  userPhone: string;
  flatAreaSqm: number;
  flatLivingAreaSqm: number;
  reportFileId: number | null;
  servicePaymentId: number | null;
}

export interface DesignOrderFilters {
  status?: OrderStatus;
  phone?: string;
  userId?: number;
  contractId?: number;
  from?: string;
  to?: string;
  page: number;
  size: number;
}

export type ServicePaymentStatus =
  | "CREATED"
  | "PENDING"
  | "CONFIRMED"
  | "FAILED"
  | "REVERSED"
  | "TIMEOUT"
  | "UNEXPECTED";

export interface ServicePayment {
  id: number;
  userId: number;
  userPhone: string;
  referenceId: number;
  attempt: number;
  amount: number;
  maskedPan: string | null;
  status: ServicePaymentStatus;
  acceptedAt: string | null;
  createdAt: string;
  externalId: string | null;
  transactionId: string | null;
  lastError: string | null;
  ofdUrl: string | null;
}

export interface ServicePaymentFilters {
  purpose: "DESIGN";
  status?: ServicePaymentStatus;
  phone?: string;
  userId?: number;
  from?: string;
  to?: string;
  page: number;
  size: number;
}

export type DesignOrderList = Paginated<DesignOrderRow>;
export type ServicePaymentList = Paginated<ServicePayment>;
