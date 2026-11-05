import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth/api";
import type { User } from "@/services/auth/types";

// Login mutation (recovered from the build): the caller persists the returned user.
export const useLogin = (onSuccess?: (user: User) => void) =>
  useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      onSuccess?.(user);
    },
  });
