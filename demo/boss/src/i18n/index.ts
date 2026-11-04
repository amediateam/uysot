import { withTolgee, I18nextPlugin } from "@tolgee/i18next";
import { BackendFetch, DevTools, Tolgee } from "@tolgee/web";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

interface InitI18nOptions {
  languages: string[];
  defaultLanguage: string;
  ns: string;
}

export const initI18n = ({ languages, defaultLanguage, ns }: InitI18nOptions) => {
  const tolgeeBuilder = Tolgee();

  (import.meta.env.VITE_TOLGEE_BACKEND_FETCH
    ? [DevTools, I18nextPlugin, BackendFetch]
    : [DevTools, I18nextPlugin]
  ).forEach((plugin) => tolgeeBuilder.use(plugin()));

  const tolgee = tolgeeBuilder.init({
    apiUrl: import.meta.env.VITE_TOLGEE_API_URL,
    apiKey: import.meta.env.VITE_TOLGEE_API_KEY,
    projectId: import.meta.env.VITE_TOLGEE_PROJECT_ID,
    ns: [ns],
    availableLanguages: languages,
    defaultLanguage,
  });

  withTolgee(i18n, tolgee)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      detection: { order: ["localStorage", "sessionStorage", "navigator"] },
      supportedLngs: languages,
      ns,
      react: { useSuspense: false },
    });

  return i18n;
};
