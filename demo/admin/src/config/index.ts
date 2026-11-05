// App configuration (recovered from the build). The base URL was an inlined literal
// in the bundle (no VITE_* env var was present); exposed through import.meta.env with
// the same default so deployments can override it without changing code.
// TODO: inferred from build — original may have read this straight from a constant.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://serv.meninguyim.uysot.uz/api/v1/admin";

export const API_TIMEOUT = 3000;
export const API_LANGUAGE = "uz";

// Endpoint used to exchange a refresh token for a new session.
export const REFRESH_PATH = "/auth/refresh";

// Requests to these paths must not trigger the 401 refresh-and-retry flow.
export const AUTH_FREE_PATHS = [REFRESH_PATH, "/auth/login"];
