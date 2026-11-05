import { LogoutOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { AppLogo } from "@/components/ui/AppLogo";
import { ThemeSwitcher } from "@/theme/ThemeSwitcher";
import { NAV_SECTIONS } from "@/layouts/nav-config";

// NavLink class (recovered from the build). Indented when under a section heading.
const navLinkClass = (hasHeading: boolean) =>
  ({ isActive }: { isActive: boolean }) =>
    [
      "flex min-h-11 items-center rounded-xl py-2.5 pr-3 text-sm transition-colors lg:min-h-0",
      hasHeading ? "pl-5" : "pl-3",
      isActive
        ? "bg-accent-soft font-semibold text-accent"
        : "text-content-muted hover:bg-surface-muted hover:text-content",
    ].join(" ");

// Sidebar body shared by the desktop aside and the mobile drawer (recovered from the build).
export const SidebarContent = ({
  showLogo = true,
  onNavigate,
}: {
  showLogo?: boolean;
  onNavigate?: () => void;
}) => {
  const { admin, role } = useAuth();
  const navigate = useNavigate();
  const { mutate, isPending } = useLogout();

  return (
    <div className="flex h-full flex-col gap-7">
      {showLogo && <AppLogo size="sm" suffix="dev" />}
      <nav className="flex flex-1 flex-col gap-2.5">
        {NAV_SECTIONS.map(({ heading, items }) => {
          const visibleItems = items.filter((item) => item.visible?.(role) ?? true);
          if (visibleItems.length === 0) return null;
          return (
            <div key={heading ?? visibleItems[0].to} className="flex flex-col gap-1">
              {heading && (
                <p className="px-3 pt-1 text-[11px] font-semibold tracking-wide text-content-muted">
                  {heading}
                </p>
              )}
              {visibleItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClass(!!heading)} onClick={onNavigate}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[13px] font-semibold text-accent">
            {admin?.fullName.slice(0, 1) ?? "—"}
          </div>
          <div className="min-w-0">
            <p className="mb-0 truncate text-[13px] font-medium text-content">{admin?.fullName ?? "—"}</p>
            <p className="mb-0 truncate font-mono text-[11px] text-content-muted">{role ?? ""}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <ThemeSwitcher />
          <Tooltip title="Chiqish">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              loading={isPending}
              onClick={() =>
                mutate(undefined, { onSettled: () => navigate(ROUTES.login, { replace: true }) })
              }
              aria-label="Chiqish"
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
