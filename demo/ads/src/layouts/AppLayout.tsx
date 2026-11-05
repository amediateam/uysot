import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "@/layouts/Navbar";
import { Sidebar } from "@/layouts/Sidebar";
import { AdvertisingLayout } from "@/pages/advertising/AdvertisingLayout";
import { AdvertisingListPage } from "@/pages/advertising/AdvertisingListPage";
import { AdvertisingDetailPage } from "@/pages/advertising/AdvertisingDetailPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";

// Authenticated app shell (recovered from the build): navbar + sidebar + routed content.
// Mounted under "/main/*"; child route paths are relative to it.
export const AppLayout = () => (
  <div className="bg-gray-100 h-[100vh] flex flex-col">
    <Navbar />
    <div className="flex-1 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="advetising" element={<AdvertisingLayout />}>
            <Route index element={<AdvertisingListPage />} />
            <Route path=":id/:name" element={<AdvertisingDetailPage />} />
          </Route>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="advetising" replace />} />
        </Routes>
      </div>
    </div>
  </div>
);
