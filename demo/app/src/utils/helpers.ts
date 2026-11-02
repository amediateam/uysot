// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (2)
const h$ = "+998";
export const vt = {
  deleteNotNumbers: (e, t) => {
    if (parseInt(e.replace(/\D/g, ""), 10)) {
      return Number(e.replace(/\D/g, ""));
    }
    return t;
  },
  deleteSpace: (e) => e.replace(/\s/g, ""),
  parseFloatStringToNumber: (e) => {
    e = e.replace(/\s/g, "").replace(/,/g, ".");
    return Number(e);
  },
  clientPhoneToUser: (e) => e.slice(4, e.length),
  clientPhoneToUser1: (e, t) => e.replace(t, ""),
  clientPhoneToServer: (e) => h$ + e,
  clientPhoneToServer1: (e, t) => e + t,
  deleteNotNumbersAndParseFloatNumber: (e) => {
    if (e) {
      let t = e.replace(/[^\d.,]/g, "").replaceAll(/,/g, ".");
      const r = t.split(".");
      if (r.length === 1) {
        t = t ? (+t).toLocaleString("ru") : "";
      } else if (r.length === 2) {
        t = t ? `${(+r[0]).toLocaleString("ru")},${r[1]?.slice(0, 2)}` : "";
      } else {
        t = t ? `${(+r[0]).toLocaleString("ru")},${r[1]}` : "";
      }
      return {
        number: Number(t.replaceAll(/\s/g, "").replaceAll(/,/g, ".")),
        string: t,
      };
    }
    return {
      number: 0,
      string: "0",
    };
  },
  deleteNotNumbersAndParseFloatSmallNumber: (e) => {
    let t = e.replace(/[^\d.,]/g, "").replaceAll(/,/g, ".");
    const r = t.split(".");
    if (r.length === 1) {
      t = t ? (+t).toLocaleString("ru") : "";
    } else if (r.length === 2) {
      t = t ? `${(+r[0]).toLocaleString("ru")},${r[1]?.slice(0, 7)}` : "";
    } else {
      t = t ? `${(+r[0]).toLocaleString("ru")},${r[1]}` : "";
    }
    return {
      number: Number(t.replaceAll(/\s/g, "").replaceAll(/,/g, ".")),
      string: t,
    };
  },
  localeStringSmallNumbers: (e) => {
    const t = String(e).split(".");
    let r = Number(t[0] || "0").toLocaleString("ru");
    if (t[1]) {
      r += `,${t[1]}`;
    }
    return r;
  },
  deleteNotNumbersToNumber: (e, t) => {
    let r = e.replace(/[^\d.,]/g, "").replaceAll(/,/g, ".");
    const n = r.split(".");
    if (n.length === 1) {
      r = r || "";
    } else if (n.length === 2) {
      r = r ? `${+n[0]},${n[1]?.slice(0, t || 2)}` : "";
    } else {
      r = r ? `${+n[0]},${n[1]}` : "";
    }
    return {
      number: Number(r.replaceAll(/\s/g, "").replaceAll(/,/g, ".")),
      string: r,
    };
  },
  NumberInt: (e) => {
    let t = e.replace(/[^\d.,]/g, "").replaceAll(/,/g, ".");
    const r = t.split(".");
    if (r.length === 1) {
      t = t || "";
    } else if (r.length === 2) {
      t = t ? `${+r[0]},${r[1]?.slice(0, 2)}` : "";
    } else {
      t = t ? `${+r[0]},${r[1]}` : "";
    }
    return {
      number: Number(t),
      string: t,
    };
  },
};
