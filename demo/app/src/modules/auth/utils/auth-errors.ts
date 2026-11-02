// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: company-select-step-Cjab7zDr (3)
import { AC } from "@/utils/error-handler";
const b = (e) => e?.response?.data?.errorMessage;
const ee = (e) => AC(b(e));
const te = (e) => {
  const t = Number(b(e)?.args?.["&seconds&"]);
  if (Number.isFinite(t) && t > 0) {
    return t;
  }
};
export { b, ee, te };
