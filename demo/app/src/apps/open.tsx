// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (17)
import { useLocation, BrowserRouter, Routes, Route } from "react-router-dom";
import * as v from "react";
import * as A from "react/jsx-runtime";
import { Lo } from "@/components/loading/Loading";
import { OP, ya, pp } from "@/modules/theme/theme-store";
import { YL } from "@/components/toaster/index";
import { JL } from "@/assets/icons/AntSuccessIcon";
import { XL } from "@/assets/icons/AntInfoIcon";
import { QL } from "@/assets/icons/AntWarningIcon";
import { KL } from "@/assets/icons/AntErrorIcon";
import { useTranslation } from "react-i18next";
import { Provider } from "react-redux";
import { Ha as store } from "@/store/index";
import { PersistGate } from "redux-persist/integration/react";
import { V7 as persistor } from "@/services/desktop-agent";
import { NuqsAdapter } from "nuqs/adapters/react-router/v6";
import { QueryClientProvider, QueryClient } from "react-query";
import { Ot } from "@/constants/routes";
import { SpeedInsights } from "@vercel/speed-insights/react";
import be from "dayjs";
import { Tt } from "@/utils/current-user";
import { Qy as onError } from "@/utils/error-handler";
import { zt } from "@/constants/permissions";
import { ConfigProvider } from "antd";
import { aF } from "@/constants/index";
import { _s } from "@/with-error-boundary";
import { g3 } from "@/pages/login/Login";
const processUrlSearchParams = (e) => {
  const t = [];
  for (const [n, i] of e.entries()) {
    if (!n || !n.trim() || n === "=" || i === "=" || i === "") {
      t.push(n);
    }
  }
  t.forEach((n) => e.delete(n));
  const r = e.get("single");
  if (r && r.includes("=")) {
    e.set("single", r.replace(/=+$/, ""));
  }
  return e;
};
function CHComponent({ children }) {
  const t = ya((n) => n.mode);
  const r = ya((n) => n.syncResolved);
  v.useEffect(() => {
    pp(t);
  }, [t]);
  v.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const n = window.matchMedia("(prefers-color-scheme: dark)");
    const i = () => {
      if (ya.getState().mode === "system") {
        r();
      }
    };
    n.addEventListener("change", i);
    return () => n.removeEventListener("change", i);
  }, [r]);
  return <>{children}</>;
}
const Ab = _s(g3);
const W3 = v.lazy(() => import("@/pages/restorePassword/RestorePassword"));
const Q31 = v.lazy(() => import("@/pages/change-password/ChangePassword"));
const G3 = v.lazy(() => import("@/pages/qr-code/QrCode"));
const Y3 = v.lazy(() => import("@/pages/payment-qr-code/index"));
const K3 = v.lazy(() => import("@/pages/privacy-policy/index"));
const X3 = v.lazy(() => import("@/pages/schedule-lottotron/ScheduleLottotron"));
const J3 = v.lazy(() => import("@/pages/sap/index"));
be.tz.setDefault(Tt?.companyTimeZone || "Asia/Tashkent");
const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry(e, t) {
        if (t?.response?.status === 500) {
          return false;
        }
        return e < 3;
      },
      onError,
    },
    mutations: {
      onError,
    },
  },
});
// [mock] заглушка закрытой части (/main/*) — только при VITE_MOCK_API=true; в обычной сборке вырезается
const MockAppShell =
  import.meta.env.VITE_MOCK_API === "true"
    ? v.lazy(() => import("@/mocks/MockAppShell").then((m) => ({ default: m.MockAppShell })))
    : null;
function ReloadToAppShell() {
  const { pathname, search, hash } = useLocation();
  v.useEffect(() => {
    window.location.replace(`${pathname}${search}${hash}`);
  }, [pathname, search, hash]);
  return <Lo />;
}
const ez = Tt?.role?.permissions?.includes(zt.PERMISSION_REALTOR_PAGE);
ConfigProvider.config({
  theme: {
    primaryColor: ez ? aF.orange[500] : "#00A389",
  },
});
function OpenToaster() {
  const { resolved } = OP();
  return (
    <YL
      toastOptions={{
        className: "toaster",
      }}
      icons={{
        success: <JL />,
        info: <XL />,
        warning: <QL />,
        error: <KL />,
      }}
      visibleToasts={3}
      position="top-center"
      theme={resolved}
    />
  );
}
function OpenApp() {
  const { i18n } = useTranslation();
  v.useEffect(() => {
    document.documentElement.style.setProperty("--ai-assistant-width", "0px");
    return () => {
      document.documentElement.style.removeProperty("--ai-assistant-width");
    };
  }, []);
  if (i18n.isInitialized) {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={<Lo />} persistor={persistor}>
            <CHComponent>
              <NuqsAdapter processUrlSearchParams={processUrlSearchParams}>
                <QueryClientProvider client={client} contextSharing>
                  <OpenToaster />
                  <v.Suspense fallback={<Lo />}>
                    <Routes>
                      <Route path="/" element={<Ab />} />
                      <Route path={Ot.LOGIN_TELEGRAM} element={<Ab />} />
                      <Route path="/restore-password" element={<W3 />} />
                      <Route path="/change-password" element={<Q31 />} />
                      <Route path="/privacy-policy" element={<K3 />} />
                      <Route path="/schedule-lottotron" element={<X3 />} />
                      <Route path="/qr/payment/:token" element={<Y3 />} />
                      <Route path="/qr/:token" element={<G3 />} />
                      <Route path={Ot.SAP} element={<J3 />} />
                      <Route
                        path="*"
                        element={
                          MockAppShell ? <MockAppShell /> : <ReloadToAppShell />
                        }
                      />
                    </Routes>
                  </v.Suspense>
                  <SpeedInsights />
                </QueryClientProvider>
              </NuqsAdapter>
            </CHComponent>
          </PersistGate>
        </Provider>
      </BrowserRouter>
    );
  }
  return <Lo />;
}
export { OpenApp as rz };
