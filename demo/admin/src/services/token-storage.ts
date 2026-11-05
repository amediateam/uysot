import { STORAGE_KEYS } from "@/constants/storage";

// Session token storage (recovered from the build). Tokens live in localStorage.
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const getAccessToken = (): string | null => localStorage.getItem(STORAGE_KEYS.accessToken);

export const getRefreshToken = (): string | null => localStorage.getItem(STORAGE_KEYS.refreshToken);

export const setTokens = ({ accessToken, refreshToken }: AuthTokens): void => {
  localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
};

export const isAuthenticated = (): boolean => !!getAccessToken();
