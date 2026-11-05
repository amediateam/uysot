import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { isAuthenticated } from "@/services/token-storage";
import { useAuth } from "@/hooks/use-auth";
import { Loading } from "@/components/ui/Loading";
import { Forbidden } from "@/pages/forbidden/Forbidden";
import type { Role } from "@/permissions";

// Redirects authenticated users away from guest-only pages (login).
export const GuestGuard = () => {
  if (isAuthenticated()) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }
  return <Outlet />;
};

// Requires a session; otherwise bounces to login, remembering the attempted location.
export const AuthGuard = () => {
  const location = useLocation();
  if (isAuthenticated()) {
    return <Outlet />;
  }
  return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
};

// Forces a password change when the backend flags the admin.
export const PasswordChangeGuard = () => {
  const { admin, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return <Loading />;
  }
  if (admin?.mustChangePassword && location.pathname !== ROUTES.changePassword) {
    return <Navigate to={ROUTES.changePassword} replace />;
  }
  return <Outlet />;
};

// Gates a branch of routes behind a role predicate, showing Forbidden otherwise.
export const PermissionGuard = ({ allow }: { allow: (role: Role | undefined) => boolean }) => {
  const { role, isLoading } = useAuth();
  if (isLoading) {
    return <Loading />;
  }
  return allow(role) ? <Outlet /> : <Forbidden />;
};
