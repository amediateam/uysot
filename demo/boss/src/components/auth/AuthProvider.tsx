import type { ReactNode } from "react";
import { Loading } from "@/components/loading/Loading";
import { useAuth } from "@/hooks/useAuth";
import { useQueryWithCallbacks } from "@/hooks/useQueryWithCallbacks";
import { authQueryKeys } from "@/services/auth/queryKeys";
import { userSchema } from "@/services/auth/schemas";
import { http } from "@/services/http";
import { useAppDispatch } from "@/store";
import { changeToken, login, logout } from "@/store/auth/slice";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { accessToken, isFetched } = useAuth();

  useQueryWithCallbacks({
    queryKey: authQueryKeys.user({ accessToken }).queryKey,
    queryFn: async () => {
      const { data } = await http.request.get("/v1/auth/me");
      return userSchema.parse(data.data);
    },
    onSuccess: (user) => dispatch(login({ user })),
    enabled: !!accessToken,
    retry: false,
  });

  useQueryWithCallbacks({
    queryKey: ["auth", "refresh"],
    queryFn: async () => {
      const { data } = await http.request.get("/v1/auth/refresh");
      return userSchema.parse(data.data);
    },
    onSuccess: ({ accessToken = "", refreshToken = "" }) =>
      dispatch(changeToken({ accessToken, refreshToken })),
    onError: () => dispatch(logout()),
    enabled: !accessToken,
    retry: false,
  });

  return isFetched ? children : <Loading />;
};
