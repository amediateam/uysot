// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (1)
import { ce } from "@/utils/storage";
import { Ar, Zr, _b, sa } from "@/constants/storage-keys";
function V$() {
  ce.remove(Ar);
  ce.remove(Zr);
  ce.remove(_b);
  ce.remove(sa);
  window.location.replace(window.location.origin);
}
export { V$ };
