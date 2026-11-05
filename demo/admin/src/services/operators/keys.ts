import type { OperatorListFilters } from "@/services/operators/types";

// Operators query keys (recovered from the build).
export const operatorKeys = {
  all: ["operators"] as const,
  list: (filters: OperatorListFilters) => [...operatorKeys.all, "list", filters] as const,
  detail: (id: number) => [...operatorKeys.all, "detail", id] as const,
  sessions: (id: number) => [...operatorKeys.all, "sessions", id] as const,
};
