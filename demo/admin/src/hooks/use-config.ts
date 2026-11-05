import { useQuery } from "@tanstack/react-query";
import { getConfig } from "@/services/auth/api";
import { authKeys } from "@/services/auth/keys";

// App config query (recovered from the build): cached forever (staleTime Infinity).
export const useConfig = () =>
  useQuery({
    queryKey: authKeys.config(),
    queryFn: getConfig,
    staleTime: Infinity,
  });
