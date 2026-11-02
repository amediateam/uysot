// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (1)
import * as A from "react/jsx-runtime";
export const g$ = ({ placement = "bottom", pathProps }) => {
  const r = {
    top: "180deg",
    bottom: "0deg",
    left: "90deg",
    right: "-90deg",
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `rotate(${r[placement]})`,
      }}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...pathProps}
      />
    </svg>
  );
};
