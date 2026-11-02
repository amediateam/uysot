// Mock API: подменяет axios-адаптер, поэтому обслуживает ВСЕ axios-клиенты приложения
// (services/api/client.ts создаёт их уже после установки адаптера — см. src/mocks/index.ts).
import axios, {
  AxiosError,
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  MOCK_COMPANIES,
  MOCK_CREDENTIALS,
  MOCK_SMS_CODE,
  makeUser,
} from "./data";

type Reply = { status?: number; data: unknown };
type Handler = (ctx: {
  body: any;
  query: URLSearchParams;
  config: InternalAxiosRequestConfig;
}) => Reply | Promise<Reply>;

const ok = (data: unknown): Reply => ({ data: { accept: true, data } });
const fail = (
  status: number,
  message: string,
  messageCode?: number,
  args?: Record<string, unknown>
): Reply => ({
  status,
  data: { accept: false, errorMessage: { message, messageCode, args } },
});

const selections = new Map<string, number[]>();

const routes: Array<[string, RegExp, Handler]> = [
  // --- auth ---
  [
    "POST",
    /^\/v1\/auth\/sign-in(\/dev)?$/,
    ({ body }) =>
      body?.username === MOCK_CREDENTIALS.username &&
      body?.password === MOCK_CREDENTIALS.password
        ? ok(makeUser())
        : fail(400, "Login yoki parol noto'g'ri!", 3121),
  ],
  ["GET", /^\/v1\/auth\/refresh$/, () => ok(makeUser())],
  ["POST", /^\/v1\/auth\/logout$/, () => ok(null)],
  [
    "POST",
    /^\/v1\/auth\/otp\/send$/,
    ({ body }) =>
      ok({
        maskedPhone: String(body?.phone ?? "").replace(/^(.{6}).*(.{2})$/, "$1*** ** $2"),
        resendAfterSec: 60,
        codeTtlSec: 300, // sms-code-step.tsx: таймер жизни кода
      }),
  ],
  [
    "POST",
    /^\/v1\/auth\/otp\/verify$/,
    ({ body }) => {
      if (String(body?.code ?? body?.otp ?? "") !== MOCK_SMS_CODE)
        return fail(400, `Kod noto'g'ri (mock: ${MOCK_SMS_CODE})`, 7901);
      const selectionToken = `mock-selection-${Date.now()}`;
      selections.set(
        selectionToken,
        MOCK_COMPANIES.map((c) => c.id)
      );
      return ok({
        selectionToken,
        expiresInSec: 300,
        companies: MOCK_COMPANIES,
      });
    },
  ],
  [
    "POST",
    /^\/v1\/auth\/(otp|telegram)\/select$/,
    ({ body }) =>
      selections.has(body?.selectionToken)
        ? ok(makeUser(Number(body?.companyId)))
        : fail(400, "Selection expired", 7905),
  ],
  [
    "POST",
    /^\/v1\/auth\/telegram\/session$/,
    () => fail(400, "Telegram orqali kirish mock rejimida mavjud emas"),
  ],
  // --- активные сессии ---
  ["GET", /^\/v1\/active\/session\/user$/, () => ok([])],
  ["POST", /^\/v1\/active\/session\/terminate$/, () => ok(null)],
  // --- push ---
  ["POST", /^\/v1\/push-notification\/token/, () => ok(null)],
  ["DELETE", /^\/v1\/push-notification\/token/, () => ok(null)],
];

const parseBody = (data: unknown) => {
  if (typeof data !== "string") return data;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

export const mockAdapter: AxiosAdapter = async (config) => {
  const full = new URL(axios.getUri(config), window.location.origin);
  const method = (config.method ?? "get").toUpperCase();
  const path = full.pathname.replace(/\/+$/, "") || "/";
  await new Promise((r) => setTimeout(r, 250)); // имитация сети
  const route = routes.find(([m, re]) => m === method && re.test(path));
  const reply: Reply = route
    ? await route[2]({
        body: parseBody(config.data),
        query: full.searchParams,
        config,
      })
    : (console.info(
        `[mock api] нет обработчика: ${method} ${full.href} → {accept:true,data:null}`
      ),
      ok(null));
  const response = {
    data: reply.data,
    status: reply.status ?? 200,
    statusText: "OK",
    headers: {},
    config,
    request: {},
  };
  if (response.status >= 400) {
    throw new AxiosError(
      `Request failed with status code ${response.status}`,
      AxiosError.ERR_BAD_REQUEST,
      config,
      {},
      response as any
    );
  }
  return response as any;
};
