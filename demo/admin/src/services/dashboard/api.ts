import { http } from "@/services/http";
import type { DashboardSummary } from "@/services/dashboard/types";

// Dashboard API (recovered from the build).
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await http.get<DashboardSummary>("/dashboard");
  return data;
};
