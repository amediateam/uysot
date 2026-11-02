// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (16)
import { useTranslation } from "react-i18next";
import * as v from "react";
import { M5, kC } from "@/modules/desktop-agent/errors";
import { t9 } from "@/services/desktop-agent";
import { message, Dropdown, Menu } from "antd";
import * as A from "react/jsx-runtime";
import { vH as VH } from "@/assets/icons/contract/ArrowLeftIcon";
import { vi as Vi } from "@/components/icon/icon-lite";
import { Ph } from "@/global/button/Button";
import { pH as PH1 } from "@/assets/icons/ChevronDownIcon";
const gH = "desktop-agent";
const mH = ["darwin-aarch64", "darwin-x86_64"];
const yH = (e = window.location.hostname) => e.endsWith(".vercel.app");
const _H = (e = window.location.hostname) =>
  e.includes("uysotdev") || e === "localhost" || e === "127.0.0.1" || yH(e);
const ei = () => {
  if (_H()) {
    return "test";
  }
  return "prod";
};
const Tc = (e = ei()) => `/${gH}/${e}`;
const bH = (e = ei()) => `${window.location.origin}${Tc(e)}/latest.json`;
const SH = async (e = ei()) => {
  try {
    const t = await fetch(bH(e));
    if (t.ok) {
      return await t.json();
    }
    return null;
  } catch {
    return null;
  }
};
const EH = (e, t = ei()) => `Uysot_Desktop_Agent_${e}_${t}_x64-setup.exe`;
const CH = (e, t = ei(), r = "aarch64") => `Uysot_Desktop_Agent_${e}_${t}_${r}.dmg`;
const rb = (version, t = ei(), r = "windows", n = "aarch64") => {
  const i = r === "macos" ? CH(version, t, n) : EH(version, t);
  return `${window.location.origin}${Tc(t)}/${i}`;
};
const wf = (e, t, r = window.location.origin) => {
  const n = e?.platforms?.[t];
  if (!n) {
    return null;
  }
  const i = n.installerUrl ?? (t === "windows-x86_64" ? n.url : undefined);
  if (i) {
    if (i.startsWith("http://") || i.startsWith("https://")) {
      return i;
    }
    return `${r}${i.startsWith("/") ? "" : "/"}${i}`;
  }
  return null;
};
const xH = async (e, t = ei()) => {
  const r = await SH(t);
  if (e === "macos") {
    for (const i of mH) {
      const a = wf(r, i);
      if (a) {
        return a;
      }
      const o = r?.platforms?.[i]?.url;
      if (o?.endsWith(".dmg")) {
        return wf(
          {
            version: r?.version ?? "",
            platforms: {
              [i]: {
                url: o,
                installerUrl: o,
              },
            },
          },
          i
        );
      }
    }
    if (r?.version) {
      return rb(r.version, t, "macos", "aarch64");
    }
    return `${window.location.origin}${Tc(t)}/Uysot_Desktop_Agent_latest_${t}_aarch64.dmg`;
  }
  const n = wf(r, "windows-x86_64");
  return (
    n ||
    (r?.version
      ? rb(r.version, t, "windows")
      : `${window.location.origin}${Tc(t)}/Uysot_Desktop_Agent_latest_${t}_x64-setup.exe`)
  );
};
const wH = ["windows", "macos"];
const nb = {
  windows: "global.Windows_uchun_yuklab_oling",
  macos: "global.macOS_uchun_yuklab_oling",
};
export const PH = ({
  view,
  onBack,
  onSwitchToDownload,
  onSwitchToStart,
  onAgentReady,
  isRetryingLogin = false,
}) => {
  const { t: t_1 } = useTranslation();
  const [s, setS] = v.useState(false);
  const [c, setC] = v.useState(false);
  const d = v.useMemo(() => ei(), []);
  const f = v.useMemo(() => M5(), []);
  const h = view === "not_running";
  const onClick = async () => {
    setC(true);
    try {
      if (await t9()) {
        await onAgentReady();
        return;
      }
      message.warning(t_1("global.Desktop_agent_ishga_tushmadi"));
    } finally {
      setC(false);
    }
  };
  const y = async (m) => {
    setS(true);
    try {
      kC();
      const b = await xH(m, d);
      window.open(b, "_blank", "noopener,noreferrer");
    } finally {
      setS(false);
    }
  };
  return (
    <div className="!m-0 flex w-full flex-col items-center gap-[24px] p-[40px]">
      <div className="flex w-full items-start">
        <button
          type="button"
          aria-label={t_1("my_calls.Ortga")}
          className="cursor-pointer border-0 bg-transparent p-0"
          onClick={onBack}
        >
          <VH className="size-[32px]" />
        </button>
      </div>
      <div className="flex flex-col items-center pt-[8px]">
        <div className="flex size-[64px] items-center justify-center rounded-[32px] bg-[#e0f2f1]">
          <Vi name="laptop" className="size-[32px] text-[#00897b]" />
        </div>
      </div>
      <div className="flex w-full max-w-[372px] flex-col gap-[6px] text-center">
        <h2 className="m-0 text-[24px] font-medium leading-normal text-[#434343]">
          {t_1(
            h ? "global.Desktop_agentni_ishga_tushiring" : "global.Desktop_agentni_yuklab_oling"
          )}
        </h2>
        <p className="m-0 text-[14px] leading-[20px] text-[#6b7280]">
          {t_1(
            h
              ? "global.Tizimga_kirish_uchun_desktop_ilovani_ishga_tushiring"
              : "global.Qurilmani_tasdiqlash_uchun_Desktop_Agent_talab_qilinadi"
          )}
        </p>
      </div>
      {h ? (
        <Ph
          type="primary"
          loading={c || isRetryingLogin}
          className="flex h-[44px] min-w-[282px] items-center justify-center gap-[8px] rounded-[8px] text-[16px] font-semibold"
          onClick={onClick}
        >
          <div className="flex items-center justify-center gap-[8px]">
            <Vi name="LinkExternalIcon" className="size-[20px]" />
            <span>{t_1("global.Ilovani_ochish")}</span>
          </div>
        </Ph>
      ) : (
        <div className="flex min-w-[282px] overflow-hidden rounded-[8px] shadow-none">
          <Ph
            type="primary"
            loading={s}
            className="!flex h-[44px] flex-1 items-center justify-center !rounded-none !rounded-l-[8px] border-0 text-[16px] font-semibold"
            onClick={() => y(f)}
          >
            <div className="flex items-center justify-center gap-[8px]">
              <span className="text-white [&_path]:!fill-white [&_path]:!stroke-white">
                <Vi name={f === "macos" ? "macos" : "windows"} className="size-[20px]" />
              </span>
              <span>{t_1(nb[f])}</span>
            </div>
          </Ph>
          <Dropdown
            disabled={s}
            trigger={["click"]}
            placement="bottomRight"
            overlay=<Menu className="min-w-[220px] rounded-[8px] py-[4px]">
              {wH.map((m) => (
                <Menu.Item key={m} className="!m-0 !px-[12px] !py-[10px]" onClick={() => y(m)}>
                  <div className="flex items-center gap-[10px]">
                    <Vi name={m === "macos" ? "macos" : "windows"} className="size-[20px]" />
                    <span className="text-[14px] font-medium text-[#464255]">{t_1(nb[m])}</span>
                  </div>
                </Menu.Item>
              ))}
            </Menu>
          >
            <button
              type="button"
              aria-label={t_1("global.Ilovani_yuklab_olish")}
              disabled={s}
              className="flex h-[44px] w-[44px] shrink-0 cursor-pointer items-center justify-center border-0 border-l border-solid border-white/30 bg-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              <PH1 fill="#fff" size={16} />
            </button>
          </Dropdown>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-[3px] text-[12px] text-[#6b7280]">
        <span>{t_1(h ? "global.Ilova_ornatilmaganmi" : "global.Ilova_ornatilganmi")}</span>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-[2px] border-0 bg-transparent p-0 text-[12px] font-semibold text-[#00897b]"
          onClick={h ? onSwitchToDownload : onSwitchToStart}
        >
          {t_1(h ? "global.Ilovnai_yuklab_olish" : "global.Ilovani_ochish")}
          <Vi name="LinkExternalIcon" className="size-[11px] text-[#00897b]" />
        </button>
      </div>
    </div>
  );
};
