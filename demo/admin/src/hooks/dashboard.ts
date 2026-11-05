import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/services/dashboard/api";
import { dashboardKeys } from "@/services/dashboard/keys";

// Dashboard summary query (recovered from the build).
export const useDashboardQuery = () =>
  useQuery({ queryKey: dashboardKeys.summary(), queryFn: getDashboardSummary });
