// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (20)
const cL = "uysot:chunk-recovery";
const bh = "uysot:chunk-recovery-url";
const uL = new RegExp(
  [
    "Loading (?:CSS )?chunk [\\w-]+ failed",
    "Failed to fetch dynamically imported module",
    "error loading dynamically imported module",
    "Importing a module script failed",
    "Unable to preload CSS",
    "expected a JavaScript(?:-or-Wasm)? module script",
    "'text/html' is not a valid JavaScript MIME type",
    "SyntaxError: (?!.*JSON)(?:.*: )?(?:Invalid or unexpected token|Unexpected (?:string|identifier|number|end of input|token))",
  ].join("|"),
  "i"
);
const Sh = [];
function mz() {
  return Sh.splice(0, Sh.length);
}
function Eh(e) {
  if (!e) {
    return false;
  }
  let t;
  if (typeof e === "string") {
    t = e;
  } else if (e instanceof Error) {
    t = `${e.name}: ${e.message}`;
  } else {
    t = String(e?.message ?? "");
  }
  return uL.test(t);
}
let _C = false;
function dL(e) {
  let t = "";
  if (typeof e === "string") {
    t = e;
  } else if (e instanceof Error) {
    t = e.message;
  }
  const r = t.match(/https?:\/\/[^\s'"]+?\.(?:js|css)/);
  if (r) {
    try {
      const n = new URL(r[0]);
      if (n.origin === window.location.origin && n.pathname.startsWith("/assets/")) {
        return n.href;
      }
      return undefined;
    } catch {
      return;
    }
  }
}
function fL() {
  return Array.from(document.head.querySelectorAll('link[rel="modulepreload"]'))
    .map((e) => e.href)
    .filter((e) => {
      try {
        const t = new URL(e);
        return t.origin === window.location.origin && t.pathname.startsWith("/assets/");
      } catch {
        return false;
      }
    });
}
function Ch(e, t) {
  _C = true;
  Sh.push(e);
  const r = dL(t);
  const n = r ? [r] : fL();
  if (n.length) {
    try {
      sessionStorage.setItem(bh, JSON.stringify(n));
    } catch {}
  }
  return window.__uysotChunkRecover?.(e) ?? false;
}
function hL(e) {
  const t = (r) =>
    fetch(r, {
      cache: "reload",
    });
  return t(e)
    .then((r) => {
      if (r.ok) {
        return r.text();
      }
      return "";
    })
    .then((r) => {
      const n = new Set();
      for (const i of r.matchAll(/["']\.\/([A-Za-z0-9._-]+\.(?:js|css))["']/g)) {
        n.add(i[1]);
      }
      return Promise.all([...n].map((i) => t(new URL(i, e).href).catch(() => {})));
    })
    .catch(() => {});
}
function pL() {
  let e = [];
  try {
    const t = sessionStorage.getItem(bh);
    sessionStorage.removeItem(bh);
    if (t) {
      e = t.startsWith("[") ? JSON.parse(t) : [t];
    }
  } catch {}
  e.forEach((t) => {
    hL(t);
  });
}
const vL = 20000;
function yz() {
  if (typeof window !== "undefined") {
    window.setTimeout(() => {
      if (!_C) {
        try {
          sessionStorage.removeItem(cL);
        } catch {}
      }
    }, vL);
  }
}
function gL(payload) {
  if (payload instanceof Error) {
    return payload.message.slice(0, 120);
  }
  return "unknown";
}
let Sy = false;
function mL() {
  if (!(Sy || typeof window === "undefined")) {
    Sy = true;
    pL();
    window.addEventListener("vite:preloadError", ({ payload }) => {
      if (Eh(payload)) {
        Ch(`preload:${gL(payload)}`, payload);
      }
    });
    window.addEventListener("unhandledrejection", (e) => {
      if (Eh(e.reason) && Ch("unhandledrejection", e.reason)) {
        e.preventDefault();
      }
    });
  }
}
function yL(e) {
  const t = [
    "ErrorBoundary",
    "withRouter",
    "WrappedWith",
    "Suspense",
    "Router",
    "Provider",
    "Connect",
    "Unknown",
  ];
  for (const n of e.split(`
`)) {
    const i = n.match(/(?:in|at)\s+([A-Za-z0-9_$.]+)/);
    if (!i) {
      continue;
    }
    const a = i[1];
    if (!t.some((o) => a.startsWith(o))) {
      return a;
    }
  }
  const r = e.match(/(?:in|at)\s+([A-Za-z0-9_$.]+)/);
  if (r) {
    return r[1];
  }
  return "Unknown";
}
function _L(e) {
  if (!(e instanceof Error)) {
    return false;
  }
  const t = e.name === "NotFoundError" || e?.code === 8;
  const r = /removeChild|insertBefore|replaceChild|appendChild/.test(e.message || "");
  return t && r;
}
function bL(e) {
  if (!e?.stack) {
    return "unknown";
  }
  for (const t of e.stack
    .split(
      `
`
    )
    .slice(1)) {
    const r = t.trim().match(/:(\d+):(\d+)\)?$/);
    if (r) {
      return `${r[1]}:${r[2]}`;
    }
  }
  return "unknown";
}
export { Ch, Eh, _L, bL, mL, mz, yL, yz };
