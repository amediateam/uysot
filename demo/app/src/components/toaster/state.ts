// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (19)
import J from "react";
let xh = 1;
const OL = (e) =>
  e &&
  typeof e === "object" &&
  "ok" in e &&
  typeof e.ok === "boolean" &&
  "status" in e &&
  typeof e.status === "number";
function NL(e) {
  if (e == null) {
    return "";
  }
  if (typeof e === "object" && !J.isValidElement(e)) {
    if (typeof e.message === "string") {
      return e.message;
    }
    if (typeof e.errorMessage === "string") {
      return e.errorMessage;
    }
    if (typeof e.errorMessage?.message === "string") {
      return e.errorMessage.message;
    }
    if (typeof e.error === "string") {
      return e.error;
    }
    try {
      return JSON.stringify(e);
    } catch {
      return String(e);
    }
  }
  return e;
}
class kL {
  subscribers;
  toasts;
  constructor() {
    this.subscribers = [];
    this.toasts = [];
  }
  subscribe = (t) => {
    this.subscribers.push(t);
    return () => {
      const r = this.subscribers.indexOf(t);
      this.subscribers.splice(r, 1);
    };
  };
  publish = (t) => {
    this.subscribers.forEach((r) => r(t));
  };
  addToast = (t) => {
    this.publish(t);
    this.toasts = [...this.toasts, t];
  };
  create = (t) => {
    const t_message = t.message;
    const n = NL(t_message);
    const { message, ...rest } = t;
    const o = typeof t?.id === "number" || (t.id?.length || 0) > 0 ? t.id : xh++;
    const s = this.toasts.find((c) => c.id === o);
    const dismissible = t.dismissible === undefined ? true : t.dismissible;
    if (s) {
      this.toasts = this.toasts.map((c) => {
        if (c.id === o) {
          return (
            this.publish({
              ...c,
              ...t,
              id: o,
              title: n,
            }),
            {
              ...c,
              ...t,
              id: o,
              dismissible,
              title: n,
            }
          );
        }
        return c;
      });
    } else {
      this.addToast({
        title: n,
        ...rest,
        dismissible,
        id: o,
      });
    }
    return o;
  };
  dismiss = (t) => {
    if (!t) {
      this.toasts.forEach((r) => {
        this.subscribers.forEach((n) =>
          n({
            id: r.id,
            dismiss: true,
          })
        );
      });
    }
    this.subscribers.forEach((r) =>
      r({
        id: t,
        dismiss: true,
      })
    );
    return t;
  };
  message = (t, r) =>
    this.create({
      ...r,
      message: t,
    });
  error = (t, r) =>
    this.create({
      ...r,
      message: t,
      type: "error",
    });
  success = (t, r) =>
    this.create({
      ...r,
      type: "success",
      message: t,
    });
  info = (t, r) =>
    this.create({
      ...r,
      type: "info",
      message: t,
    });
  warning = (t, r) =>
    this.create({
      ...r,
      type: "warning",
      message: t,
    });
  loading = (t, r) =>
    this.create({
      ...r,
      type: "loading",
      message: t,
    });
  promise = (promise, r) => {
    if (!r) {
      return;
    }
    let n;
    if (r.loading !== undefined) {
      n = this.create({
        ...r,
        promise,
        type: "loading",
        message: r.loading,
        description: typeof r.description !== "function" ? r.description : undefined,
      });
    }
    const i = promise instanceof Promise ? promise : promise();
    let a = n !== undefined;
    let o;
    const s = i
      .then(async (c) => {
        o = ["resolve", c];
        if (OL(c) && !c.ok) {
          a = false;
          const u =
            typeof r.error === "function"
              ? await r.error(`HTTP error! status: ${c.status}`)
              : r.error;
          const d =
            typeof r.description === "function"
              ? await r.description(`HTTP error! status: ${c.status}`)
              : r.description;
          this.create({
            id: n,
            type: "error",
            message: u,
            description: d,
          });
        } else if (r.success !== undefined) {
          a = false;
          const u = typeof r.success === "function" ? await r.success(c) : r.success;
          const d = typeof r.description === "function" ? await r.description(c) : r.description;
          this.create({
            id: n,
            type: "success",
            message: u,
            description: d,
          });
        }
      })
      .catch(async (c) => {
        o = ["reject", c];
        if (r.error !== undefined) {
          a = false;
          const u = typeof r.error === "function" ? await r.error(c) : r.error;
          const d = typeof r.description === "function" ? await r.description(c) : r.description;
          this.create({
            id: n,
            type: "error",
            message: u,
            description: d,
          });
        }
      })
      .finally(() => {
        if (a) {
          this.dismiss(n);
          n = undefined;
        }
        r.finally?.();
      });
    const unwrap = () =>
      new Promise((resolve, reject) =>
        s
          .then(() => {
            if (o[0] === "reject") {
              return reject(o[1]);
            }
            return resolve(o[1]);
          })
          .catch(reject)
      );
    if (typeof n !== "string" && typeof n !== "number") {
      return {
        unwrap,
      };
    }
    return Object.assign(n, {
      unwrap,
    });
  };
  custom = (t, r) => {
    const n = r?.id || xh++;
    this.create({
      jsx: t(n),
      id: n,
      ...r,
    });
    return n;
  };
}
const hr = new kL();
const ML = (e, t) => {
  const r = t?.id || xh++;
  hr.addToast({
    title: e,
    ...t,
    id: r,
  });
  return r;
};
const DL = ML;
const getHistory = () => hr.toasts;
const Ti = Object.assign(
  DL,
  {
    success: hr.success,
    info: hr.info,
    warning: hr.warning,
    error: hr.error,
    custom: hr.custom,
    message: hr.message,
    promise: hr.promise,
    dismiss: hr.dismiss,
    loading: hr.loading,
  },
  {
    getHistory,
  }
);
function zs(e) {
  return e.label !== undefined;
}
const FL = 3;
const $L = "32px";
const jL = "16px";
const BL = 4000;
const VL = 356;
const UL = 14;
const HL = 20;
const zL = 200;
function WL(...e) {
  return e.filter(Boolean).join(" ");
}
export { $L, BL, FL, HL, Ti, UL, VL, WL, hr, jL, zL, zs };
