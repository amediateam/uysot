import "./bootstrap";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConfigProvider } from "antd";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppRouter } from "@/router";
import { queryClient } from "@/services/queryClient";
import { persistor, store } from "@/store";
// Импорт после компонентов: в CSS сборки Tailwind идёт после CSS-модулей.
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={{ token: { colorPrimary: "#00A389" } }}>
            <AuthProvider>
              <AppRouter />
              <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
            </AuthProvider>
          </ConfigProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>,
);
