// Подключается первым импортом в main.tsx. Включается только при VITE_MOCK_API=true (npm run dev:mock).
import axios from "axios";
import { mockAdapter } from "./adapter";

export const MOCK_API = import.meta.env.VITE_MOCK_API === "true";

// условие написано напрямую через import.meta.env — так Vite вырезает весь mock-код из обычной сборки
if (import.meta.env.VITE_MOCK_API === "true") {
  axios.defaults.adapter = mockAdapter;
  console.info(
    "%c[mock api] включён: логин admin / admin123, SMS-код 123456",
    "color:#00a389;font-weight:bold"
  );
}
