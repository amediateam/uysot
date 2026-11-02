// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (47)
import X_ from "posthog-js";
import xt from "i18next";
import { oL, lL } from "@/services/sentry";
import { Fo } from "@/services/sentry-scrub";
import { Jt } from "@/services/api/endpoints";
import { O$, R$ } from "@/utils/error-handler";
import { J$, K$ } from "@/store/store-registry";
import { o9, a9, u0, i9, Y1, Z7, G7 } from "@/services/desktop-agent";
import { ce } from "@/utils/storage";
import { Ar, Zr, sa } from "@/constants/storage-keys";
import { B$ } from "@/utils/jwt";
import { V$ } from "@/utils/logout";
import Pi from "axios";
import { Tt } from "@/utils/current-user";
import { Cy, kn } from "@/constants/index";
import { kh } from "@/services/fcm-auth-cache";
import Mn from "crypto-js/aes";
import { EC } from "@/store/reducers/user";
const SU = (e) => {
  if (X_.__loaded) {
    X_.capture("api_error_blocking", {
      status: e.status,
      url: e.url,
      method: e.method,
      duration_ms: e.duration,
      timestamp: Date.now(),
      data: e.data,
      payload: e.payload,
    });
  }
};
const J_ = "app.upgrade.uysotdev.aws.softex.uz";
const Bv =
  typeof window !== "undefined" && window.location.hostname === J_
    ? `https://serv.${J_}`
    : "https://service.app.dev.uysot.uz";
