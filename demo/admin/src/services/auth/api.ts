import { http } from "@/services/http";
import type {
  Admin,
  AppConfig,
  ChangePasswordPayload,
  LoginCredentials,
  LoginResponse,
} from "@/services/auth/types";

// Auth API calls (recovered from the build). The http client unwraps the `{ data }`
// envelope, so these return the payload directly.
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { data } = await http.post<LoginResponse>("/auth/login", credentials);
  return data;
};

export const logout = async (): Promise<void> => {
  const { data } = await http.post<void>("/auth/logout");
  return data;
};

export const getMe = async (): Promise<Admin> => {
  const { data } = await http.get<Admin>("/auth/me");
  return data;
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<void> => {
  const { data } = await http.post<void>("/auth/password", payload);
  return data;
};

export const getConfig = async (): Promise<AppConfig> => {
  const { data } = await http.get<AppConfig>("/config");
  return data;
};
