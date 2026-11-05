import axios, { AxiosHeaders, type AxiosRequestConfig } from "axios";
import { API_BASE_URL, API_LANGUAGE, API_TIMEOUT, AUTH_FREE_PATHS, REFRESH_PATH } from "@/config";
import { ROUTES } from "@/constants/routes";
import { toApiError, type ApiError } from "@/services/api-error";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
  type AuthTokens,
} from "@/services/token-storage";

// Shared axios client (recovered from the build): Bearer auth, `data.data` unwrapping,
// and a single-flight refresh-and-retry on 401.
export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": API_LANGUAGE,
  },
});

// Attach the access token to every request.
http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

// Unwrap the backend envelope `{ data: ... }` down to its payload.
http.interceptors.response.use((response) => {
  const body = response.data;
  if (body && typeof body === "object" && "data" in body) {
    response.data = (body as { data: unknown }).data;
  }
  return response;
});

const requestRefresh = async (): Promise<AuthTokens> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }
  const { data } = await axios.post<{ data: AuthTokens }>(
    `${API_BASE_URL}${REFRESH_PATH}`,
    { refreshToken },
    { headers: { "Content-Type": "application/json", "Accept-Language": API_LANGUAGE } },
  );
  return data.data;
};

const forceLogout = (): void => {
  clearTokens();
  if (window.location.pathname !== ROUTES.login) {
    window.location.assign(ROUTES.login);
  }
};

// Single in-flight refresh promise shared by all concurrent 401s.
let refreshPromise: Promise<AuthTokens> | null = null;

http.interceptors.response.use(
  (response) => response,
  async (error): Promise<never> => {
    const config = error.config as (AxiosRequestConfig & { _isRetry?: boolean }) | undefined;
    const isUnauthorized = error.response?.status === 401;
    const isAuthFree = AUTH_FREE_PATHS.some((path) => config?.url?.includes(path));

    if (!isUnauthorized || !config || config._isRetry || isAuthFree) {
      return Promise.reject(toApiError(error));
    }

    config._isRetry = true;
    try {
      refreshPromise ??= requestRefresh().finally(() => {
        refreshPromise = null;
      });
      setTokens(await refreshPromise);
      return (await http(config)) as never;
    } catch {
      forceLogout();
      return Promise.reject(toApiError(error));
    }
  },
);

export type { ApiError };
