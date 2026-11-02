// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: shell-init-BgJqmgkc (82)
import ne from "i18next";
import {
  getActiveSpan,
  spanToJSON,
  getRootSpan,
  getClient,
  makeFetchTransport,
  browserTracingIntegration,
  setTags,
  setUser,
  addIntegration,
  replayIntegration,
  init,
  breadcrumbsIntegration,
  addBreadcrumb,
} from "@sentry/react";
import * as te from "@sentry/react";
import { Q7, Ene } from "@/services/desktop-agent";
import { Tt } from "@/utils/current-user";
import { iz } from "@/main";
import { gz } from "@/services/sentry";
import { yz, mz } from "@/bootstrap/chunk-recovery";
import {
  init as init_1,
  setUserId,
  setGroup,
  Identify,
  identify,
} from "@amplitude/analytics-browser";
import { Rz } from "@/services/sentry-scrub";
const version = "1.329.0";
const E = {
  version,
};
function oe(e) {
  let t = false;
  const n = () => {
    if (!t) {
      t = true;
      window.removeEventListener("pointerdown", n);
      window.removeEventListener("keydown", n);
      e();
    }
  };
  window.addEventListener("pointerdown", n, {
    once: true,
    passive: true,
  });
  window.addEventListener("keydown", n, {
    once: true,
  });
  return () => {
    window.removeEventListener("pointerdown", n);
    window.removeEventListener("keydown", n);
  };
}
let h = null;
function re() {
  if (!h) {
    h = import("@formbricks/js").then(async ({ default: _default }) => {
      await _default.setup({
        environmentId: "cmowjjrvpee2jzp01yn3zqhht",
        appUrl: "https://app.formbricks.com",
      });
      return _default;
    });
  }
  return h;
}
async function ie(e) {
  const t = ne.language || "uz";
  await e.setLanguage(t);
}
function se() {
  if (typeof window !== "undefined") {
    oe(() => {
      re()
        .then(ie)
        .catch(() => {});
    });
  }
}
const ce = ".ant-modal-wrap, .ant-drawer-open";
const le = "#formbricks-modal-container";
const S = (e) => e instanceof Element && !e.closest(le) && !!e.closest(ce);
const T = (e) => {
  if (S(e.target) || S(e.relatedTarget)) {
    e.stopPropagation();
  }
};
let _ = false;
function ue() {
  if (!(_ || typeof window === "undefined")) {
    _ = true;
    document.addEventListener("focusin", T, false);
    document.addEventListener("focusout", T, false);
  }
}
function de(e) {
  const t = e.exception?.values?.flatMap((n) => n.stacktrace?.frames ?? []) ?? [];
  if (t.length) {
    return t.every((n) => {
      const a = n.filename ?? n.abs_path ?? "";
      return !a || a === "<anonymous>" || a === "[native code]";
    });
  }
  return false;
}
const me = new Set();
const pe = () => me.size;
const ge = [
  "404",
  "access",
  "account",
  "account-numbers",
  "action",
  "active",
  "activity-logs",
  "ad-accounts",
  "additional-payment",
  "address",
  "admin",
  "ai",
  "ai-agent",
  "ai-asistent",
  "ai-autofill",
  "ai-credit",
  "ai-task-config",
  "all",
  "all-by-permission",
  "all-check",
  "all-files",
  "all-not-printed",
  "amo-crm",
  "amo-crm-config",
  "analytic",
  "app-pipe",
  "application",
  "arrearage",
  "asterisk-config",
  "atmos",
  "attach-client",
  "audio",
  "audio-analyse",
  "auth",
  "authorize",
  "authorize-url",
  "auto-query-generation",
  "auto-select",
  "auto-task-setting",
  "automatic-payment",
  "availability",
  "available",
  "balance",
  "basic",
  "batch",
  "bdm",
  "beta",
  "bi-analytics",
  "blank",
  "block",
  "block-statistic",
  "booking",
  "booking-delay",
  "booking-lead-flat",
  "boss",
  "bot-info",
  "bot-interface",
  "branch",
  "branch-config",
  "broker",
  "builder",
  "builder-config",
  "building",
  "bulk",
  "by",
  "by-employee",
  "by-lead",
  "call",
  "call-analyse",
  "call-analyze",
  "call-handling",
  "call-history",
  "call-history-types",
  "call-record",
  "call-summary",
  "call-trigger",
  "callback",
  "calls",
  "camera",
  "campaign",
  "campaign-performance",
  "can-make-call",
  "cancel",
  "cancel-client",
  "cancel-payment",
  "card",
  "cards",
  "cause",
  "cell-rows",
  "change-password",
  "change-step",
  "changes",
  "channel",
  "channels",
  "chat",
  "chat-flow",
  "chat-message",
  "check",
  "city",
  "clear",
  "clear-all",
  "click",
  "client",
  "client-balance",
  "client-event",
  "client-info",
  "client-message-temp",
  "client-required-fields",
  "close",
  "code",
  "column",
  "columns",
  "comment",
  "commercial-template",
  "compact",
  "compact-payment",
  "company",
  "company-config",
  "company-payment",
  "company-realtor",
  "company-role",
  "complex",
  "config",
  "confirm",
  "confirm-report",
  "connect-url",
  "consent",
  "construction",
  "constructor",
  "contact",
  "contract",
  "contract-approval",
  "contract-booking",
  "contract-fields",
  "contract-number-pattern-value",
  "contract-order",
  "contract-payment-type",
  "contract-visibility",
  "contracts",
  "control-permissions",
  "conversation",
  "conversation-analysis",
  "conversion",
  "conversion-funnel",
  "count",
  "count-contract-lead",
  "count-own-other",
  "country",
  "coverage",
  "create",
  "create-order",
  "create-payment",
  "credit",
  "crm",
  "crm-employee",
  "crm-role",
  "crm-settings",
  "crm-view",
  "currency",
  "current-user",
  "custom-field",
  "custom-template",
  "customer-flow",
  "daily",
  "daily-task-count",
  "dashboard",
  "dashboard-id",
  "data",
  "dataset",
  "date",
  "debt",
  "deed",
  "default-create",
  "default-create-lead",
  "delay",
  "department",
  "desktop-agent",
  "developer",
  "device",
  "dialog",
  "disable-check",
  "disconnect",
  "discount",
  "discount-calculator",
  "discount-settings",
  "dl",
  "document-template",
  "draft",
  "duplicate",
  "duplicate-control",
  "dynamic-price",
  "dynamic-pricing",
  "embed",
  "embed-widget",
  "embedded",
  "embedded-pages",
  "employee",
  "employee-config",
  "employees",
  "employees-and-groups",
  "enable",
  "enabled",
  "event-list",
  "events",
  "events-list",
  "excel",
  "excel-constructor",
  "execute",
  "expected",
  "expired",
  "expo",
  "export",
  "extra",
  "facebook",
  "failed",
  "failed-lead-stat",
  "field",
  "fields",
  "files",
  "filter",
  "filter-calendar",
  "filter-fields",
  "filter-params",
  "filter-targets",
  "flat",
  "flat-contract-info",
  "flat-contract-payment-info",
  "flat-data",
  "flat-status",
  "for-select",
  "force-attach",
  "force-attach-client",
  "force-lead-client",
  "form",
  "form-lead",
  "form-performance",
  "form-report",
  "formality",
  "format",
  "funnel-config",
  "gallery",
  "generate",
  "generate-token",
  "global-duplicate-control",
  "google-sheets",
  "graph",
  "graphic",
  "group",
  "group-action",
  "group-fields",
  "grouped",
  "groups",
  "hear",
  "history",
  "home",
  "house",
  "house-building",
  "house-config",
  "house-info",
  "houses",
  "iframe",
  "ignore-leads",
  "import",
  "import-example",
  "in-date",
  "indebtedness",
  "instagram",
  "installation",
  "integration",
  "integration-config",
  "interface",
  "interface-config",
  "inviting-client",
  "invoice",
  "job",
  "juridical",
  "kpi",
  "kpi-config",
  "lead",
  "lead-and-client-cost",
  "lead-attach",
  "lead-channel",
  "lead-distribution",
  "lead-form",
  "lead-ids",
  "lead-intake-log",
  "lead-not-task-conf",
  "lead-note",
  "lead-setting",
  "lead-table",
  "lead-task",
  "lead-task-type",
  "lead_client_auto_config",
  "leaderboard",
  "leads",
  "leads-market",
  "level",
  "license-message",
  "link",
  "links",
  "list",
  "live",
  "login",
  "logout",
  "lost-revenue",
  "main",
  "make-call",
  "manager-trigger",
  "mandatory-assignment",
  "map-view",
  "map-view-config",
  "market-place",
  "market-place-config",
  "marketing",
  "marketplace-available",
  "marketplace-booking-config",
  "me",
  "medias-filter",
  "memory",
  "mening-uyim",
  "mening-uyim-statistics",
  "message",
  "message-system",
  "meta",
  "meta-ads",
  "meta-conversion",
  "meta-trigger",
  "metrics",
  "missing-ads",
  "mobile",
  "moi-zvonki-send-request",
  "monetary",
  "month",
  "monthly",
  "monthly-payment",
  "more",
  "mortgage",
  "mortgage-calculator",
  "mute",
  "my-not-read",
  "natural",
  "new-client",
  "new-payment",
  "news-post-schedule",
  "nikita",
  "note",
  "notification",
  "notification-config",
  "number",
  "numeration-template",
  "oauth",
  "offer",
  "on-time",
  "one",
  "onec-config",
  "online-contract",
  "online-paymnet",
  "online-pbx",
  "open-api",
  "openbank",
  "order",
  "originator",
  "originators",
  "pages",
  "params",
  "partners",
  "paylov",
  "payment",
  "payment-billing",
  "payment-imports",
  "payment-ways",
  "pbx-callback-trigger",
  "pending",
  "permission",
  "permission-state",
  "pipe",
  "pipe-setting",
  "pipe-status",
  "pipe-status-trigger",
  "pipe-status-triggers",
  "pipes",
  "plan",
  "plan-fact",
  "plan-fact-pipe",
  "posts-filter",
  "power-bi",
  "predictions",
  "prepayment",
  "prepayment-calculate",
  "price-per-area-stats",
  "priority",
  "privacy-policy",
  "profile",
  "progress-files",
  "purchase",
  "push-notification",
  "qr",
  "rate",
  "ratio",
  "read",
  "read-all",
  "realtor",
  "realtor-action",
  "realtor-booking",
  "reason",
  "reasons-for-refusal",
  "reconnect-url",
  "recovering-deleted",
  "redirect-url",
  "referral-cashback",
  "refresh",
  "refresh-key",
  "reminder-payments",
  "remote-payment",
  "remote-session",
  "reorder",
  "report",
  "report-table",
  "reports",
  "required-customer",
  "required-fields",
  "resale",
  "reserved",
  "resolve",
  "restore-password",
  "result",
  "results",
  "retry-missing",
  "revenue-share",
  "robot-call",
  "rule",
  "sale",
  "sale-crm-tag",
  "sale-plan",
  "sale-stats",
  "sap",
  "save",
  "save-group",
  "schedule-lottotron",
  "script",
  "search",
  "search-all-duplicate",
  "search-client",
  "search-key",
  "section",
  "security",
  "send",
  "send-message",
  "send-messages",
  "send-sms",
  "sending-message",
  "service",
  "session",
  "set-employee",
  "setting",
  "share",
  "shaxmatka",
  "shaxmatka-plus",
  "shourum",
  "showroom",
  "sipuni-config",
  "skill",
  "smart-button",
  "smart-catalog",
  "smc-c",
  "sms",
  "sms-bot",
  "sms-system-conf",
  "sms-triggers",
  "sold",
  "sources",
  "stage",
  "start",
  "stat",
  "stat-sales",
  "statistics",
  "stats",
  "status",
  "stream",
  "stt",
  "success",
  "success-lead",
  "success-lead-stat",
  "suggested-questions",
  "suggestion",
  "suggestion-lead",
  "sum",
  "summary",
  "summary-insight",
  "support-access",
  "surcharge",
  "table",
  "table-filter",
  "table-payment",
  "tag",
  "tags",
  "targets",
  "tariff-request",
  "tariffs",
  "task",
  "task-trigger",
  "task-type",
  "task-view",
  "tasks",
  "telegram",
  "telegram-bot-config",
  "telegram-chat-bot",
  "telegram-report",
  "telegram-report-bot",
  "template",
  "templates",
  "templates-message",
  "term-discount",
  "terminals",
  "terminate",
  "test",
  "tiktok",
  "time-dynamics",
  "tjm-catalog",
  "token",
  "token-price",
  "token-purchase",
  "tools",
  "transcribe",
  "transfer",
  "transfer-to-department",
  "triggers",
  "upcoming",
  "update",
  "update-table",
  "upload-audio",
  "url",
  "user",
  "users",
  "utel",
  "uyqur",
  "v1",
  "v2",
  "v3",
  "variation",
  "variation-group",
  "view",
  "visual",
  "voice",
  "waiting",
  "wazzup",
  "wazzup-config",
  "web-site",
  "web-site-config",
  "webhook-events",
  "website",
  "welcome",
  "widget",
  "widget-config",
  "widget-targets",
  "with-date",
  "x-auth-token",
  "year-summary",
  "yeastar",
];
const fe = new Set(ge);
function p(pathname) {
  return (
    pathname
      .split("/")
      .map((n) => {
        if (!n || fe.has(n)) {
          return n;
        }
        return ":id";
      })
      .join("/")
      .replace(/\/+$/, "") || "/"
  );
}
const R = 100;
const he = 1000;
const ye = 40;
const be = 12;
const we = 8;
const N = 200;
const ke = 1000;
const O = new Set(["http.client", "ui.query"]);
const g = new WeakMap();
let m = null;
const y = "data-sentry-component";
const ve = "data-sentry-source-file";
const Ee = [
  "button",
  "a",
  "input",
  "select",
  "textarea",
  "label",
  '[role="button"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="checkbox"]',
  '[role="switch"]',
  '[role="radio"]',
  ".ant-select",
  ".ant-picker",
  ".ant-switch",
  ".ant-upload",
  ".ant-tabs-tab",
  ".ant-menu-item",
  ".ant-dropdown-menu-item",
  ".ant-pagination-item",
  ".ant-checkbox-wrapper",
  ".ant-radio-wrapper",
  ".ant-table-row",
  "tr",
].join(",");
const A = [
  "button",
  '[role="button"]',
  '[role="tab"]',
  '[role="menuitem"]',
  ".ant-btn",
  ".ant-tabs-tab",
  ".ant-menu-item",
  ".ant-dropdown-menu-item",
  ".ant-pagination-item",
].join(",");
const Se = [
  [".ant-select-dropdown", "select-dropdown"],
  [".ant-dropdown", "dropdown"],
  [".ant-popover", "popover"],
  [".ant-modal", "modal"],
  [".ant-drawer", "drawer"],
  [".ant-table", "table"],
  ["form", "form"],
  [".ant-layout-sider, nav", "sidebar"],
  ["header, .ant-layout-header", "header"],
];
let s = null;
let u = false;
const b = (e) => e.replace(/\s+/g, " ").trim().replace(/\d/g, "#").slice(0, ye);
function w(e) {
  const t = e.querySelector("[data-icon], .anticon");
  const n = t?.getAttribute("data-icon");
  if (n) {
    return `icon:${n}`;
  }
  const a = [...(t?.classList ?? [])].find((o) => o.startsWith("anticon-"));
  if (a) {
    return `icon:${a.replace("anticon-", "")}`;
  }
  return "";
}
const Te =
  "table, .ant-table, .ant-list, .ant-select-dropdown, .ant-card, .ant-descriptions, .ant-tree";
