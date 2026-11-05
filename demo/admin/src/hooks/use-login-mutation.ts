import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/services/auth/api";
import { authKeys } from "@/services/auth/keys";
import { setTokens } from "@/services/token-storage";

// Login mutation (recovered from the build): on success stores tokens and seeds the
// cached `me` query with the returned admin so no extra round-trip is needed.
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: ({ accessToken, refreshToken, admin }) => {
      setTokens({ accessToken, refreshToken });
      queryClient.setQueryData(authKeys.me(), admin);
    },
  });
};
