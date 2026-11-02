// Mock-данные для локального входа (VITE_MOCK_API=true). В production-сборку не попадают.
import { zt } from "@/constants/permissions";

export const MOCK_CREDENTIALS = { username: "admin", password: "admin123" };
export const MOCK_SMS_CODE = "123456";

const base64url = (obj: unknown) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

/** Токен в формате JWT (подпись фиктивная). Поля ssid нет — как у обычной сессии. */
export const makeAccessToken = (userId: number) =>
  [
    base64url({ alg: "HS256", typ: "JWT" }),
    base64url({
      sub: String(userId),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    }),
    "mock-signature",
  ].join(".");

/** Все разрешения из enum permissions (zt) — чтобы mock-пользователь видел всё. */
const allPermissions = (): number[] => {
  const src = (zt ?? {}) as Record<string, unknown>;
  // без PERMISSION_REALTOR_PAGE: иначе после входа редирект уходит в кабинет риелтора (/realtor/search)
  return Object.entries(src)
    .filter(([k, v]) => typeof v === "number" && !k.includes("REALTOR_PAGE"))
    .map(([, v]) => v as number);
};

export const MOCK_COMPANIES = [
  { id: 1, name: "Uysot Demo Qurilish", available: true },
  { id: 2, name: "Demo Developer LLC", available: true },
];

export const makeUser = (companyId = 1) => {
  const company =
    MOCK_COMPANIES.find((c) => c.id === companyId) ?? MOCK_COMPANIES[0];
  const id = 1001;
  return {
    id,
    username: MOCK_CREDENTIALS.username,
    fullName: "Demo Administrator",
    phone: "+998901234567",
    companyId: company.id,
    companyName: company.name,
    companyTimeZone: "Asia/Tashkent",
    branchId: 1,
    accessToken: makeAccessToken(id),
    role: { id: 1, name: "ADMIN", permissions: allPermissions() },
    sessionLimitReached: false,
  };
};
