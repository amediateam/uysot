import { http } from "@/services/http";
import type { AuditFilterOptions, AuditFilters, AuditList } from "@/services/audit/types";

const cleanParams = <T extends object>(params: T): Partial<T> =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "")) as Partial<T>;

// Audit API (recovered from the build).
export const listAudit = async (filters: AuditFilters): Promise<AuditList> => {
  const { data } = await http.get<AuditList>("/audit", { params: cleanParams(filters) });
  return data;
};

export const getAuditFilters = async (): Promise<AuditFilterOptions> => {
  const { data } = await http.get<AuditFilterOptions>("/audit/filters");
  return data;
};
