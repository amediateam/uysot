import { http } from "@/services/http";
import type { LoginPayload, User } from "@/services/auth/types";

// POST /api/auth/login → the authenticated user (recovered from the build).
export const login = async (payload: LoginPayload): Promise<User> => {
  const { data } = await http.post<{ data: User }>("/api/auth/login", payload);
  return data.data;
};
