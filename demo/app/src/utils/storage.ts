// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (1)
export const ce = {
  get(e) {
    const t = localStorage.getItem(e);
    try {
      if (t) {
        return JSON.parse(t);
      }
      return null;
    } catch {
      return t;
    }
  },
  set(e, t) {
    localStorage.setItem(e, t);
  },
  remove(e) {
    localStorage.removeItem(e);
  },
  clear() {
    localStorage.clear();
  },
};
