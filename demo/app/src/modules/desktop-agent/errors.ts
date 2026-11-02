// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (8)
import { I5, A5 } from "@/store/reducers/desktopAgentReducer";
import { ce } from "@/utils/storage";
import { Sb } from "@/constants/storage-keys";
import { Q7 } from "@/services/desktop-agent";
function NC(e) {
  if (!e || typeof e !== "object") {
    return null;
  }
  const t = e;
  return t.errorMessage ?? t.response?.data?.errorMessage ?? null;
}
function T5(e) {
  return NC(e)?.messageCode ?? null;
}
function R5(e) {
  const t = NC(e)?.args?.hasOtherDevice;
  if (typeof t === "boolean") {
    return t;
  }
  return null;
}
function O5(e) {
  const t = T5(e);
  return t === I5 || t === A5;
}
function kC() {
  ce.set(Sb, "true");
}
function N5() {
  return ce.get(Sb) === "true";
}
function k5(e) {
  const t = e ? R5(e) : null;
  if (t === true) {
    return "not_running";
  }
  if (t === false) {
    return "not_installed";
  }
  if (Q7() || N5()) {
    return "not_running";
  }
  return "not_installed";
}
function M5() {
  const e = navigator.platform.toLowerCase();
  const t = navigator.userAgent.toLowerCase();
  if (e.includes("mac") || t.includes("mac")) {
    return "macos";
  }
  return "windows";
}
export { M5, O5, k5, kC };
