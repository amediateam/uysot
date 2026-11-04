import { logout } from "@/store/auth/slice";
import { useAppDispatch, useAppSelector } from "@/store";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(({ auth }) => auth.user);
  const isFetched = useAppSelector(({ auth }) => auth.isFetched);
  const accessToken = useAppSelector(({ auth }) => auth.accessToken);
  const refreshToken = useAppSelector(({ auth }) => auth.refreshToken);

  return {
    user,
    isFetched,
    isAuthenticated: !!user,
    accessToken,
    refreshToken,
    methods: {
      logout: () => {
        dispatch(logout());
      },
    },
  };
};
