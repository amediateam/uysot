import type { Paginated } from "@/services/companies/types";
import type { Role } from "@/permissions";

// Operators (admins) domain types (recovered from usage in the build).
export type OperatorStatus = "ACTIVE" | "BLOCKED";

export interface Operator {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  status: OperatorStatus;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface OperatorSession {
  id: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
}

export interface OperatorListFilters {
  search?: string;
  page: number;
  size: number;
}

export type OperatorList = Paginated<Operator>;

export interface CreateOperatorPayload {
  username: string;
  password: string;
  fullName: string;
  role: Role;
}

export interface UpdateOperatorPayload {
  id: string;
  fullName: string;
  role: Role;
}
