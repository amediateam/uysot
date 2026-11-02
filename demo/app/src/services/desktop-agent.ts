// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (29)
import { Y$ } from "@/store/store-registry";
import { Ha } from "@/store/index";
import { persistStore } from "redux-persist";
import { Jt } from "@/services/api/endpoints";
import { kC } from "@/modules/desktop-agent/errors";
import { P5 } from "@/store/reducers/desktopAgentReducer";
Y$(Ha);
const V7 = persistStore(Ha);
const U7 = "uysot-agent://open";
const H7 = 2000;
const z7 = 10;
const W7 = 500;
const q7 = "/v1/employee/device/status";
const u0 = "X-Device-Code";
const G7 = "X-Device-Name";
const Y7 = [Jt.SIGN_IN, Jt.OTP_SELECT, Jt.TELEGRAM_SELECT, Jt.REFRESH, q7];
let Nl = null;
let Ks = null;
let sc = null;
function K7() {
  return "http://127.0.0.1:47823";
}
function X7() {
  return U7;
}
function J7() {
  window.location.href = X7();
}
function Q7() {
  return Ha.getState().desktopAgentReducer.isActive;
}
function Z7() {
  return Ha.getState().desktopAgentReducer.deviceName;
}
async function e9() {
  const e = new AbortController();
  const t = window.setTimeout(() => e.abort(), H7);
  try {
    const r = {
      method: "GET",
      signal: e.signal,
      targetAddressSpace: "loopback",
    };
    const n = await fetch(`${K7()}/health`, r);
    if (!n.ok) {
      return {
        isActive: false,
        deviceCode: null,
        deviceName: null,
      };
    }
    const i = await n.json();
    const isActive = i.ok === true && !!i.deviceCode;
    return {
      isActive,
      deviceCode: isActive ? i.deviceCode : null,
      deviceName: isActive ? i.deviceName ?? null : null,
    };
  } catch {
    return {
      isActive: false,
      deviceCode: null,
      deviceName: null,
    };
  } finally {
    window.clearTimeout(t);
  }
}
async function pv() {
  if (!Ks) {
    Ks = e9().finally(() => {
      Ks = null;
    });
  }
  return Ks;
}
function vv(e) {
  if (e.isActive) {
    kC();
  }
  Ha.dispatch(
    P5({
      isActive: e.isActive,
      deviceCode: e.deviceCode,
      deviceName: e.deviceName,
    })
  );
}
async function t9() {
  J7();
  for (let e = 0; e < z7; e += 1) {
    await new Promise((resolve) => {
      window.setTimeout(resolve, W7);
    });
    const t = await pv();
    if (t.isActive) {
      vv(t);
      Nl = null;
      return true;
    }
  }
  return false;
}
async function r9() {
  if (!Nl) {
    Nl = (async () => {
      const e = await pv();
      vv(e);
      return e.isActive;
    })();
  }
  return Nl;
}
async function Y1() {
  const e = await pv();
  vv(e);
  return e.deviceCode;
}
async function n9() {
  sc = await Y1();
  return sc;
}
function i9() {
  const e = sc;
  sc = null;
  return e;
}
function a9(e) {
  const t = e.split("?")[0];
  return Y7.some((r) => r === t);
}
function o9(e, t) {
  const r = e ?? "";
  if (r.startsWith("http://") || r.startsWith("https://")) {
    try {
      return new URL(r).pathname;
    } catch {
      return r.split("?")[0];
    }
  }
  const n = t ?? "";
  if (n.startsWith("http://") || n.startsWith("https://")) {
    try {
      return new URL(r, n).pathname;
    } catch {
      return r.split("?")[0];
    }
  }
  return r.split("?")[0];
}
async function Ene() {
  await r9();
  return true;
}
export { Ene, G7, Q7, V7, Y1, Z7, a9, i9, n9, o9, t9, u0 };
