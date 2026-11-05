import { LockOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

// Shown when a role lacks access to a section (recovered from the build).
export const Forbidden = () => (
  <div className="flex min-h-96 flex-col items-center justify-center px-4 text-center">
    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted text-xl text-content-muted">
      <LockOutlined />
    </div>
    <h1 className="text-lg font-semibold text-content">Bu bo‘lim sizning rolingiz uchun ochiq emas</h1>
    <p className="mt-2 max-w-md text-sm text-content-secondary">
      Kirish huquqi kerak bo‘lsa SUPER_ADMIN ga murojaat qiling.
    </p>
    <Link to={ROUTES.dashboard} className="mt-6">
      <Button type="primary">Bosh sahifaga qaytish</Button>
    </Link>
  </div>
);
