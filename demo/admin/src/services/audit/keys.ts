import type { AuditFilters } from "@/services/audit/types";

// Audit query keys (recovered from the build).
export const auditKeys = {
  all: ["audit"] as const,
  list: (filters: AuditFilters) => [...auditKeys.all, "list", filters] as const,
  filters: () => [...auditKeys.all, "filters"] as const,
};
