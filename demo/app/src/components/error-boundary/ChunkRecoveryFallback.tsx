// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (1)
import * as v from "react";
import * as A from "react/jsx-runtime";
import { t as t_1 } from "@/i18n/t";
import { Button } from "antd";
export const by = ({ delayMs = 0 }) => {
  const [t, setT] = v.useState(delayMs === 0);
  v.useEffect(() => {
    if (t) {
      return;
    }
    const n = window.setTimeout(() => setT(true), delayMs);
    return () => window.clearTimeout(n);
  }, [delayMs, t]);
  if (t) {
    return (
      <div className="flex flex-wrap items-center gap-[8px] border border-solid border-gray-300 p-[6px]">
        {t_1(
          "network_alert.Tarmoqqa_ulanishda_xatolik_yuz_berdi_Iltimos_tarmoqni_tekshirib_koring"
        )?.toString()}
        <Button size="small" onClick={() => window.location.reload()}>
          {t_1("home.Qayta_yuklash")?.toString()}
        </Button>
      </div>
    );
  }
  return null;
};
