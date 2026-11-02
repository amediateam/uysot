// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (4)
import { useTranslation } from "react-i18next";
import * as v from "react";
import * as A from "react/jsx-runtime";
import { vi as Vi } from "@/components/icon/icon-lite";
import { AH as src } from "@/assets/index";
const TH = 1500;
const RH = ["loopback-network", "local-network-access"];
const useOH = () => {
  const [e, setE] = v.useState("unknown");
  v.useEffect(() => {
    let r = null;
    let n = false;
    let i;
    const a = () => {
      if (r && !n) {
        setE(r.state);
      }
    };
    const o = async () => {
      for (const name of RH) {
        try {
          return await navigator.permissions.query({
            name,
          });
        } catch {}
      }
      return null;
    };
    const s = async () => {
      if (!("permissions" in navigator) || typeof navigator.permissions.query !== "function") {
        setE("unsupported");
        return;
      }
      const l = await o();
      if (!n) {
        if (!l) {
          setE("unsupported");
          return;
        }
        if (r !== l) {
          r?.removeEventListener("change", a);
          r = l;
          r.addEventListener("change", a);
        }
        setE(l.state);
      }
    };
    s();
    i = window.setInterval(() => {
      s();
    }, TH);
    return () => {
      n = true;
      r?.removeEventListener("change", a);
      if (i !== undefined) {
        window.clearInterval(i);
      }
    };
  }, []);
  return e;
};
export const NH = () => {
  const { t: t_1 } = useTranslation();
  const t = useOH();
  const [r, setR] = v.useState(false);
  if (!(t === "prompt" || t === "denied") || r) {
    return null;
  }
  const a = [
    t_1(
      "global.Manzil_panelidagi_sayt_belgisini_bosing",
      "Manzil panelidagi qulf (sayt) belgisini bosing"
    ),
    t_1(
      "global.Apps_on_device_ruxsatini_yoqing",
      "«Apps on device» — qurilmadagi ilovalar ruxsatini yoqing"
    ),
    t_1("global.Sahifani_yangilang", "Sahifani yangilang"),
  ];
  return (
    <div className="fixed left-[16px] top-[16px] z-[2000] w-[360px] max-w-[calc(100vw-32px)]">
      <div className="ml-[24px] h-0 w-0 border-x-[8px] border-b-[10px] border-x-transparent border-b-white" />
      <div className="overflow-hidden rounded-[16px] border border-solid border-[#E5E7EB] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.18)]">
        <div className="flex items-start gap-[12px] px-[20px] pt-[18px]">
          <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#E0F2F1] text-[#00897b]">
            <Vi name="laptop" className="size-[20px]" />
          </div>
          <div className="flex-1">
            <h3 className="m-0 text-[16px] font-semibold leading-[22px] text-[#111827]">
              {t_1("global.Brauzer_ruxsatini_yoqing", "Brauzer ruxsatini yoqing")}
            </h3>
            <p className="m-0 mt-[2px] text-[13px] leading-[18px] text-[#6B7280]">
              {t_1(
                "global.Tizimga_kirish_uchun_qurilmadagi_ilovalarga_ruxsat_kerak",
                "Tizimga kirish uchun brauzerning chap yuqori qismidan «Apps on device» ruxsatini yoqing."
              )}
            </p>
          </div>
          <button
            type="button"
            className="-mr-[4px] -mt-[4px] flex size-[28px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[#9CA3AF] hover:bg-[#F3F4F6]"
            onClick={() => setR(true)}
          >
            <Vi name="close" className="size-[16px]" />
          </button>
        </div>
        <ol className="m-0 mt-[14px] flex list-none flex-col gap-[10px] p-0 px-[20px]">
          {a.map((o, s) => (
            <li key={o} className="flex items-center gap-[10px]">
              <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-semibold text-white">
                {s + 1}
              </span>
              <span className="text-[13px] leading-[18px] text-[#374151]">{o}</span>
            </li>
          ))}
        </ol>
        <div className="mt-[14px] border-t border-solid border-[#F3F4F6] bg-[#F9FAFB] p-[12px]">
          <img src={src} className="w-full rounded-[10px] border border-solid border-[#E5E7EB]" />
        </div>
      </div>
    </div>
  );
};
