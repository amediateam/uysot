// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (8)
// [mock] должен быть первым: ставит axios-адаптер до создания API-клиентов (только при VITE_MOCK_API=true)
import "@/mocks";
import "@/styles/global.compiled.css";
import "@/bootstrap/polyfills";
import "@/i18n/index";
import "@/utils/dayjs";
import "@/store/reducers/crmField";
import { mL } from "@/bootstrap/chunk-recovery";
import * as nI from "react-dom/client";
import * as A from "react/jsx-runtime";
import { rz as Rz } from "@/apps/open";
let lb = 0;
let cb = false;
function ub(e, t) {
  if (!(lb >= 5)) {
    lb += 1;
    import("@sentry/react").then((r) => {
      r.addBreadcrumb({
        category: "dom-node-guard",
        level: "warning",
        message: `Prevented NotFoundError: ${e} on detached node <${t.nodeName.toLowerCase()}>`,
      });
    });
  }
}
function nz() {
  if (cb || typeof Node !== "function" || !Node.prototype) {
    return;
  }
  cb = true;
  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (n) {
    if (n.parentNode !== this) {
      return ub("removeChild", n), n;
    }
    return removeChild.call(this, n);
  };
  const insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (n, i) {
    if (i && i.parentNode !== this) {
      return ub("insertBefore", n), n;
    }
    return insertBefore.call(this, n, i);
  };
}
function iz() {
  nz();
  mL();
}
function az(e = 4000) {
  if (typeof document === "undefined") {
    return Promise.resolve();
  }
  const t = [...document.querySelectorAll("link[data-app-css]")];
  if (t.length === 0) {
    return Promise.resolve();
  }
  const r = Promise.all(
    t.map(
      (i) =>
        new Promise((resolve) => {
          const o = () => {
            if (i.media === "print") {
              i.media = "all";
            }
            resolve();
          };
          if (i.media === "all" && i.sheet) {
            o();
            return;
          }
          i.addEventListener("load", o, {
            once: true,
          });
          i.addEventListener("error", o, {
            once: true,
          });
        })
    )
  ).then(() => {});
  const n = new Promise((resolve) => {
    window.setTimeout(resolve, e);
  });
  return Promise.race([r, n]);
}
function oz() {
  iz();
  const e = document.getElementById("root");
  const t = nI.createRoot(e);
  az().then(() => {
    t.render(<Rz />);
    import("@/bootstrap/shell-init").then((r) => r.initShellRuntime());
  });
}
oz();
export { iz };
