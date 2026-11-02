// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (2)
import { ce } from "@/utils/storage";
import { Ar } from "@/constants/storage-keys";
function j$(e) {
  try {
    const t = e.split(".")[1];
    if (!t) {
      return null;
    }
    const r = atob(t.replace(/-/g, "+").replace(/_/g, "/"));
    const n = decodeURIComponent(
      r
        .split("")
        .map((i) => `%${`00${i.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(n);
  } catch {
    return null;
  }
}
function B$() {
  const e = ce.get(Ar);
  if (e) {
    return !!j$(e)?.ssid;
  }
  return false;
}
export { B$ };
