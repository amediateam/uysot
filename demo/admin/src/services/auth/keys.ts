// Auth query keys (recovered from the build).
export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
  config: () => [...authKeys.all, "config"] as const,
};