function _e(e) {
  if (e.closest(Te)) {
    return w(e) || (e.matches(A) ? "button" : "");
  }
  const t = e.getAttribute("aria-label") || e.getAttribute("title");
  if (t) {
    return b(t);
  }
  if (e.matches(A)) {
    return b(e.textContent ?? "") || w(e);
  }
  if (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) {
    return b(e.placeholder || e.name || e.type);
  }
  if (e instanceof HTMLAnchorElement && e.href) {
    try {
      return `link:${p(new URL(e.href, window.location.href).pathname)}`;
    } catch {
      return "link";
    }
  }
  return w(e);
}
const Ae = (e) =>
  [...e.classList].filter(
    (t) => (t.startsWith("ant-") && !/\d/.test(t)) || /^_[A-Za-z]\w*_[a-z0-9]{5}_\d+$/.test(t)
  );
function M(e) {
  const t = e.getAttribute("data-testid");
  return `${e.tagName.toLowerCase()}${t ? `[data-testid="${t}"]` : ""}${Ae(e)
    .slice(0, 3)
    .map((n) => `.${n}`)
    .join("")}`;
}
function Ce(e) {
  const n = (e.parentElement ? [...e.parentElement.children] : []).filter(
    (a) => a.tagName === e.tagName
  );
  if (n.length > 1) {
    return `:nth-of-type(${n.indexOf(e) + 1})`;
  }
  return "";
}
function Le(e) {
  const t = [];
  let n = e;
  while (n && n !== document.body && t.length < we) {
    t.unshift(`${M(n)}${Ce(n)}`);
    n = n.parentElement;
  }
  return t.join(" > ");
}
function Ie(e) {
  const names = [];
  const files = [];
  let a = e.closest(`[${y}]`);
  while (a && names.length < be) {
    const o = a.getAttribute(y) ?? "";
    if (names[0] !== o) {
      names.unshift(o);
      files.unshift(a.getAttribute(ve) ?? "");
    }
    a = a.parentElement?.closest(`[${y}]`) ?? null;
  }
  return {
    names,
    files,
  };
}
function Re(target) {
  const t = target.closest(Ee) ?? target;
  const container = Se.find(([o]) => t.closest(o))?.[1] ?? "page";
  const a = Ie(t);
  return {
    label: _e(t) || t.tagName.toLowerCase(),
    tag: t.tagName.toLowerCase(),
    role: t.getAttribute("role") ?? "",
    selector: M(t),
    container,
    component: a.names[a.names.length - 1] ?? "",
    sourceFile: a.files[a.files.length - 1] ?? "",
    componentTree: a.names.join(" > "),
    sourceTree: a.files.join(" > "),
    domPath: Le(t),
  };
}
function Ne() {
  const e = getActiveSpan();
  if (e) {
    return spanToJSON(getRootSpan(e)).op;
  }
}
function Oe(e) {
  if (e.target instanceof Element) {
    try {
      s = {
        time: performance.now(),
        info: Re(e.target),
      };
      const t = Ne();
      u = t !== "pageload" && t !== "navigation";
      window.setTimeout(() => {
        u = false;
      }, 0);
    } catch {
      s = null;
      u = false;
    }
  }
}
function Me() {
  if (u) {
    return (u = false), true;
  }
  return false;
}
function C(e, info) {
  return {
    [`${e}.label`]: info.label,
    [`${e}.tag`]: info.tag,
    [`${e}.role`]: info.role,
    [`${e}.selector`]: info.selector,
    [`${e}.container`]: info.container,
    [`${e}.component`]: info.component,
    [`${e}.source_file`]: info.sourceFile,
    [`${e}.component_tree`]: info.componentTree,
    [`${e}.source_tree`]: info.sourceTree,
    [`${e}.dom_path`]: info.domPath,
  };
}
function xe(e) {
  const { data, start_timestamp } = spanToJSON(e);
  const a = Number(data?.["ui.interaction.latency_ms"] ?? 0);
  const o = g.get(e);
  const r =
    o?.lastDataEnd && start_timestamp ? Math.round((o.lastDataEnd - start_timestamp) * 1000) : 0;
  e.setAttributes({
    "ui.action.data_ms": r,
    "ui.action.data_spans": o?.dataSpans ?? 0,
  });
  const f = a > N;
  const k = r > ke;
  if (f && k) {
    return "both";
  }
  if (f) {
    return "interaction";
  }
  if (k) {
    return "data";
  }
  return "none";
}
function $e(e) {
  const t = e.contexts?.trace;
  return t?.op === "ui.action.click" && t.data?.["ui.action.slow_reason"] === "none";
}
function Pe() {
  const { memory } = performance;
  return {
    "runtime.dom_nodes": document.getElementsByTagName("*").length,
    "runtime.queries_fetching": pe(),
    "runtime.tab_visible": document.visibilityState === "visible",
    ...(memory
      ? {
          "runtime.js_heap_mb": Math.round(memory.usedJSHeapSize / 1048576),
        }
      : {}),
  };
}
function ze() {
  const e = new WeakMap();
  try {
    new PerformanceObserver((n) => {
      const a = getActiveSpan();
      if (!a || !s) {
        return;
      }
      const o = getRootSpan(a);
      if (spanToJSON(o).op === "ui.action.click") {
        for (const r of n.getEntries()) {
          if (r.interactionId && r.startTime >= s.time - R && r.duration > (e.get(o) ?? -1)) {
            e.set(o, r.duration);
            o.setAttributes({
              "ui.interaction.latency_ms": Math.round(r.duration),
              "ui.interaction.input_delay_ms": Math.round(r.processingStart - r.startTime),
              "ui.interaction.processing_ms": Math.round(r.processingEnd - r.processingStart),
              "ui.interaction.presentation_ms": Math.round(
                r.startTime + r.duration - r.processingEnd
              ),
              "ui.interaction.slow": r.duration > N,
            });
          }
        }
      }
    }).observe({
      type: "event",
      durationThreshold: 16,
    });
  } catch {}
}
function De() {
  window.addEventListener("click", Oe, {
    capture: true,
    passive: true,
  });
}
function qe(e, t) {
  e.updateName(t);
  e.setAttribute("sentry.source", "custom");
}
function Fe(e) {
  const t = g.get(getRootSpan(e));
  if (t && O.has(spanToJSON(e).op ?? "")) {
    t.dataSpans += 1;
  }
}
function je(e) {
  const t = g.get(getRootSpan(e));
  if (!t) {
    return;
  }
  const { op, timestamp } = spanToJSON(e);
  if (timestamp && O.has(op ?? "")) {
    t.lastDataEnd = Math.max(t.lastDataEnd, timestamp);
  }
}
function Ue() {
  const e = m;
  m = null;
  if (e && !spanToJSON(e).timestamp) {
    e.setAttribute("ui.action.navigated", true);
    e.end();
  }
}
function He(e) {
  if (getRootSpan(e) !== e) {
    Fe(e);
    return;
  }
  if (!s) {
    return;
  }
  const { op } = spanToJSON(e);
  const n = performance.now() - s.time;
  const a = p(window.location.pathname);
  if (op === "ui.action.click" && n < R) {
    const { component, label } = s.info;
    g.set(e, {
      dataSpans: 0,
      lastDataEnd: 0,
    });
    m = e;
    e.setAttributes({
      ...C("ui.element", s.info),
      "ui.route": a,
    });
    qe(e, component ? `click: ${component} › ${label}` : `click: ${label}`);
  } else {
    if (op === "navigation" && n < he) {
      e.setAttributes(C("ui.trigger", s.info));
    }
  }
}
function Be(e) {
  if (getRootSpan(e) !== e) {
    je(e);
    return;
  }
  if (e === m) {
    m = null;
  }
  const { op } = spanToJSON(e);
  if (op === "ui.action.click") {
    const n = xe(e);
    e.setAttribute("ui.action.slow_reason", n);
    if (n === "none") {
      return;
    }
  }
  if (op === "pageload" || op === "navigation" || op === "ui.action.click") {
    e.setAttributes(Pe());
  }
}
function We() {
  const e = getClient();
  if (e) {
    e.on("spanStart", (t) => {
      try {
        He(t);
      } catch {}
    });
    e.on("spanEnd", (t) => {
      try {
        Be(t);
      } catch {}
    });
    ze();
  }
}
const Ge = ["app.uysot.uz", "www.app.uysot.uz", "app.uysot.com", "www.app.uysot.com"];
const dsn =
  "https://80db486cf45370fb749a413de2f40615@o4508640350306304.ingest.de.sentry.io/4508646119702609";