const EU = "https://showroom-dashboard-dev.app.uysot.uz";
const CU = "https://uysot-mcp-client.app-dev.uysot.uz";
let Cf = false;
let hp = [];
const eu = (e) => {
  e.headers["language-symbol"] = xt.language || "uz";
  oL({
    category: "http.request",
    message: `${e.method?.toUpperCase()} ${e.url}`,
    data: {
      url: e.url,
      method: e.method,
      body: Fo(e.data),
    },
    level: "info",
  });
  return e;
};
const xU = (e) => {
  const t = e?.response?.data;
  return (
    t?.message?.uz ||
    t?.error ||
    t?.message ||
    e?.message ||
    `Xatolik - ${e?.response?.status || "Unknown"}`
  );
};
const Vv = (e) => (e?.config?.url || e?.response?.config?.url || "Unknown").split("?")[0];
const wU = (e) => {
  const t = Vv(e);
  const r = (e?.config?.method || e?.response?.config?.method || "").toUpperCase();
  if (r) {
    return `${r} ${t}`;
  }
  return t;
};
const PU = (error, t, r) => {
  const n = new Error(t);
  n.name = error;
  n.stack = r?.stack;
  return n;
};
const IU = [3125, 2715];
const AU = [
  Jt.OTP_SEND,
  Jt.OTP_VERIFY,
  Jt.OTP_SELECT,
  Jt.TELEGRAM_SESSION,
  Jt.TELEGRAM_REDEEM,
  Jt.TELEGRAM_VERIFY,
  Jt.TELEGRAM_SELECT,
];
const TU = [7901, 7902, 7903, 7904, 7905, 3114, 3127, 3130];
const RU = /^\/?v1\/contract\/\d+\/payment$/;
const OU = [1106];
const NU = /^\/?v1\/marketing\/dashboard\/funnel-config$/;
const kU = [6601];
const MU = (e) => e?.response?.data?.errorMessage?.messageCode;
const DU = (e) => {
  const t = Vv(e);
  const r = MU(e);
  if (t === Jt.REFRESH) {
    return true;
  }
  if (t === Jt.SIGN_IN) {
    return IU.includes(r);
  }
  if (AU.includes(t)) {
    return TU.includes(r);
  }
  if (NU.test(t)) {
    return kU.includes(r);
  }
  return RU.test(t) && OU.includes(r);
};
const tu = (e) => {
  try {
    const errorCode = O$();
    try {
      e.errorCode = errorCode;
    } catch {}
    if (DU(e)) {
      return;
    }
    if (e?.response?.status === 400 || e?.response?.status === 403) {
      const error = xU(e);
      const n = Vv(e);
      const i = wU(e);
      const a = `${i} — ${e.response?.status || "Unknown"}`;
      lL((o, s) => {
        o.setTag("error_type", "request_error");
        o.setTag("error_status", e.response?.status);
        o.setTag(R$, errorCode);
        o.setFingerprint([n, String(e.response?.status || "Unknown"), error]);
        o.setTransactionName(i);
        o.setContext("Request", {
          url: e?.config?.url,
          method: e?.config?.method?.toUpperCase(),
          status: e?.response?.status,
          errorCode,
          requestBody: Fo(e?.config?.data),
          responseData: Fo(e?.response?.data),
          body: Fo(e?.response?.config?.data) || "No request body",
          error,
        });
        s.captureException(PU(error, a, e));
      });
    }
  } catch {}
};
const EP = (e) => {
  const t = e?.metadata;
  if (t) {
    const duration = new Date().getTime() - t.startTime.getTime();
    if (duration >= 50000) {
      J$({
        url: e.url,
        duration,
      });
    }
  }
};
const xf = (e, t = null) => {
  hp.forEach((r) => {
    if (e) {
      r.reject(e);
    } else {
      r.resolve(t);
    }
  });
  hp = [];
};
const CP = async (e) => {
  const t = o9(e.url, e.baseURL);
  if (!a9(t) || e.headers.get(u0)) {
    return e;
  }
  const r = i9() ?? (await Y1());
  if (r) {
    e.headers.set(u0, r);
  }
  const n = Z7();
  if (n) {
    e.headers.set(G7, n);
  }
  return e;
};
const xP = (e) => {
  const t = ce.get(Ar);
  const r = ce.get("firebaseToken");
  if (t) {
    e.headers.Authorization = `Bearer ${t}`;
  }
  if (r) {
    e.headers.firebaseToken = r;
  }
  e.metadata = {
    startTime: new Date(),
  };
  return e;
};
const LU = (e) => /^https?:\/\//i.test(e || "");
const wP = async (e) => {
  const t = e?.config;
  if (e?.response?.status !== 401) {
    tu(e);
  }
  SU({
    status: e?.response?.status,
    url: e?.config?.url,
    method: e?.config?.method,
    data: e?.response?.data,
    payload: e?.config?.data,
  });
  EP(t);
  const r = String(t?.url || "").includes("/v1/call-history/meet-record/");
  const n = LU(t?.url) && !String(t.url).startsWith(Bv);
  if (e?.response?.status === 401 && !r && !n && !t._retry) {
    if (B$()) {
      return V$(), Promise.reject(e);
    }
    if (ce.get(Ar)) {
      return (
        (t._retry = true),
        Cf
          ? new Promise((resolve, reject) => {
              hp.push({
                resolve,
                reject,
              });
            })
              .then((i) => {
                t.headers.Authorization = `Bearer ${i}`;
                return Pi(t);
              })
              .catch((i) => Promise.reject(i))
          : ((Cf = true),
            new Promise((resolve, reject) => {
              Es.get(Jt.REFRESH, {
                withCredentials: true,
              })
                .then((o) => {
                  let s = false;
                  const l = o.data?.data;
                  const c = Tt;
                  const u = l?.roleTokens?.find(
                    (y) => (y?.branch?.id || y?.branch) === c?.branchId
                  );
                  const d = Cy.filter((y) => c?.role?.permissions?.includes(y));
                  localStorage.setItem("refresh_response", JSON.stringify(o));
                  if (typeof c === "object") {
                    const y = new Set(d);
                    const m = new Set(
                      u?.role?.permissions || o.data?.data?.role?.permissions || []
                    );
                    const b = d.filter((S) => !m.has(S));
                    const p = (u?.role?.permissions || o.data?.data?.role?.permissions)?.filter(
                      (S) => !y.has(S)
                    );
                    const _ = [...b, ...p];
                    s = Cy?.some((S) => _?.includes(S));
                  }
                  const accessToken = u?.accessToken || o.data?.data?.accessToken;
                  ce.set(Ar, accessToken);
                  kh();
                  const h = Mn.encrypt(
                    JSON.stringify({
                      ...o.data?.data,
                      accessToken,
                      role: u?.role || o.data?.data?.role,
                      branchId: c?.branchId,
                    }),
                    kn.CODE_KEY
                  ).toString();
                  const g = K$();
                  if (g) {
                    g.dispatch(
                      EC({
                        ...o.data?.data,
                        accessToken,
                        refresh: true,
                        role: u?.role || o.data?.data?.role,
                        branchId: c?.branchId,
                      })
                    );
                  }
                  ce.set(Zr, h);
                  if (s) {
                    xf(e, null);
                    reject(e);
                    window.location.reload();
                    return;
                  }
                  xf(null, accessToken);
                  t.headers.Authorization = `Bearer ${accessToken}`;
                  resolve(Pi(t));
                })
                .catch(async (o) => {
                  try {
                    const { unregisterWebPushFromBackendAndFcm } = await (async () => {
                      const { unregisterWebPushFromBackendAndFcm } = await import(
                        "@/services/web-push-session"
                      );
                      return {
                        unregisterWebPushFromBackendAndFcm,
                      };
                    })();
                    await unregisterWebPushFromBackendAndFcm();
                  } catch (error) {
                    console.warn("[FCM] refresh-fail push teardown", error);
                  }
                  ce.remove(Ar);
                  ce.remove(Zr);
                  kh();
                  ce.set(sa, window.location.pathname + window.location.search);
                  xf(o, null);
                  reject(o);
                  window.location.replace(window.location.origin);
                })
                .finally(() => {
                  Cf = false;
                });
            }))
      );
    }
    return (
      ce.set(sa, window.location.href),
      window.location.replace(window.location.origin),
      Promise.reject(e)
    );
  }
  throw e;
};
const Wa = Pi.create({
  baseURL: Bv,
  timeout: 60000,
});
Pi.create({
  timeout: 30000,
});
const Es = Pi.create({
  baseURL: Bv,
  withCredentials: true,
});
Es.interceptors.request.use(CP);
Es.interceptors.request.use(eu);
Es.interceptors.response.use(
  (e) => e,
  (e) => {
    if (e.response?.status !== 401) {
      tu(e);
    }
    return Promise.reject(e);
  }
);
Wa.interceptors.request.use(CP);
Wa.interceptors.request.use(xP);
Wa.interceptors.request.use(eu);
Wa.interceptors.response.use((e) => {
  EP(e.config);
  return e;
}, wP);
const PP = Pi.create({
  baseURL: EU,
});
PP.interceptors.request.use(eu);
PP.interceptors.response.use(
  (e) => e,
  (e) => {
    if (e.response?.status !== 401) {
      tu(e);
    }
    return Promise.reject(e);
  }
);
const ru = Pi.create({
  baseURL: CU,
});
ru.interceptors.request.use(xP);
ru.interceptors.request.use(eu);
ru.interceptors.response.use(
  (e) => e,
  (e) => {
    if (e.response?.status !== 401) {
      tu(e);
    }
    return Promise.reject(e);
  }
);
ru.interceptors.response.use((e) => e, wP);
const Uv = {
  ACTIVE_SESSION_USER: "ACTIVE_SESSION_USER",
};
export { Bv, Es, Uv, Wa };
