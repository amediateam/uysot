import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { store } from "@/store";
import { queryClient } from "@/services/query-client";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { router } from "@/router";

// Root provider tree (recovered from the build).
export const App = () => (
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </ReduxProvider>
);
