// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (16)
import { p$ } from "@/utils/random-string";
import J from "react";
import xt from "i18next";
import { Ti } from "@/components/toaster/state";
const R$ = "error_code";
const O$ = () => p$(8);
const NComponent = (e, t) => {
  if (t) {
    return (
      <>
        {e} <span className="font-mono text-gray-400">{`#${t}`}</span>
      </>
    );
  }
  return e;
};
const ic = (e) => e?.[xt.language] || e?.ru || e?.uz;
function k$(e, t) {
  if (t) {
    Ti.success(ic(e));
  } else {
    Ti.error(ic(e));
  }
}
const IC = {
  uz: "Xatolik mavjud",
  ru: "Есть ошибка",
  en: "There is an error",
  kr: "Хатолик мавжуд",
  tr: "Bir hata var",
  tj: "Хатогие ҳаст",
  ky: "Xаталык бар",
};
let Al = null;
import("@/constants/dynamic-translate-keys").then((e) => {
  Al = e.dynamicTranslateKeys;
});
const AC = (e) => {
  const t = e?.args || {};
  let r = e?.message || "Xatolik mavjud";
  for (const i in t) {
    r = r.replace(new RegExp(i, "g"), `{{${i}}}`);
  }
  if (!Al) {
    return r;
  }
  const n = Al[e?.messageCode]?.key || Al[1000].key;
  return xt.t(`global.${n}`, t);
};
const M$ = (e) => e instanceof Error && e.name === "ZodError";
const D$ = (e) => {
  const t = e;
  const r = t?.response?.status;
  if (r === 400 || r === 403) {
    return t?.errorCode;
  }
};
const L$ = 1020;
const F$ = "contract-not-found";
const $$ = (e) => {
  const t = e?.response;
  const r = t?.data?.errorMessage?.messageCode;
  if (t?.status === 404 && r === L$) {
    return F$;
  }
};
const kd = (e, t) => {
  const id = $$(t);
  Ti.error(
    NComponent(e || ic(IC), D$(t)),
    id
      ? {
          id,
        }
      : undefined
  );
};
const Qy = (e) => {
  const r = e?.response;
  const n = r?.data?.accept;
  if (r?.status !== 401) {
    if (typeof r?.data?.errorMessage === "string") {
      kd(String(r?.data?.errorMessage), e);
      return;
    }
    if (typeof n === "boolean") {
      if (n) {
        k$(r?.data?.message, n);
      } else {
        kd(AC(r?.data?.errorMessage), e);
      }
      return;
    }
    if (M$(e)) {
      console.error(e.message);
    } else {
      kd(ic(IC), e);
    }
  }
};
export { AC, O$, Qy, R$, k$ };
