// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (1)
import * as v from "react";
import { $F } from "@/utils/recaptcha";
function useGU() {
  const eRef = v.useRef(null);
  const t = v.useCallback(async () => {
    for (let i = 0; i < 40 && !eRef.current; i++) {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    }
    return eRef.current;
  }, []);
  const getFreshRecaptchaToken = v.useCallback(async () => {
    if (import.meta.env.VITE_MOCK_API === "true") return "mock-recaptcha-token"; // [mock] reCAPTCHA не работает на localhost
    const i = await t();
    i?.reset();
    return (i && (await $F(i))) ?? null;
  }, [t]);
  const resetRecaptcha = v.useCallback(() => {
    eRef.current?.reset();
  }, []);
  return {
    recaptchaRef: eRef,
    getFreshRecaptchaToken,
    resetRecaptcha,
  };
}
export { useGU as GU };
