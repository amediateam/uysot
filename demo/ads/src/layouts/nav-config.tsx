import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

// Sidebar navigation (recovered from the build). Note the backend-matching "/advetising"
// spelling is kept intentionally.
export interface NavItem {
  to: string;
  name: string;
  icon: ReactNode;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/main/advetising", name: "Reklama", icon: <Icon name="rocket" className="h-[20px] " /> },
  { to: "/main/dashboard", name: "Dashbord", icon: <Icon name="dashboard" className="h-[20px] " /> },
];
