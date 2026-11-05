import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { canManageEskiz, canManageOperators, canViewAudit } from "@/permissions";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AppLayout } from "@/layouts/AppLayout";
import { AuthGuard, GuestGuard, PasswordChangeGuard, PermissionGuard } from "@/router/guards";
import { RouteError } from "@/router/RouteError";
import { NotFound } from "@/pages/not-found/NotFound";

// Code-split pages (recovered from the build): the production bundle lazy-loaded each
// page into its own named chunk.
const LoginPage = lazy(() => import("@/pages/login/LoginPage").then((m) => ({ default: m.LoginPage })));
const ChangePasswordPage = lazy(() =>
  import("@/pages/change-password/ChangePasswordPage").then((m) => ({ default: m.ChangePasswordPage })),
);
const DashboardPage = lazy(() =>
  import("@/pages/dashboard/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const CompaniesPage = lazy(() =>
  import("@/pages/companies/CompaniesPage").then((m) => ({ default: m.CompaniesPage })),
);
const UnlinkedCompaniesPage = lazy(() =>
  import("@/pages/companies/UnlinkedCompaniesPage").then((m) => ({ default: m.UnlinkedCompaniesPage })),
);
const BrandsPage = lazy(() => import("@/pages/brands/BrandsPage").then((m) => ({ default: m.BrandsPage })));
const BrandDetailPage = lazy(() =>
  import("@/pages/brands/BrandDetailPage").then((m) => ({ default: m.BrandDetailPage })),
);
const PartnersPage = lazy(() =>
  import("@/pages/partners/PartnersPage").then((m) => ({ default: m.PartnersPage })),
);
const StoriesPage = lazy(() =>
  import("@/pages/stories/StoriesPage").then((m) => ({ default: m.StoriesPage })),
);
const StoryDetailPage = lazy(() =>
  import("@/pages/stories/StoryDetailPage").then((m) => ({ default: m.StoryDetailPage })),
);
const DesignOrdersPage = lazy(() =>
  import("@/pages/design/DesignOrdersPage").then((m) => ({ default: m.DesignOrdersPage })),
);
const DesignOrderPage = lazy(() =>
  import("@/pages/design/DesignOrderPage").then((m) => ({ default: m.DesignOrderPage })),
);
const ServicePaymentsPage = lazy(() =>
  import("@/pages/design/ServicePaymentsPage").then((m) => ({ default: m.ServicePaymentsPage })),
);
const DesignStylesPage = lazy(() =>
  import("@/pages/design/DesignStylesPage").then((m) => ({ default: m.DesignStylesPage })),
);
const DesignPricingPage = lazy(() =>
  import("@/pages/design/DesignPricingPage").then((m) => ({ default: m.DesignPricingPage })),
);
const EskizPage = lazy(() => import("@/pages/eskiz/EskizPage").then((m) => ({ default: m.EskizPage })));
const OperatorsPage = lazy(() =>
  import("@/pages/operators/OperatorsPage").then((m) => ({ default: m.OperatorsPage })),
);
const OperatorDetailPage = lazy(() =>
  import("@/pages/operators/OperatorDetailPage").then((m) => ({ default: m.OperatorDetailPage })),
);
const AuditPage = lazy(() => import("@/pages/audit/AuditPage").then((m) => ({ default: m.AuditPage })));

export const router = createBrowserRouter([
  {
    errorElement: <RouteError />,
    children: [
      { path: ROUTES.root, element: <Navigate to={ROUTES.dashboard} replace /> },

      // Public auth pages.
      {
        element: <GuestGuard />,
        children: [{ element: <AuthLayout />, children: [{ path: ROUTES.login, element: <LoginPage /> }] }],
      },
      {
        element: <AuthLayout />,
        children: [{ path: ROUTES.changePassword, element: <ChangePasswordPage /> }],
      },

      // Authenticated app.
      {
        element: <AuthGuard />,
        children: [
          {
            element: <PasswordChangeGuard />,
            children: [
              {
                element: <AppLayout />,
                children: [
                  { path: ROUTES.dashboard, element: <DashboardPage /> },
                  { path: ROUTES.companiesUnlinked, element: <UnlinkedCompaniesPage /> },
                  { path: ROUTES.companies, element: <CompaniesPage /> },
                  { path: ROUTES.brands, element: <BrandsPage /> },
                  { path: ROUTES.brandDetailPattern, element: <BrandDetailPage /> },
                  { path: ROUTES.partners, element: <PartnersPage /> },
                  { path: ROUTES.stories, element: <StoriesPage /> },
                  { path: ROUTES.storyDetailPattern, element: <StoryDetailPage /> },
                  { path: ROUTES.designOrders, element: <DesignOrdersPage /> },
                  { path: ROUTES.designOrderDetailPattern, element: <DesignOrderPage /> },
                  { path: ROUTES.designPayments, element: <ServicePaymentsPage /> },
                  { path: ROUTES.designStyles, element: <DesignStylesPage /> },
                  { path: ROUTES.designPricing, element: <DesignPricingPage /> },
                  {
                    element: <PermissionGuard allow={canManageEskiz} />,
                    children: [{ path: ROUTES.eskiz, element: <EskizPage /> }],
                  },
                  {
                    element: <PermissionGuard allow={canManageOperators} />,
                    children: [
                      { path: ROUTES.operators, element: <OperatorsPage /> },
                      { path: ROUTES.operatorDetailPattern, element: <OperatorDetailPage /> },
                    ],
                  },
                  {
                    element: <PermissionGuard allow={canViewAudit} />,
                    children: [{ path: ROUTES.audit, element: <AuditPage /> }],
                  },
                ],
              },
            ],
          },
        ],
      },

      { path: ROUTES.notFound, element: <NotFound /> },
    ],
  },
]);
