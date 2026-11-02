// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: bg_new-yiMPkYGx (38)
import { t as t_1 } from "@/i18n/t";
import { useTranslation } from "react-i18next";
import * as K from "react";
const C = {
  SEND_VERIFY_CODE_ERROR: 2803,
  2803: "SEND_VERIFY_CODE_ERROR",
  VERIFY_CODE_INCORRECT: 2804,
  2804: "VERIFY_CODE_INCORRECT",
  RESET_TOO_MANY_REQUESTS: 2805,
  2805: "RESET_TOO_MANY_REQUESTS",
  RESET_TOO_MANY_ATTEMPTS: 2806,
  2806: "RESET_TOO_MANY_ATTEMPTS",
  RESET_TOKEN_INVALID: 2807,
  2807: "RESET_TOKEN_INVALID",
  RESET_PASSWORD_SAME_AS_OLD: 2808,
  2808: "RESET_PASSWORD_SAME_AS_OLD",
  INVALID_CAPTCHA: 3114,
  3114: "INVALID_CAPTCHA",
  PASSWORD_NOT_STRONG: 3118,
  3118: "PASSWORD_NOT_STRONG",
  BAD_REQUEST_CAPTCHA: 3705,
  3705: "BAD_REQUEST_CAPTCHA",
  SMS_CONFIGS_NOT_FOUND: 2514,
  2514: "SMS_CONFIGS_NOT_FOUND",
};
const y = (e, t, n) => {
  import("@amplitude/analytics-browser").then((l) => {
    l.track(e, t, n);
  });
};
const min = 12;
const b = 3;
const T = 4;
const max = 3;
const p = 3;
const W = 4;
const F = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
const H = [
  "mchj",
  "xususiy",
  "korxona",
  "oak",
  "llc",
  "ltd",
  "inc",
  "corp",
  "ooo",
  "ооо",
  "оао",
  "зао",
];
const s = {
  LENGTH: "LENGTH",
  UPPERCASE: "UPPERCASE",
  LOWERCASE: "LOWERCASE",
  DIGIT: "DIGIT",
  SPECIAL: "SPECIAL",
  NO_SEQUENCE: "NO_SEQUENCE",
  NO_REPEAT: "NO_REPEAT",
  NO_PERSONAL_DATA: "NO_PERSONAL_DATA",
};
const x = [
  {
    rule: "LENGTH",
    i18nKey: "profile.password_rule_length",
    defaultValue: "Kamida {{min}} ta belgi",
  },
  {
    rule: "UPPERCASE",
    i18nKey: "profile.password_rule_uppercase",
    defaultValue: "Kamida 1 ta katta harf (A-Z)",
  },
  {
    rule: "LOWERCASE",
    i18nKey: "profile.password_rule_lowercase",
    defaultValue: "Kamida 1 ta kichik harf (a-z)",
  },
  {
    rule: "DIGIT",
    i18nKey: "profile.password_rule_digit",
    defaultValue: "Kamida 1 ta raqam (0-9)",
  },
  {
    rule: "SPECIAL",
    i18nKey: "profile.password_rule_special",
    defaultValue: "Kamida 1 ta maxsus belgi (!@#$%^&* va h.k.)",
  },
  {
    rule: "NO_SEQUENCE",
    i18nKey: "profile.password_rule_no_sequence",
    defaultValue: "Ketma-ket belgilar bo'lmasligi (123, abc, qwer)",
  },
  {
    rule: "NO_REPEAT",
    i18nKey: "profile.password_rule_no_repeat",
    defaultValue: "Bir xil belgi {{max}} va undan ko'p marta takrorlanmasligi (aaa, 111)",
  },
  {
    rule: "NO_PERSONAL_DATA",
    i18nKey: "profile.password_rule_no_personal_data",
    defaultValue: "Ism, login, telefon raqam yoki kompaniya nomi qatnashmasligi",
  },
];
const q = {
  min,
  max,
};
const B = (e) => e.toLowerCase() !== e.toUpperCase();
const M = (e) => e >= "0" && e <= "9";
const _ = (e, t) => {
  const n = [];
  for (let l = 0; l + t <= e.length; l++) {
    n.push(e.slice(l, l + t));
  }
  return n;
};
const g = (e, t) => {
  for (let n = 1; n < e.length; n++) {
    if (e.charCodeAt(n) - e.charCodeAt(n - 1) !== t) {
      return false;
    }
  }
  return true;
};
const Q = (e) => {
  const t = e.split("").every(M);
  const n = /^[a-z]+$/.test(e);
  return (t || n) && (g(e, 1) || g(e, -1));
};
const Y = [...F, "1234567890"].flatMap((e) => [
  ..._(e, T),
  ..._(e.split("").reverse().join(""), T),
]);
const w = (e) => {
  const t = e.toLowerCase();
  return _(t, b).some(Q) || _(t, T).some((n) => Y.includes(n));
};
const z = (e) => {
  let t = 1;
  for (let n = 1; n < e.length; n++) {
    t = e[n] === e[n - 1] ? t + 1 : 1;
    if (t >= max) {
      return true;
    }
  }
  return false;
};
const h = (e) =>
  (e || "")
    .toLowerCase()
    .split(/[\s"'`«»“”‘’.,()\-_]+/)
    .filter((t) => t.length >= p);
const $ = (phone) =>
  (phone || "")
    .replace(/[\s+\-()]/g, "")
    .split(/\D+/)
    .flatMap((t) => _(t, W));
const Z = ({ fullName, username, phone, companyName }) => {
  const a = h(fullName).flatMap((r) => _(r, p));
  const i = h(companyName)
    .filter((r) => !H.includes(r))
    .flatMap((r) => _(r, p));
  const u = _((username || "").trim().toLowerCase(), p);
  return [...a, ...i, ...$(phone), ...u];
};
const X = (e, t = {}) => {
  const n = e.toLowerCase();
  return Z(t).some((l) => n.includes(l));
};
const O = (e = "", t = {}) => {
  const n = e.split("");
  const l = e.length === 0;
  return {
    LENGTH: e.length >= min,
    UPPERCASE: /[A-Z]/.test(e),
    LOWERCASE: /[a-z]/.test(e),
    DIGIT: /[0-9]/.test(e),
    SPECIAL: n.some((a) => !B(a) && !M(a) && a.trim() !== ""),
    NO_SEQUENCE: !l && !w(e),
    NO_REPEAT: !l && !z(e),
    NO_PERSONAL_DATA: !l && !X(e, t),
  };
};
const J = (checks) => Object.values(checks).every(Boolean);
const f = (e) => x.filter(({ rule }) => !e[rule]);
const ce = ({ flow, source, password, context }) => {
  if (!password) {
    return;
  }
  const a = f(O(password, context)).map(({ rule }) => rule);
  if (!(source === "client" && !a.length)) {
    y("password_policy_failed", {
      flow,
      source,
      failed_rules: a.length ? a : ["BACKEND_ONLY"],
      failed_rules_count: a.length,
    });
  }
};
const Ee = (flow) => {
  y("password_policy_passed", {
    flow,
  });
};
const E = {
  low: "#FF6565",
  middle: "#FFB400",
  strong_middle: "#6CE9A6",
  strong: "#1EB099",
};
const R = ({ i18nKey, defaultValue }) =>
  t_1(i18nKey, {
    defaultValue,
    ...q,
  });
const D = [
  {
    color: undefined,
    title: "profile.Ishonchsiz_parol",
  },
  {
    color: E.low,
    title: "profile.Ishonchsiz_parol",
  },
  {
    color: E.middle,
    title: "profile.Orta_ishonchli_parol",
  },
  {
    color: E.strong_middle,
    title: "profile.Orta_ishonchli_parol",
  },
  {
    color: E.strong,
    title: "profile.Ajoyib_Ishonchli_parol",
  },
];
const m = [s.LENGTH, s.UPPERCASE, s.LOWERCASE, s.DIGIT, s.SPECIAL];
const ee = [s.NO_SEQUENCE, s.NO_REPEAT, s.NO_PERSONAL_DATA];
const useUe = (e, t = {}) => {
  const { t: t_1 } = useTranslation();
  const { fullName, username, phone, companyName } = t;
  const r = K.useMemo(() => {
    const checks = O(e || "", {
      fullName,
      username,
      phone,
      companyName,
    });
    const isValid = J(checks);
    const length = m.filter((N) => checks[N]).length;
    const j = ee.some((N) => !checks[N]);
    let level = 1;
    if (e) {
      if (isValid) {
        level = 4;
      } else if (j) {
        level = 1;
      } else if (length === m.length - 1) {
        level = 3;
      } else if (length >= m.length - 2) {
        level = 2;
      }
    } else {
      level = 0;
    }
    return {
      checks,
      isValid,
      level,
      color: D[level].color,
    };
  }, [e, fullName, username, phone, companyName]);
  return {
    ...r,
    title: t_1(D[r.level].title),
  };
};
const Se = (e, t = false) => ({
  validator: (n, l) => {
    if (!l) {
      if (t) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(""));
    }
    const a = f(O(l, e));
    if (a.length) {
      return Promise.reject(new Error(R(a[0])));
    }
    return Promise.resolve();
  },
});
const Ae = (e, t, n = {}) => {
  const l = e?.response?.data?.errorMessage;
  if (l?.messageCode !== C.PASSWORD_NOT_STRONG) {
    return null;
  }
  const a = f(O(t, n));
  const i = t_1("global.PASSWORD_NOT_STRONG", {
    defaultValue: "Parol talablarga javob bermaydi!",
  });
  if (a.length) {
    return `${i} ${a.map(R).join("; ")}`;
  }
  return l?.message || i;
};
export { Ae, C, Ee, R, Se, ce, useUe as ue, x };
