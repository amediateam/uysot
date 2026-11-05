import { Outlet } from "react-router-dom";
import { AdsProvider } from "@/store/ads";
import { AdsModalHost } from "@/components/advertising/AdsModalHost";

// Advertising section shell (recovered from the build): provides the ads state, renders the
// nested page (list or detail) and the shared modal host.
export const AdvertisingLayout = () => (
  <AdsProvider>
    <Outlet />
    <AdsModalHost />
  </AdsProvider>
);
