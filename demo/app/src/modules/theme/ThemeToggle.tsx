// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (2)
import { useTranslation } from "react-i18next";
import { OP } from "@/modules/theme/theme-store";
import * as v from "react";
import * as A from "react/jsx-runtime";
import { e$ as E } from "@/global/dropdown/Dropdown";
import { Wl } from "@/utils/cn";
import { dH as DH } from "@/assets/icons/sun-icon";
import { uH as UH } from "@/assets/icons/moon-icon";
import { fH as FH } from "@/assets/icons/system-theme-icon";
const ol = {
  light: <DH width={18} height={18} />,
  dark: <UH width={18} height={18} />,
  system: <FH width={18} height={18} />,
};
function ThemeToggle({ className, compact = true }) {
  const { t: t_1 } = useTranslation();
  const { mode, resolved, setMode } = OP();
  const [visible, setVisible] = v.useState(false);
  const l = {
    system: t_1("global.Tizim"),
    light: t_1("global.Yorug"),
    dark: t_1("global.Qorongu"),
  };
  const c = mode === "system" ? (resolved === "dark" ? ol.dark : ol.light) : ol[mode];
  const u = ["system", "light", "dark"];
  return (
    <E
      visible={visible}
      onVisibleChange={setVisible}
      overlay=<div className="min-w-[148px] overflow-hidden rounded-xl border border-solid border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-1.5 shadow-antd">
        {u.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => {
              setMode(d);
              setVisible(false);
            }}
            className={Wl(
              "flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3 py-2 text-left text-sm text-[var(--color-fg)] transition-colors hover:bg-[var(--color-bg-muted)]",
              mode === d && "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
            )}
          >
            <span className="flex h-5 w-5 items-center justify-center opacity-90">{ol[d]}</span>
            <span className="font-medium">{l[d]}</span>
          </button>
        ))}
      </div>
      placement="bottomRight"
      trigger={["click"]}
    >
      <button
        type="button"
        aria-label={t_1("global.Mavzu")}
        title={t_1("global.Mavzu")}
        className={Wl(
          "flex cursor-pointer items-center justify-center rounded-lg border-none bg-transparent p-0 text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg)]",
          compact ? "ml-2 h-8 w-8" : "gap-2 px-2 py-1",
          className
        )}
      >
        {c}
        {!compact && <span className="text-sm font-medium">{l[mode]}</span>}
      </button>
    </E>
  );
}
export { ThemeToggle as hH };
