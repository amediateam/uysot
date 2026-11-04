import { Fragment, type ComponentType, type ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface GuardedOutletProps {
  to: string;
  allow: boolean;
  layout?: ComponentType<{ children: ReactNode }>;
}

export const GuardedOutlet = ({ to, allow, layout: Layout = Fragment }: GuardedOutletProps) =>
  allow ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to={to} />
  );
