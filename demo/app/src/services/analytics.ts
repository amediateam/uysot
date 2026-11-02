// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
const Gc = (e, t) => {
  import("@amplitude/analytics-browser").then((r) => {
    r.track(e, t);
  });
};
const i0 = (e) => {
  Gc("recaptcha_failed", e ?? {});
};
const hq = () => {
  Gc("password_restored", {});
};
export { Gc, hq, i0 };
