import type { ChipTone } from "@/components/ui/StatusChip";
import type { ServicePaymentStatus } from "@/services/design/types";

// Fixed interior-style catalog (recovered from the build): one style per code.
export const STYLE_CATALOG: { code: string; name: string }[] = [
  { code: "MINIMALISM", name: "Minimalizm" },
  { code: "MODERN", name: "Zamonaviy" },
  { code: "HI_TECH", name: "Hi-Tech" },
  { code: "NEO_CLASSIC", name: "Neoklassika" },
  { code: "CLASSIC", name: "Klassika" },
  { code: "SCANDINAVIAN", name: "Skandinaviya" },
  { code: "LOFT", name: "Loft" },
  { code: "JAPANDI", name: "Japandi" },
  { code: "PROVENCE", name: "Provans" },
  { code: "ORIENTAL", name: "Sharq uslubi" },
  { code: "ART_DECO", name: "Art-Deko" },
  { code: "ECO", name: "Eko" },
];

// Service-payment status → chip tone (recovered from the build).
export const PAYMENT_STATUS_TONE: Record<ServicePaymentStatus, ChipTone> = {
  CREATED: "neutral",
  PENDING: "accent",
  CONFIRMED: "success",
  FAILED: "danger",
  REVERSED: "warning",
  TIMEOUT: "warning",
  UNEXPECTED: "danger",
};
