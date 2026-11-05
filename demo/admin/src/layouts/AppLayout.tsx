import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { Suspense, useCallback, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppLogo } from "@/components/ui/AppLogo";
import { Loading } from "@/components/ui/Loading";
import { SidebarContent } from "@/layouts/SidebarContent";

// Desktop sidebar (recovered from the build).
const DesktopSidebar = () => (
  <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-surface px-4 py-6 lg:flex">
    <SidebarContent />
  </aside>
);

// Mobile navigation drawer (recovered from the build).
const MobileNav = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Drawer
    open={open}
    onClose={onClose}
    placement="left"
    width={272}
    title="Uyim · dev"
    destroyOnHidden
    closable={{ "aria-label": "Yopish" }}
  >
    <SidebarContent showLogo={false} onNavigate={onClose} />
  </Drawer>
);

// Mobile header with the hamburger (recovered from the build).
const MobileHeader = ({ onOpenNav }: { onOpenNav: () => void }) => (
  <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-surface px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] lg:hidden">
    <Button
      type="text"
      icon={<MenuOutlined />}
      onClick={onOpenNav}
      aria-label="Menyuni ochish"
      className="!h-11 !w-11"
    />
    <AppLogo size="sm" suffix="dev" />
  </header>
);

// Tracks the mobile nav open state, keyed by pathname so navigation closes it.
const useMobileNav = () => {
  const { pathname } = useLocation();
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = useCallback(() => setOpenedAt(pathname), [pathname]);
  const close = useCallback(() => setOpenedAt(null), []);
  return { isOpen: openedAt === pathname, open, close };
};

// Authenticated app shell (recovered from the build).
export const AppLayout = () => {
  const { isOpen, open, close } = useMobileNav();
  return (
    <div className="flex min-h-dvh bg-canvas pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
      <DesktopSidebar />
      <MobileNav open={isOpen} onClose={close} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader onOpenNav={open} />
        <main className="min-w-0 flex-1 px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8 lg:py-7">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};
