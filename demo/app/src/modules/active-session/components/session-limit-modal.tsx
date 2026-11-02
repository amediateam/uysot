// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (4)
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import * as v from "react";
import { FU, $U } from "@/modules/active-session/api";
import { Uv } from "@/services/api/client";
import * as A from "react/jsx-runtime";
import { UU } from "@/modules/active-session/components/session-warning";
import { Q_ } from "@/modules/active-session/components/session-item";
import { Ph } from "@/global/button/Button";
import { d$ as D } from "@/global/modal/DraggableModal";
import { Modal } from "antd";
const QF = (e) => {
  let t = 0;
  const r = requestAnimationFrame(() => {
    t = window.setTimeout(e);
  });
  return () => {
    cancelAnimationFrame(r);
    window.clearTimeout(t);
  };
};
function useZF(visible, t = false) {
  const [r, setR] = v.useState(visible || t);
  v.useEffect(() => {
    if (!(!visible || r)) {
      return QF(() => v.startTransition(() => setR(true)));
    }
  }, [visible, r]);
  const reset = v.useCallback(() => setR(t), [t]);
  return {
    mounted: r || t,
    reset,
  };
}
const FComponent = ({ eagerBody, ...rest }) => {
  const [r, setR] = v.useState(false);
  const visible = !!(rest?.visible || r);
  const a = useZF(visible, eagerBody || !!rest?.forceRender);
  v.useEffect(() => {
    if (rest?.setOpen) {
      rest?.setOpen(r);
    }
  }, [r]);
  return (
    <>
      {rest?.openChild &&
        !rest?.isDraggable &&
        v.cloneElement(rest?.openChild, {
          onClick: () => setR(true),
        })}
      {rest?.isDraggable ? (
        <D {...rest} />
      ) : (
        <Modal
          {...rest}
          onCancel={(o) => {
            if (rest.onCancel) {
              rest?.onCancel(o);
            }
            setR(false);
          }}
          afterClose={() => {
            rest?.afterClose?.();
            if (rest?.destroyOnClose) {
              a.reset();
            }
          }}
          visible={visible}
        >
          {!a.mounted && <div className="min-h-[120px]" />}
          {a.mounted &&
            (typeof rest?.children === "function"
              ? rest?.children({
                  onCancel: () => setR(false),
                })
              : rest?.children)}
        </Modal>
      )}
    </>
  );
};
function SessionLimitModal({ visible, onClose, onSignInSuccess }) {
  const { t: t_1 } = useTranslation();
  const i = useQueryClient();
  const aRef = v.useRef([]);
  const [o, setO] = v.useState(false);
  const { data = [], isLoading } = FU({
    enabled: visible,
  });
  const u = $U();
  const d = data.filter((b) => b.appType === "UYSOT_WEB");
  const f = data.filter((b) => b.appType !== "UYSOT_WEB");
  const onDisconnect = (b) => {
    aRef.current.push(b);
    i.setQueryData([Uv.ACTIVE_SESSION_USER], (p) => (p ?? []).filter((_) => _.id !== b));
  };
  const onClick = async () => {
    const aRef_current = aRef.current;
    setO(true);
    await u.mutateAsync(aRef_current).then(async () => onSignInSuccess?.());
    setO(false);
  };
  const y = (b) =>
    `flex flex-col gap-3 p-3 bg-white rounded-xl [&>*+*]:border-solid [&>*+*]:border-0 [&>*+*]:border-t [&>*+*]:border-[#e5e7eb] [&>*+*]:pt-3 ${
      b && d?.length > 1 ? "border-solid border border-[#f04438]" : ""
    }`;
  const m = d.length <= 1;
  return (
    <FComponent
      visible={visible}
      footer={null}
      closable={false}
      closeIcon={null}
      centered
      width={674}
      title={t_1("login.Faol_sessiyalar")}
      className="[&_.ant-modal-content]:rounded-2xl [&_.ant-modal-body]:p-0"
      maskStyle={{
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex-1 p-4 pt-4 pb-3 bg-[#f4f4f5] max-h-[60vh] overflow-y-auto">
        <UU />
        {isLoading ? (
          <div className="py-8 text-center text-[#a0a0ab]">{t_1("global.Yuklanmoqda")}...</div>
        ) : (
          <div className="flex flex-col gap-3">
            {d.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className={y(true)}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base text-[#101828]">WEB</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 rounded-2xl font-medium text-xs text-error-700">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1" />
                      {d.length} {t_1("login.ta_sessiya")}
                    </span>
                  </div>
                  {d.map((b) => (
                    <Q_ key={b.id} session={b} onDisconnect={onDisconnect} />
                  ))}
                </div>
              </div>
            )}
            {f.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className={y(false)}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base text-[#101828]">
                      {t_1("login.Mobil_ilova")}
                    </span>
                  </div>
                  {f.map((b) => (
                    <Q_ key={b.id} session={b} onDisconnect={onDisconnect} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-end gap-3 px-6 py-3 pl-6">
        <Ph
          type="primary"
          className="px-[28px] rounded-lg h-[36px]"
          onClick={onClick}
          disabled={o || !m}
          loading={o}
        >
          {t_1("login.Kirish")}
        </Ph>
      </div>
    </FComponent>
  );
}
export { SessionLimitModal as HU };
