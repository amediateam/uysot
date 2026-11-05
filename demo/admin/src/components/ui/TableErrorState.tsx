import { WarningOutlined } from "@ant-design/icons";
import { Button } from "antd";

// Error placeholder for a failed list load (recovered from the build).
export const TableErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface px-6 py-16 text-center">
    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-danger-soft text-danger-strong">
      <WarningOutlined />
    </div>
    <p className="text-sm font-medium text-content">Server javob bermadi</p>
    <p className="mt-1 text-[13px] text-content-secondary">
      Ro‘yxatni yuklab bo‘lmadi. Ma’lumot o‘zgarmadi.
    </p>
    <Button className="mt-5" onClick={onRetry}>
      Qayta urinish
    </Button>
  </div>
);
