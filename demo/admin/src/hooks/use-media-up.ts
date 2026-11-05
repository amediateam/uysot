import { useCallback, useSyncExternalStore } from "react";

// Responsive breakpoint hook (recovered from the build). Returns true when the viewport
// is at least `breakpoint` wide. MediaQueryList objects are cached per query.
const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

const cache = new Map<string, MediaQueryList>();

const getMediaQuery = (query: string): MediaQueryList => {
  const cached = cache.get(query);
  if (cached) return cached;
  const mql = window.matchMedia(query);
  cache.set(query, mql);
  return mql;
};

export const useMediaUp = (breakpoint: Breakpoint): boolean => {
  const query = `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = getMediaQuery(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(() => getMediaQuery(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
};
