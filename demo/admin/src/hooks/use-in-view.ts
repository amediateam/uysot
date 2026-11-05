import { useEffect, useState } from "react";

// Reports when an element first scrolls into view (recovered from the build). Once true,
// stays true. Used to lazy-load story media thumbnails.
export const useInView = (rootMargin = "200px") => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!element || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true);
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, inView, rootMargin]);
  return { ref: setElement, inView };
};
