import { Spin } from "antd";

// Centered loading indicator (recovered from the build), used as route Suspense fallback.
export const Loading = () => (
  <div className="flex min-h-64 w-full items-center justify-center">
    <Spin size="large" />
  </div>
);
