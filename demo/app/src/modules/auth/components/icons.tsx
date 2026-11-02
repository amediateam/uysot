// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (7)
import * as A from "react/jsx-runtime";
const StrokeIcon = ({ size = 20, children, ...rest }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {children}
  </svg>
);
const Cne = (e) => (
  <StrokeIcon {...e}>
    <path d="M15 18l-6-6 6-6" />
  </StrokeIcon>
);
const xne = (e) => (
  <StrokeIcon {...e}>
    <path d="M9 18l6-6-6-6" />
  </StrokeIcon>
);
const wne = (e) => (
  <StrokeIcon {...e}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </StrokeIcon>
);
const Pne = (e) => (
  <StrokeIcon {...e}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </StrokeIcon>
);
const MessageIcon = (e) => (
  <StrokeIcon {...e}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </StrokeIcon>
);
const TelegramIcon = (e) => (
  <StrokeIcon {...e}>
    <path d="M21.5 4.5L2.5 11.8l6.2 2.3 2.3 6.4 3.4-4.1 4.9 3.6z" />
    <path d="M8.7 14.1l12.8-9.6" />
  </StrokeIcon>
);
export { Cne, Pne, TelegramIcon as WU, wne, xne, MessageIcon as zU };
