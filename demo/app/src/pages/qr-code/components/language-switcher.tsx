// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: QrCode-CXeqeBv0 (1)
import * as l from "react";
import { useTranslation } from "react-i18next";
import { R } from "@/pages/qr-code/constants";
import * as r from "react/jsx-runtime";
import { Dropdown } from "antd";
import { ChevronDown } from "lucide-react";
export const je = () => {
  const [visible, setVisible] = l.useState(false);
  const { i18n } = useTranslation();
  const s = i18n.resolvedLanguage ?? i18n.language;
  const c = R.find((n) => n.lang === s);
  return (
    <Dropdown
      trigger={["click"]}
      visible={visible}
      onVisibleChange={setVisible}
      overlay=<div className="flex flex-col rounded-lg bg-surface-elevated py-2 shadow-[0_5px_13px_rgba(0,0,0,0.16)]">
        {R.filter((n) => n.lang !== s).map((n) => (
          <button
            key={n.lang}
            type="button"
            className="flex items-center gap-3 border-none bg-transparent px-4 py-2 text-left text-base font-semibold text-fg hover:bg-surface-muted"
            onClick={() => {
              i18n.changeLanguage(n.lang);
              setVisible(false);
            }}
          >
            <img src={n.img} className="h-5 w-7 rounded object-cover" alt="" />
            {n.text}
          </button>
        ))}
      </div>
    >
      <button
        type="button"
        className="flex items-center gap-3 rounded-lg border-none bg-transparent px-3 py-2 text-base font-semibold text-fg hover:bg-surface-muted"
      >
        {c && <img src={c.img} className="h-5 w-7 rounded object-cover" alt="" />}
        {c?.text ?? s}
        <ChevronDown className="h-4 w-4 text-fg-muted" />
      </button>
    </Dropdown>
  );
};
