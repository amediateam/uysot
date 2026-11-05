import { QueryClientProvider } from "@tanstack/react-query";
import queryString from "query-string";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { AppLayout } from "@/layouts/AppLayout";
import { LoginPage } from "@/pages/login/LoginPage";
import { queryClient } from "@/services/query-client";
import { AuthProvider } from "@/store/auth";

// Top-level routes (recovered from the build): public login at "/", authenticated app at "/main/*".
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/main/*" element={<AppLayout />} />
  </Routes>
);

// Provider tree (recovered from the build): router → query client → auth → URL query params.
export const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <QueryParamProvider
          adapter={ReactRouter6Adapter}
          options={{
            searchStringToObject: queryString.parse,
            objectToSearchString: queryString.stringify,
          }}
        >
          <AppRoutes />
        </QueryParamProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
