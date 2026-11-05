import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword } from "@/services/auth/api";
import { authKeys } from "@/services/auth/keys";

// Change-password mutation (recovered from the build): on success refetches `me` so the
// `mustChangePassword` flag clears.
export const useChangePasswordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me(), refetchType: "all" }),
  });
};
