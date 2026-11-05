import { http } from "@/services/http";
import type {
  CreateEskizAccountPayload,
  EskizAccount,
  EskizBalance,
  TestSendPayload,
  TestSendResult,
  UpdateEskizAccountPayload,
} from "@/services/eskiz/types";

// Eskiz API (recovered from the build). Backend path is /sms/eskiz.
export const listEskizAccounts = async (): Promise<EskizAccount[]> => {
  const { data } = await http.get<EskizAccount[]>("/sms/eskiz/accounts");
  return data;
};

export const getEskizBalance = async (): Promise<EskizBalance> => {
  const { data } = await http.get<EskizBalance>("/sms/eskiz/balance");
  return data;
};

export const createEskizAccount = async (payload: CreateEskizAccountPayload): Promise<EskizAccount> => {
  const { data } = await http.post<EskizAccount>("/sms/eskiz/accounts", payload);
  return data;
};

export const updateEskizAccount = async ({ id, ...rest }: UpdateEskizAccountPayload): Promise<EskizAccount> => {
  const { data } = await http.patch<EskizAccount>(`/sms/eskiz/accounts/${id}`, rest);
  return data;
};

export const setEskizPassword = async ({ id, password }: { id: string; password: string }): Promise<EskizAccount> => {
  const { data } = await http.post<EskizAccount>(`/sms/eskiz/accounts/${id}/password`, { password });
  return data;
};

export const verifyEskizAccount = async (id: string): Promise<EskizAccount> => {
  const { data } = await http.post<EskizAccount>(`/sms/eskiz/accounts/${id}/verify`);
  return data;
};

export const activateEskizAccount = async (id: string): Promise<EskizAccount> => {
  const { data } = await http.post<EskizAccount>(`/sms/eskiz/accounts/${id}/activate`);
  return data;
};

export const testSendSms = async (payload: TestSendPayload): Promise<TestSendResult> => {
  const { data } = await http.post<TestSendResult>("/sms/test-send", payload);
  return data;
};

export const deleteEskizAccount = async (id: string): Promise<void> => {
  const { data } = await http.delete<void>(`/sms/eskiz/accounts/${id}`);
  return data;
};
