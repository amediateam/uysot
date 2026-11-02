// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (5)
import { G$ } from "@/services/sentry-scrub";
let Ah = null;
const Y$ = (e) => {
  if (!Ah) {
    Ah = e;
  }
};
const K$ = () => Ah;
const X$ = (e) => (t, r) => {
  if (r.type === G$) {
    return r.payload;
  }
  return e(t, r);
};
const J$ = (e) => {
  import("@amplitude/analytics-browser").then((t) => {
    t.track("slow-query", e);
  });
};
export { J$, K$, X$, Y$ };
