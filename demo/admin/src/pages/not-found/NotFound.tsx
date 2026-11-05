import { Button, Result } from "antd";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

// 404 page (recovered from the build).
export const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="That page does not exist."
    extra={
      <Link to={ROUTES.root}>
        <Button type="primary">Back to dashboard</Button>
      </Link>
    }
  />
);
