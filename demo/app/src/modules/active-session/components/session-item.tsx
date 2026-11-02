// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (1)
import { useTranslation } from "react-i18next";
import { VU } from "@/modules/active-session/api";
import * as A from "react/jsx-runtime";
import { jU, BU } from "@/assets/index";
function SessionItemComponent({ session, onDisconnect }) {
  const { t: t_1 } = useTranslation();
  const n =
    session.app && session.app !== session.device
      ? `${session.app} - ${session.device}`
      : session.device;
  const i = `${VU(session.location)} • ${session.ipAddress} • ${t_1("login.Songgi_faollik")}: ${
    session.lastActiveDateTime
  }`;
  return (
    <>
      <div className="group relative">
        <div className="grid grid-cols-[38px_1fr] gap-3 items-start w-full">
          <div className="shrink-0 w-[38px] h-[38px] flex items-center justify-center bg-[#f4f4f5] rounded-[10px]">
            {session.appType === "UYSOT_WEB" ? (
              <img src={jU} alt="web" className="w-full h-full object-cover" />
            ) : (
              <img src={BU} alt="mobile" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1 min-w-full relative flex items-center justify-between">
            <div className="flex-1 grid">
              <p className="font-medium text-sm text-[#26272b] mb-1 w-full truncate" title={n}>
                {n}
              </p>
              <div className="text-[13px] text-[#a0a0ab] leading-snug w-full truncate" title={i}>
                {i}
              </div>
            </div>
            <button
              type="button"
              className="right-3 opacity-0 hidden group-hover:block group-hover:opacity-100 transition-opacity duration-200 bg-red-500 rounded-lg px-[18px] h-[27px] border-none outline-none text-white font-medium cursor-pointer text-[12px]"
              onClick={() => onDisconnect(session.id)}
            >
              {t_1("global.Uzish")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export { SessionItemComponent as Q_ };
