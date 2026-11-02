// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (7)
let Do = null;
let Cd = null;
function yC() {
  if (Do) {
    return Promise.resolve(Do);
  }
  return (
    Cd ||
      (Cd = import("@sentry/react")
        .then((e) => {
          Do = e;
          return e;
        })
        .catch(() => null)),
    Cd
  );
}
function gz(e) {
  Do = e;
}
function oL(...e) {
  Do?.addBreadcrumb(...e);
}
function sL(...e) {
  yC().then((t) => t?.captureException(...e));
}
function lL(e) {
  yC().then((t) => t?.withScope((r) => e(r, t)));
}
export { gz, lL, oL, sL };
