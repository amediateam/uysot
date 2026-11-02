// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (2)
import { CC, LF } from "@/utils/redirect-after-login";
function FF(e) {
  return e instanceof Error && e.message === CC;
}
function $F(e) {
  let t;
  const r = new Promise((resolve, reject) => {
    t = window.setTimeout(() => reject(new Error(CC)), LF);
  });
  return Promise.race([e.executeAsync(), r]).finally(() => window.clearTimeout(t));
}
export { $F, FF };
