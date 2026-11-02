// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (1)
function p$(e) {
  let t = "";
  const r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const r_length = r.length;
  let i = 0;
  while (i < e) {
    t += r.charAt(Math.floor(Math.random() * r_length));
    i += 1;
  }
  return t;
}
export { p$ };
