// Eskiz query keys (recovered from the build).
export const eskizKeys = {
  all: ["eskiz"] as const,
  accounts: () => [...eskizKeys.all, "accounts"] as const,
  balance: () => [...eskizKeys.all, "balance"] as const,
};
