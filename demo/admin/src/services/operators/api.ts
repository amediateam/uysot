import { http } from "@/services/http";
import type {
  CreateOperatorPayload,
  Operator,
  OperatorList,
  OperatorListFilters,
  OperatorSession,
  OperatorStatus,
  UpdateOperatorPayload,
} from "@/services/operators/types";

const cleanParams = <T extends object>(params: T): Partial<T> =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "")) as Partial<T>;

// Operators API (recovered from the build). Backend path is /admins.
export const listOperators = async (filters: OperatorListFilters): Promise<OperatorList> => {
  const { data } = await http.get<OperatorList>("/admins", { params: cleanParams(filters) });
  return data;
};

export const getOperator = async (id: number): Promise<Operator> => {
  const { data } = await http.get<Operator>(`/admins/${id}`);
  return data;
};

export const getOperatorSessions = async (id: number): Promise<OperatorSession[]> => {
  const { data } = await http.get<OperatorSession[]>(`/admins/${id}/sessions`);
  return data;
};

export const createOperator = async (payload: CreateOperatorPayload): Promise<Operator> => {
  const { data } = await http.post<Operator>("/admins", payload);
  return data;
};

export const updateOperator = async ({ id, ...rest }: UpdateOperatorPayload): Promise<Operator> => {
  const { data } = await http.patch<Operator>(`/admins/${id}`, rest);
  return data;
};

export const setOperatorStatus = async ({
  id,
  status,
}: {
  id: string;
  status: OperatorStatus;
}): Promise<Operator> => {
  const { data } = await http.post<Operator>(`/admins/${id}/status`, { status });
  return data;
};

export const setOperatorPassword = async ({
  id,
  newPassword,
}: {
  id: string;
  newPassword: string;
}): Promise<void> => {
  const { data } = await http.post<void>(`/admins/${id}/password`, { newPassword });
  return data;
};

export const revokeSession = async (operatorId: number, sessionId: string): Promise<void> => {
  const { data } = await http.delete<void>(`/admins/${operatorId}/sessions/${sessionId}`);
  return data;
};

export const revokeAllSessions = async (operatorId: number): Promise<{ revoked: number }> => {
  const { data } = await http.delete<{ revoked: number }>(`/admins/${operatorId}/sessions`);
  return data;
};
