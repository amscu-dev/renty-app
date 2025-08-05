import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: no-preference)";

export default function usePrefersReducedMotion() {
  // 1. Always start `true` (matches server render)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    // 2. Sync initial value on client
    setPrefersReducedMotion(!mql.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(!e.matches);
    };
    mql.addEventListener("change", listener);
    return () => {
      mql.removeEventListener("change", listener);
    };
  }, []);

  return prefersReducedMotion;
}
