import type { Role } from "@/permissions";

// Auth domain types. Field names are recovered from usage in the build; shapes not fully
// observable are marked.
export interface Admin {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  mustChangePassword: boolean;
  // TODO: inferred from build — additional admin fields may exist in the API response.
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  admin: Admin;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// Password policy returned by GET /config (used by the change-password validation UI).
export interface AppConfig {
  passwordMinLength: number;
  // TODO: inferred from build — exact /config shape is not fully observable from the bundle.
  [key: string]: unknown;
}
