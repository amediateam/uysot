export const config = {
  app: {
    mode: import.meta.env.MODE,
    version: "1.0.0",
    isDev: import.meta.env.DEV,
    // TODO: inferred from build
    // В сборке здесь весь объект import.meta.env (всегда truthy). Похоже на ошибку, но оставлено как есть.
    isStaging: import.meta.env,
    isProd: import.meta.env.PROD,
  },
  api: {
    baseURL: import.meta.env.VITE_BASE_URL,
    accessTokenKEY: "Authorization",
    refreshTokenKEY: "refresh-token",
  },
  pagination: { perPage: 20, defaultPage: 0 },
};
