import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardPage } from "@/pages/app/dashboard/DashboardPage";
import { ForbiddenPage } from "@/pages/auth/forbidden/ForbiddenPage";
import { LoginPage } from "@/pages/auth/login/LoginPage";
import { GuardedOutlet } from "./GuardedOutlet";

export const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="auth" element={<GuardedOutlet allow={!isAuthenticated} to="/app" />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="forbidden" element={<ForbiddenPage />} />
        <Route index path="*" element={<Navigate to="/auth/login" />} />
      </Route>
      <Route path="app" element={<GuardedOutlet allow={isAuthenticated} to="/auth" />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route index path="*" element={<Navigate to="/app/dashboard" />} />
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? "/app/dashboard" : "/auth/login"} />} />
    </Routes>
  );
};
