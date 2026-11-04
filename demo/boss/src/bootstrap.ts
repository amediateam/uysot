// TODO: inferred from build
// Побочные эффекты при старте: в сборке выполняются до инициализации react-dom, исходный файл неизвестен.
import { config } from "@/constants/config";
import { initI18n } from "@/i18n";
import { http } from "@/services/http";
import { store } from "@/store";

initI18n({ languages: ["uz", "ru", "en", "tr"], ns: "boss", defaultLanguage: "uz" });

http.init({
  configFn: () => {
    const accessToken = store.getState().auth.accessToken;
    return {
      baseURL: config.api.baseURL,
      ...(accessToken ? { [config.api.accessTokenKEY]: `Bearer ${accessToken}` } : {}),
    };
  },
});
