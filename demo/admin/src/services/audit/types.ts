import type { Paginated } from "@/services/companies/types";

// Audit domain types (recovered from usage in the build).
export interface AuditEntry {
  id: string;
  createdAt: string;
  adminId: number | null;
  fullName: string | null;
  username: string | null;
  action: string;
  method: string | null;
  path: string | null;
  statusCode: number | null;
  ip: string | null;
  payload: Record<string, unknown> | null;
}

export interface AuditFilters {
  adminId?: number;
  action?: string;
  from?: string;
  to?: string;
  page: number;
  size: number;
}

export interface AuditFilterOptions {
  actions: string[];
  operators: { adminId: number; fullName: string }[];
}

export type AuditList = Paginated<AuditEntry>;
