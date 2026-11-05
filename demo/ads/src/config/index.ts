// App config (recovered from the build). The base URL was an inlined literal; exposed
// through import.meta.env with the same default.
// TODO: inferred from build — original read this straight from a constant.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://services.marketplace.uysot.uz";
