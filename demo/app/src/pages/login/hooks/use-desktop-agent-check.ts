// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (2)
import * as v from "react";
import { O5, k5 } from "@/modules/desktop-agent/errors";
import { n9 } from "@/services/desktop-agent";
const d3 = 1500;
function useF3() {
  const [e, setE] = v.useState(null);
  const rRef = v.useRef(null);
  const nRef = v.useRef(false);
  const iRef = v.useRef(false);
  const open = v.useCallback((l, c) => {
    if (O5(l)) {
      return (rRef.current = c), (iRef.current = true), setE(k5(l)), true;
    }
    return false;
  }, []);
  const close = v.useCallback(() => {
    rRef.current = null;
    setE(null);
  }, []);
  const retryWithAgent = v.useCallback(async () => {
    const rRef_current = rRef.current;
    if (!(nRef.current || !rRef_current)) {
      nRef.current = true;
      try {
        if (!(await n9())) {
          return;
        }
        iRef.current = false;
        await rRef_current();
        if (!iRef.current) {
          close();
        }
      } finally {
        nRef.current = false;
      }
    }
  }, [close]);
  v.useEffect(() => {
    if (!e) {
      return;
    }
    const l = () => {
      retryWithAgent();
    };
    l();
    const c = window.setInterval(l, d3);
    return () => window.clearInterval(c);
  }, [e, retryWithAgent]);
  return {
    view: e,
    setView: setE,
    open,
    close,
    retryWithAgent,
  };
}
export { useF3 as f3 };
