// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (21)
import { Eb, Cb, $I } from "@/constants/storage-keys";
import xt from "i18next";
import { Tolgee, DevTools, BackendFetch } from "@tolgee/web";
import { I18nextPlugin, withTolgee } from "@tolgee/i18next";
import { initReactI18next } from "react-i18next";
import uI from "i18next-browser-languagedetector";
function jI() {
  try {
    const e = window.localStorage.getItem(Eb);
    if (!e) {
      return null;
    }
    const t = JSON.parse(e);
    if (t?.v !== "1.260.0" || !t?.lang || !t?.data) {
      return null;
    }
    if (Object.keys(t.data).length >= Cb) {
      return t;
    }
    return null;
  } catch {
    return null;
  }
}
function BI(lang, t) {
  try {
    if (!lang || Object.keys(t).length < Cb) {
      return;
    }
    const r = JSON.stringify({
      v: "1.260.0",
      lang,
      data: t,
    });
    if (r.length > $I) {
      return;
    }
    window.localStorage.setItem(Eb, r);
  } catch {}
}
function VI(e, t) {
  try {
    const n = (
      window.sessionStorage.getItem("i18nextLng") || window.localStorage.getItem("i18nextLng")
    )
      ?.split("-")[0]
      ?.toLowerCase();
    if (n && e.includes(n)) {
      return n;
    }
    return t;
  } catch {
    return t;
  }
}
const Xo = ["uz", "ru", "en", "tr", "tj", "ky"];
const Nc = "uysot";
const detection = {
  order: ["sessionStorage", "localStorage", "navigator"],
};
function Sp() {
  if (typeof document === "undefined") {
    return;
  }
  const e = xt.resolvedLanguage ?? xt.language;
  if (e) {
    document.documentElement.lang = e;
  }
}
xt.on("initialized", Sp);
xt.on("languageChanged", Sp);
const Af = jI();
const xb = VI(Xo, Xo[0]);
const wb = Af?.lang === xb;
const Ep = Tolgee()
  .use(DevTools())
  .use(BackendFetch())
  .use(I18nextPlugin())
  .init({
    apiUrl: "https://lang.aws.softex.uz",
    apiKey: "tgpak_gjpxcntuorywk3dunrzwg5jsgrutemrtovvtgmdrnfxde",
    projectId: "2",
    ns: ["uysot"],
    availableLanguages: Xo,
    defaultLanguage: Xo[0],
    staticData: wb
      ? {
          [`${Af.lang}:${Nc}`]: Af.data,
        }
      : undefined,
  });
withTolgee(xt, Ep)
  .use(initReactI18next)
  .use(uI)
  .init({
    detection,
    supportedLngs: Xo,
    ns: Nc,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });
queueMicrotask(Sp);
function Pb() {
  return xt.resolvedLanguage ?? xt.language ?? xb;
}
function Cp() {
  try {
    const language = Pb();
    const t = Ep.getRecord({
      language,
      namespace: Nc,
    });
    if (t) {
      BI(language, Object.fromEntries(t));
    }
  } catch {}
}
async function HI() {
  try {
    await Ep.loadRecord({
      language: Pb(),
      namespace: Nc,
    });
  } catch {}
  Cp();
}
function Tf(e) {
  if (typeof window === "undefined") {
    return;
  }
  const t = () => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(e, {
        timeout: 3000,
      });
    } else {
      window.setTimeout(e, 500);
    }
  };
  requestAnimationFrame(() => requestAnimationFrame(t));
}
if (wb) {
  Tf(() => {
    HI();
  });
} else {
  xt.on("initialized", () => Tf(Cp));
}
xt.on("languageChanged", () => Tf(Cp));
