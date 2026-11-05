import { StatusChip, type ChipTone } from "@/components/ui/StatusChip";

// Design-order status mapping (recovered from the build).
export type OrderStatus =
  | "AWAITING_PAYMENT"
  | "CREATED"
  | "GENERATING"
  | "COMPLETED"
  | "GENERATION_FAILED";

export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: ChipTone }> = {
  AWAITING_PAYMENT: { label: "To‘lov kutilmoqda", tone: "warning" },
  CREATED: { label: "Navbatda", tone: "accent" },
  GENERATING: { label: "Yaratilmoqda", tone: "progress" },
  COMPLETED: { label: "Tayyor", tone: "success" },
  GENERATION_FAILED: { label: "Xato", tone: "danger" },
};

export const ORDER_STATUS_OPTIONS = (Object.keys(ORDER_STATUS) as OrderStatus[]).map((value) => ({
  value,
  label: ORDER_STATUS[value].label,
}));

export const OrderStatusChip = ({ status }: { status: OrderStatus }) => {
  const { label, tone } = ORDER_STATUS[status];
  return <StatusChip tone={tone} label={label} live={status === "GENERATING"} />;
};
