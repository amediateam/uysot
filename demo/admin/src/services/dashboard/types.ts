import type { AuditEntry } from "@/services/audit/types";

// Dashboard summary (recovered from usage in the build).
export interface DashboardSummary {
  unlinkedCount: number;
  eskiz: { balance: number | null; activeUsername: string } | null;
  companies: { total: number; premium: number; plain: number };
  recentAudit: AuditEntry[] | null;
}