const Xe = () => Ge.includes(window.location.hostname);
const Ve = () => false;
const Qe = () => "production";
const d = () => Xe() || Ve();
function Ze() {
  return makeFetchTransport;
}
const Ye = ["/main/home", "/main/crm", "/main/contract", "/main/dashboard", "/boss"];
const et = 0.3;
const tt = 1;
function tracesSampler(e) {
  if (typeof e.parentSampled === "boolean") {
    return e.parentSampled;
  }
  const t = Me();
  if (!d()) {
    return 0;
  }
  if (t) {
    return tt;
  }
  const n = e.name.startsWith("/") ? e.name : p(window.location.pathname);
  if (Ye.some((a) => n.startsWith(a))) {
    return 1;
  }
  return et;
}
const at = [
  "amplitude.com",
  "posthog.com",
  "google-analytics.com",
  "googletagmanager.com",
  "formbricks.com",
  "featurebase.app",
  "fcmregistrations.googleapis.com",
  "firebaseinstallations.googleapis.com",
  "sentry.io",
];
const shouldCreateSpanForRequest = (e) => !at.some((t) => e.includes(t));
function rt() {
  return browserTracingIntegration({
    enableInp: true,
    enableLongTask: true,
    enableLongAnimationFrame: true,
    _experiments: {
      enableInteractions: true,
    },
    shouldCreateSpanForRequest,
    beforeStartSpan: (e) => {
      if (e.op === "navigation") {
        Ue();
      }
      return {
        ...e,
        name: p(window.location.pathname),
        attributes: {
          ...e.attributes,
          "sentry.source": "route",
        },
      };
    },
  });
}
const it = {
  tracesSampler,
  tracePropagationTargets: [/^\/(?!\/)/],
};
function st() {
  const e = navigator;
  setTags({
    platform: Q7() ? "desktop" : "web",
    "network.type": e.connection?.effectiveType ?? "unknown",
    "network.save_data": e.connection?.saveData ? "yes" : "no",
    "device.memory_gb": e.deviceMemory ?? "unknown",
    "device.cpu_cores": e.hardwareConcurrency ?? "unknown",
    "device.low_end":
      (e.hardwareConcurrency ?? 8) <= 4 || (e.deviceMemory ?? 8) <= 4 ? "yes" : "no",
    "device.mobile": /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? "yes" : "no",
  });
  if (Tt?.id) {
    setUser({
      id: String(Tt.id),
    });
    setTags({
      companyId: Tt.companyId ?? "unknown",
      company: Tt.companyName ?? "unknown",
      role: Tt.role?.lang?.uz ?? "unknown",
    });
  }
}
function ct() {
  const e = () => {
    try {
      addIntegration(
        replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        })
      );
    } catch {}
  };
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(e, {
      timeout: 5000,
    });
  } else {
    window.setTimeout(e, 2000);
  }
}
function lt() {
  if (d()) {
    return 0.1;
  }
  return 0;
}
export async function initShellRuntime() {
  iz();
  gz(te);
  yz();
  init_1("533104d090705cf9480b30882d50333e");
  await Ene();
  if (Tt?.id) {
    setUserId(`${Tt?.fullName} ${Tt?.id}`);
    if (Tt?.companyName) {
      setGroup("company", `${Tt?.companyName}-${Tt?.companyId}`);
    }
    const t = new Identify();
    t.set("id", Tt?.id)
      .set("companyId", Tt?.companyId)
      .set("name", Tt?.fullName)
      .set("role", Tt?.role?.lang?.uz)
      .set("username", Tt?.username)
      .set("platform", Q7() ? "DESKTOP" : "WEB")
      .set("version", "1.260.0");
    if (Tt?.companyName) {
      t.set("companyName", Tt?.companyName);
    }
    identify(t);
    ue();
    se();
  }
  const enabled = d();
  De();
  init({
    release: `uysot@${E.version}`,
    initialScope: {
      tags: {
        appVersion: E.version,
        platform: "web",
      },
    },
    dsn,
    enabled,
    transport: Ze(),
    environment: Qe(),
    integrations: [
      breadcrumbsIntegration({
        console: true,
        dom: true,
        history: true,
        fetch: false,
        xhr: false,
      }),
      rt(),
    ],
    beforeSend(t, n) {
      if (de(t)) {
        return null;
      }
      const n_originalException = n.originalException;
      const o =
        n_originalException instanceof Error ? n_originalException.message.toLowerCase() : "";
      if (
        (n_originalException instanceof Error &&
          (n_originalException.name === "NotFoundError" || n_originalException?.code === 8) &&
          /removeChild|insertBefore|replaceChild|appendChild/.test(
            n_originalException instanceof Error ? n_originalException.message : ""
          )) ||
        t?.tags?.domPortalRace === "true" ||
        !d() ||
        (t?.tags?.error_type !== "request_error" && t?.tags?.error_type !== "render_error")
      ) {
        return null;
      }
      return (
        (t.tags = {
          ...t.tags,
          area: o.includes("fetch") ? "network" : "ui",
          importance:
            o.includes("timeout") || o.includes("critical") || o.includes("failed")
              ? "high"
              : "low",
        }),
        (t.extra = {
          ...t.extra,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          language: navigator.language,
          onLine: navigator.onLine,
          userAgent: navigator.userAgent,
        }),
        Rz(t)
      );
    },
    denyUrls: [
      /node_modules/,
      /node_modules\/react-dom/i,
      /node_modules\/react/i,
      /extensions\//i,
      /chrome-extension:/i,
      /safari-extension:/i,
      /moz-extension:/i,
    ],
    replaysSessionSampleRate: lt(),
    replaysOnErrorSampleRate: enabled ? 1 : 0,
    ignoreErrors: [
      /AbortError/,
      /FirebaseError/,
      /Network Error/,
      /NotAllowedError/,
      /InvalidStateError/,
      /ResizeObserver loop limit exceeded/,
      /ResizeObserver loop completed with undelivered notifications/,
      "Non-Error promise rejection captured",
      "Object captured as promise rejection with keys",
      "AbortError: The play() request was interrupted by a call to pause()",
      "Large Render Blocking Asset",
      /Extension context invalidated/,
      /Failed to fetch/,
      /Load failed/,
      /NetworkError/,
      /The request is not allowed by the user agent/,
      /Hydration failed/,
      /Loading chunk \d+ failed/,
      /Loading CSS chunk \d+ failed/,
      /Failed to execute 'appendChild' on 'Node': (Invalid or unexpected token|Unexpected identifier)/,
      /$ is not defined/,
      /grecaptcha is not defined/,
      /The play() request was interrupted/,
      /The fetching process for the media resource/,
      /media resource indicated by the src attribute/,
      "Cannot read properties of null (reading 'removeEventListener')",
    ],
    sampleRate: 1,
    ...it,
    normalizeDepth: 10,
    normalizeMaxBreadth: 1000,
    maxValueLength: 5000,
    beforeSendTransaction(t) {
      if (!d() || $e(t)) {
        return null;
      }
      return (
        t.spans &&
          (t.spans = t.spans.filter(
            (n) =>
              !(
                n.op === "resource.script" &&
                n.description?.includes("/assets/app-") &&
                n.description?.includes(".js")
              )
          )),
        t
      );
    },
  });
  for (const message of mz()) {
    addBreadcrumb({
      category: "skew",
      level: "warning",
      message,
    });
  }
  st();
  We();
  ct();
}
