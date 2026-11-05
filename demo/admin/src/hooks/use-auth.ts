import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getMe, logout } from "@/services/auth/api";
import { authKeys } from "@/services/auth/keys";
import { clearTokens, isAuthenticated } from "@/services/token-storage";
import type { Role } from "@/permissions";

// Current admin (recovered from the build): `me` query, enabled only when a token exists.
export const useMe = () =>
  useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    enabled: isAuthenticated(),
    staleTime: 300_000,
    retry: false,
  });

// Convenience view over the `me` query.
export const useAuth = (): {
  admin: ReturnType<typeof useMe>["data"];
  role: Role | undefined;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, isLoading, isError } = useMe();
  return { admin: data, role: data?.role, isLoading, isError };
};

// Logout mutation (recovered from the build): clears tokens and the query cache when done.
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearTokens();
      queryClient.clear();
    },
  });
};
