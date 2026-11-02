// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (12)
const Ih = "[Filtered]";
const U$ = 8;
const H$ =
  /pass(word|code)?|secret|token|otp|(^|[^a-z])pin([^a-z]|$)|credential|authorization|api[-_]?key|private[-_]?key/i;
const z$ =
  /("(?:[^"\\]|\\.)*(?:pass(?:word|code)?|secret|token|otp|credential|authorization|api[-_]?key)(?:[^"\\]|\\.)*"\s*:\s*)(?:"(?:[^"\\]|\\.)*"|null|true|false|-?\d+(?:\.\d+)?)/gi;
const W$ =
  /([?&;]|^)([^=&;]*(?:pass(?:word|code)?|secret|token|otp|credential|api[-_]?key)[^=&;]*)=[^&;]*/gi;
const q$ = (e) => H$.test(e);
const TC = (e) => e.replace(z$, `$1"${Ih}"`).replace(W$, `$1$2=${Ih}`);
const RC = (e) =>
  typeof e === "object" &&
  e !== null &&
  (Object.getPrototypeOf(e) === Object.prototype || Object.getPrototypeOf(e) === null);
const Ei = (e, t = 0) => {
  if (t > U$) {
    return e;
  }
  if (Array.isArray(e)) {
    return e.map((n) => Ei(n, t + 1));
  }
  if (!RC(e)) {
    return e;
  }
  const r = {};
  for (const n of Object.keys(e)) {
    const i = e[n];
    if (q$(n)) {
      r[n] = i == null ? i : Ih;
    } else if (typeof i === "string") {
      r[n] = TC(i);
    } else {
      r[n] = Ei(i, t + 1);
    }
  }
  return r;
};
const Fo = (e) => {
  if (e == null) {
    return e;
  }
  if (typeof e === "string") {
    try {
      const t = JSON.parse(e);
      if (RC(t) || Array.isArray(t)) {
        return JSON.stringify(Ei(t));
      }
    } catch {}
    return TC(e);
  }
  return Ei(e);
};
const Rz = (e) => {
  if (e.contexts) {
    e.contexts = Ei(e.contexts);
  }
  if (e.extra) {
    e.extra = Ei(e.extra);
  }
  if (e.request?.data) {
    e.request.data = Fo(e.request.data);
  }
  if (e.breadcrumbs) {
    e.breadcrumbs = e.breadcrumbs.map((t) => {
      if (t?.data) {
        return {
          ...t,
          data: Ei(t.data),
        };
      }
      return t;
    });
  }
  return e;
};
const G$ = "__SET_STORE__";
export { Fo, G$, Rz };
