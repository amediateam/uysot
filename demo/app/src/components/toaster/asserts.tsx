// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (2)
import * as A from "react/jsx-runtime";
const AL = Array(12).fill(0);
export const TL = ({ visible }) => (
  <div className="sonner-loading-wrapper" data-visible={visible}>
    <div className="sonner-spinner">
      {AL.map((t, r) => (
        <div key={`spinner-bar-${r}`} className="sonner-loading-bar" />
      ))}
    </div>
  </div>
);
