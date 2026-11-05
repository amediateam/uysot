// Design (AI design) query keys (recovered from the build).
export const designKeys = {
  all: ["design"] as const,
  pricing: () => [...designKeys.all, "pricing"] as const,
  styles: () => [...designKeys.all, "styles"] as const,
  styleImage: (id: number, imagePath: string) => [...designKeys.styles(), "image", id, imagePath] as const,
  orders: () => [...designKeys.all, "orders"] as const,
  orderList: <T>(filters: T) => [...designKeys.orders(), "list", filters] as const,
  orderDetail: (id: number) => [...designKeys.orders(), "detail", id] as const,
  orderFile: (orderId: number, fileId: number) => [...designKeys.orders(), "file", orderId, fileId] as const,
  payments: () => [...designKeys.all, "payments"] as const,
  paymentList: <T>(filters: T) => [...designKeys.payments(), "list", filters] as const,
  paymentDetail: (id: number) => [...designKeys.payments(), "detail", id] as const,
  paymentAttempts: (userId: number, referenceId: number) =>
    [...designKeys.payments(), "attempts", userId, referenceId] as const,
};
