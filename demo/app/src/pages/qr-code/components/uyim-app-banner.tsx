// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: QrCode-CXeqeBv0 (6)
import { useTranslation } from "react-i18next";
import * as r from "react/jsx-runtime";
import { _e as src } from "@/assets/index";
import { Pe, Se } from "@/pages/qr-code/components/store-icons";
const $ = {
  ios: "https://apps.apple.com/us/app/uyim-shartnoma-va-tolov/id6785392094",
  android: "https://play.google.com/store/apps/details?id=uz.uysot.uyim",
};
const U = navigator.userAgent || navigator.vendor;
const Ae = /android/i.test(U);
const Le = /iPad|iPhone|iPod/.test(U);
const ze = [
  {
    key: "ios",
    href: $.ios,
    title: "App Store",
    icon: <Pe className="h-6 w-6" />,
    visible: !Ae,
  },
  {
    key: "android",
    href: $.android,
    title: "Google Play",
    icon: <Se className="h-6 w-6" />,
    visible: !Le,
  },
];
export const Ie = () => {
  const { t: t_1 } = useTranslation();
  const e = ze.filter((t) => t.visible && t.href);
  if (e.length) {
    return (
      <section className="flex w-full max-w-[600px] flex-col items-center gap-5 rounded-2xl border border-solid border-line bg-surface p-6 text-center sm:flex-row sm:p-8 sm:text-left">
        <img src={src} className="h-16 w-16 shrink-0 rounded-2xl" alt="UYIM" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="m-0 text-xl font-semibold text-fg">UYIM</h2>
          <p className="m-0 text-sm text-fg-muted">
            {t_1("integration.Shartnoma_tolov_va_qurilish_jarayonini_kuzatish_uchun_mobil_ilova", {
              defaultValue: "Shartnoma, to'lov va qurilish jarayonini kuzatish uchun mobil ilova",
            })}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-center gap-2 sm:flex-col">
          {e.map((t) => (
            <a
              key={t.key}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 min-w-[150px] items-center gap-2 rounded-lg bg-[#000] px-3 text-white hover:text-white hover:opacity-85 dark:border dark:border-solid dark:border-[#5f6368]"
            >
              {t.icon}
              <span className="text-base font-semibold">{t.title}</span>
            </a>
          ))}
        </div>
      </section>
    );
  }
  return null;
};
