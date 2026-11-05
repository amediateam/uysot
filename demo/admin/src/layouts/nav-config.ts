import { ROUTES } from "@/constants/routes";
import { canManageEskiz, canManageOperators, canViewAudit } from "@/permissions";
import type { Role } from "@/permissions";

// Sidebar navigation (recovered from the build). Items with a `visible` predicate only
// show for roles that pass it.
export interface NavItem {
  to: string;
  label: string;
  visible?: (role: Role | undefined) => boolean;
}

export interface NavSection {
  heading?: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { to: ROUTES.dashboard, label: "Bosh sahifa" },
      { to: ROUTES.companies, label: "Kompaniyalar" },
      { to: ROUTES.brands, label: "Brendlar" },
      { to: ROUTES.partners, label: "Hamkorlar" },
      { to: ROUTES.stories, label: "Story" },
    ],
  },
  {
    heading: "AI dizayn",
    items: [
      { to: ROUTES.designOrders, label: "Buyurtmalar" },
      { to: ROUTES.designPayments, label: "To‘lovlar" },
      { to: ROUTES.designStyles, label: "Uslublar" },
      { to: ROUTES.designPricing, label: "Narx sozlamasi" },
    ],
  },
  {
    items: [
      { to: ROUTES.eskiz, label: "Eskiz", visible: canManageEskiz },
      { to: ROUTES.operators, label: "Operatorlar", visible: canManageOperators },
      { to: ROUTES.audit, label: "Audit", visible: canViewAudit },
    ],
  },
];
