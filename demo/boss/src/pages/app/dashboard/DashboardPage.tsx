import { Button } from "antd";
import { useAuth } from "@/hooks/useAuth";

export const DashboardPage = () => {
  const { user, methods } = useAuth();

  return (
    <div className="container flex flex-col items-start gap-2 p-2">
      <h2>{user?.fullName}</h2>
      <Button onClick={methods.logout}>Logout</Button>
    </div>
  );
};
