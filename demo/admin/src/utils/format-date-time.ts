// Date/time formatting in the Asia/Tashkent zone with Uzbek month abbreviations
// (recovered from the build).
const MONTHS = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];

interface DateParts {
  day: string;
  monthIndex: number;
  year: string;
  hour: string;
  minute: string;
}

const toParts = (input: string | number | Date): DateParts | null => {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: String(Number(get("day"))),
    monthIndex: Number(get("month")) - 1,
    year: get("year"),
    hour: get("hour"),
    minute: get("minute"),
  };
};

export const formatDateTime = (input: string | number | Date | null | undefined): string => {
  if (!input) return "—";
  const parts = toParts(input);
  return parts ? `${parts.day} ${MONTHS[parts.monthIndex]} ${parts.year}, ${parts.hour}:${parts.minute}` : "—";
};

export const formatDate = (input: string | number | Date | null | undefined): string => {
  if (!input) return "—";
  const parts = toParts(input);
  return parts ? `${parts.day} ${MONTHS[parts.monthIndex]} ${parts.year}` : "—";
};
