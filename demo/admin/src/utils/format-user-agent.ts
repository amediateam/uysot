import { UAParser } from "ua-parser-js";

// Turns a session User-Agent string into a short "Browser major · OS version" label,
// falling back to the raw UA (recovered from the build; the bundle inlined ua-parser-js).
export const formatUserAgent = (userAgent: string | null | undefined): string => {
  if (!userAgent) return "—";
  const { browser, os } = new UAParser(userAgent).getResult();
  const parts = [
    browser.name ? [browser.name, browser.version?.split(".")[0]].filter(Boolean).join(" ") : null,
    os.name ? [os.name, os.version].filter(Boolean).join(" ") : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : userAgent;
};
