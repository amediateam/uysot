import { useCallback, useEffect, useState } from "react";

// Fills an element to the bottom of the viewport (recovered from the build). Returns a
// callback ref; the element gets a `--fill-height` CSS variable kept in sync with the
// space between its top and the viewport bottom (minus the parent's bottom padding).
export const useFillViewportHeight = () => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!element) return;
    const parent = element.parentElement;
    let last = -1;
    const measure = () => {
      const top = element.getBoundingClientRect().top + window.scrollY;
      const parentPaddingBottom = (parent && parseFloat(getComputedStyle(parent).paddingBottom)) || 0;
      const height = Math.max(Math.floor(document.documentElement.clientHeight - top - parentPaddingBottom), 0);
      if (height !== last) {
        last = height;
        element.style.setProperty("--fill-height", `${height}px`);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (parent) {
      observer.observe(parent);
      for (const child of parent.children) observer.observe(child);
    }
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [element]);

  return useCallback((node: HTMLElement | null) => setElement(node), []);
};
