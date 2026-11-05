import { Button, Result } from "antd";
import { useNavigate, useRouteError } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

// Router errorElement (recovered from the build): shown when a route (e.g. a lazy chunk)
// fails to load.
export const RouteError = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const message = error instanceof Error ? error.message : "An unexpected error occurred.";
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4">
      <Result
        status="error"
        title="This page failed to load"
        subTitle={message}
        extra={
          <Button type="primary" onClick={() => navigate(ROUTES.root, { replace: true })}>
            Back to start
          </Button>
        }
      />
    </div>
  );
};
