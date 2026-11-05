import { Breadcrumb } from "@/components/ui/Breadcrumb";

// Dashboard page (recovered from the build — a placeholder in the original too).
export const DashboardPage = () => (
  <>
    <Breadcrumb crumbs={[{ name: "Dashboard", url: "/main/dashboard" }]} />
    <div className="flex flex-col gap-[16px] p-[16px] flex-1 overflow-y-auto">
      <h1 className="font-[600] text-[20px]">Dashboard</h1>
    </div>
  </>
);
