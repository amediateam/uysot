import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAuditFilters, listAudit } from "@/services/audit/api";
import { auditKeys } from "@/services/audit/keys";
import type { AuditFilters } from "@/services/audit/types";

// Audit data hooks (recovered from the build).
export const useAuditQuery = (filters: AuditFilters) =>
  useQuery({
    queryKey: auditKeys.list(filters),
    queryFn: () => listAudit(filters),
    placeholderData: keepPreviousData,
  });

export const useAuditFiltersQuery = () =>
  useQuery({ queryKey: auditKeys.filters(), queryFn: getAuditFilters, staleTime: 300_000 });
