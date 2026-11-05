// Date-range helpers in the Asia/Tashkent offset (+05:00), recovered from the build.
const PHONE_RE = /^\+\d{9,15}$/;
const DAY_MS = 86_400_000;
const TASHKENT_OFFSET = "+05:00";

// Normalizes a phone string to +<digits>, or returns undefined if it isn't a valid number.
export const normalizePhone = (raw: string): string | undefined => {
  const trimmed = raw.replace(/[\s()-]/g, "");
  const withPlus = trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
  return PHONE_RE.test(withPlus) ? withPlus : undefined;
};

const startOfDay = (day: string): number => new Date(`${day}T00:00:00${TASHKENT_OFFSET}`).getTime();

// Converts an inclusive from/to day pair (YYYY-MM-DD) into ISO timestamps covering the
// full Tashkent days.
export const toTashkentDayBounds = (
  from?: string,
  to?: string,
): { from: string | undefined; to: string | undefined } => ({
  from: from ? new Date(startOfDay(from)).toISOString() : undefined,
  to: to ? new Date(startOfDay(to) + DAY_MS).toISOString() : undefined,
});
