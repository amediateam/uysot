// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (4)
if (typeof Object.hasOwn !== "function") {
  Object.defineProperty(Object, "hasOwn", {
    value: (e, t) => Object.prototype.hasOwnProperty.call(Object(e), t),
    configurable: true,
    writable: true,
  });
}
function yb(e, t) {
  if (typeof Array.prototype[e] !== "function") {
    Object.defineProperty(Array.prototype, e, {
      value(r, n) {
        for (let i = this.length - 1; i >= 0; i -= 1) {
          if (r.call(n, this[i], i, this)) {
            return t(i, this[i]);
          }
        }
        if (e === "findLast") {
          return undefined;
        }
        return -1;
      },
      configurable: true,
      writable: true,
    });
  }
}
yb("findLast", (e, t) => t);
yb("findLastIndex", (e) => e);
