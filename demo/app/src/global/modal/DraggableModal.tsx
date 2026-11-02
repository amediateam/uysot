// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (2)
import * as v from "react";
import * as A from "react/jsx-runtime";
import { Modal } from "antd";
import { getDefaultExportFromCjs } from "@/utils/interop";
import c$ from "react-draggable";
const U = getDefaultExportFromCjs(c$);
export const d$ = ({ ...rest }) => {
  const [t, setT] = v.useState(false);
  const [n, setN] = v.useState(true);
  const [bounds, setBounds] = v.useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const sRef = v.useRef(null);
  const l = (c, u) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const h = sRef.current?.getBoundingClientRect();
    if (h) {
      setBounds({
        left: -h.left + u.x,
        right: clientWidth - (h.right - u.x),
        top: -h.top + u.y,
        bottom: clientHeight - (h.bottom - u.y),
      });
    }
  };
  return (
    <>
      {rest?.openChild &&
        v.cloneElement(rest?.openChild, {
          onClick: () => setT(true),
        })}
      <Modal
        {...rest}
        title=<div
          style={{
            width: "100%",
            cursor: "move",
          }}
          onMouseOver={() => {
            if (n) {
              setN(false);
            }
          }}
          onMouseOut={() => {
            setN(true);
          }}
        >
          {rest?.title}
        </div>
        onCancel={() => {
          rest.onCancel();
          setT(false);
        }}
        visible={rest?.visible || t}
        modalRender={(c) => (
          <U disabled={n} bounds={bounds} nodeRef={sRef} onStart={(u, d) => l(u, d)}>
            <div ref={sRef}>{c}</div>
          </U>
        )}
      />
    </>
  );
};
