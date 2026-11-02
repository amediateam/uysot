// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (2)
import { Zr } from "@/constants/storage-keys";
import Mn from "crypto-js/aes";
import { kn } from "@/constants/index";
import { getDefaultExportFromCjs } from "@/utils/interop";
import IF from "crypto-js/enc-utf8";
const AF = getDefaultExportFromCjs(IF);
export const Tt = (() => {
  const e = localStorage.getItem(Zr);
  if (e) {
    if (e[0] === "{" && e[e.length - 1] === "}") {
      return JSON.parse(e);
    }
    try {
      if (e) {
        return JSON.parse(Mn.decrypt(e || "", kn.CODE_KEY).toString(AF));
      }
      return null;
    } catch {
      localStorage.clear();
      window.location.href = window.location.origin;
      return null;
    }
  }
  return null;
})();
