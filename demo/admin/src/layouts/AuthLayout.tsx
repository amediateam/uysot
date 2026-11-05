import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loading } from "@/components/ui/Loading";
import { ThemeSwitcher } from "@/theme/ThemeSwitcher";

// Centered layout for the public auth pages (recovered from the build).
export const AuthLayout = () => (
  <div className="flex min-h-dvh flex-col bg-canvas">
    <div className="flex justify-end p-4">
      <ThemeSwitcher />
    </div>
    <div className="flex flex-1 items-center justify-center px-4 pb-16">
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  </div>
);
