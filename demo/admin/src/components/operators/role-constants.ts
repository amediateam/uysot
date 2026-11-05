import type { ChipTone } from "@/components/ui/StatusChip";
import type { Role } from "@/permissions";

// Role option list and chip tones (recovered from the build).
export const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "VIEWER", label: "VIEWER" },
  { value: "ADMIN", label: "ADMIN" },
  { value: "SUPER_ADMIN", label: "SUPER_ADMIN" },
];

export const ROLE_TONE: Record<Role, ChipTone> = {
  SUPER_ADMIN: "accent",
  ADMIN: "neutral",
  VIEWER: "neutral",
};
