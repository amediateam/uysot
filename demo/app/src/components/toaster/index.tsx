// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (11)
import J from "react";
import * as v from "react";
import { BL, zL, HL, zs, FL, UL, WL, hr, VL, jL, $L } from "@/components/toaster/state";
import * as A from "react/jsx-runtime";
import { TL } from "@/components/toaster/asserts";
import qn from "react-dom";
const EL = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    height="20"
    width="20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);
const CL = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    height="20"
    width="20"
  >
    <path
      fillRule="evenodd"
      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
      clipRule="evenodd"
    />
  </svg>
);
const xL = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    height="20"
    width="20"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
      clipRule="evenodd"
    />
  </svg>
);
const wL = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    height="20"
    width="20"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);
const PL = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IL = (toast_type) => {
  switch (toast_type) {
    case "success":
      return EL;
    case "info":
      return xL;
    case "warning":
      return CL;
    case "error":
      return wL;
    default:
      return null;
  }
};
const useRL = () => {
  const [e, setE] = J.useState(document.hidden);
  J.useEffect(() => {
    const r = () => {
      setE(document.hidden);
    };
    document.addEventListener("visibilitychange", r);
    return () => window.removeEventListener("visibilitychange", r);
  }, []);
  return e;
};
const Toast = ({
  invert,
  toast,
  unstyled,
  interacting,
  setHeights,
  visibleToasts,
  heights,
  index,
  toasts,
  expanded,
  removeToast,
  defaultRichColors,
  closeButton,
  style,
  cancelButtonStyle,
  actionButtonStyle,
  className = "",
  descriptionClassName = "",
  duration,
  position,
  gap,
  loadingIcon,
  expandByDefault,
  classNames,
  icons,
  closeButtonAriaLabel = "Close toast",
  pauseWhenPageIsHidden,
  cn,
}) => {
  const [T, setT] = J.useState(false);
  const [F, setF] = J.useState(false);
  const [D, setD] = J.useState(false);
  const [U, setU] = J.useState(false);
  const [L, setL] = J.useState(0);
  const [B, setB] = J.useState(0);
  const KRef = J.useRef(null);
  const eeRef = J.useRef(null);
  const te = index === 0;
  const ue = index + 1 <= visibleToasts;
  const toast_type = toast.type;
  const de = toast.dismissible !== false;
  const Re = toast.className || "";
  const Ae = toast.descriptionClassName || "";
  const he = J.useMemo(
    () => heights.findIndex((Te) => Te.toastId === toast.id) || 0,
    [heights, toast.id]
  );
  const Fe = J.useMemo(() => toast.closeButton ?? closeButton, [toast.closeButton, closeButton]);
  const Be = J.useMemo(() => toast.duration || duration || BL, [toast.duration, duration]);
  const yeRef = J.useRef(0);
  const WeRef = J.useRef(0);
  const qeRef = J.useRef(0);
  const VeRef = J.useRef(null);
  const [fe, le] = position.split("-");
  const _e = J.useMemo(
    () =>
      heights.reduce((acc, height, index_1) => {
        if (index_1 >= he) {
          return acc;
        }
        return acc + height.height;
      }, 0),
    [heights, he]
  );
  const Ee = useRL();
  const Ge = toast.invert || invert;
  const It = toast_type === "loading";
  WeRef.current = J.useMemo(() => he * gap + _e, [he, _e]);
  J.useEffect(() => {
    setT(true);
  }, []);
  J.useLayoutEffect(() => {
    if (!T) {
      return;
    }
    const eeRef_current = eeRef.current;
    const height = eeRef_current.style.height;
    eeRef_current.style.height = "auto";
    const height_1 = eeRef_current.getBoundingClientRect().height;
    eeRef_current.style.height = height;
    setB(height_1);
    setHeights((dt) => {
      if (dt.find((ft) => ft.toastId === toast.id)) {
        return dt.map((ft) => {
          if (ft.toastId === toast.id) {
            return {
              ...ft,
              height: height_1,
            };
          }
          return ft;
        });
      }
      return [
        {
          toastId: toast.id,
          height: height_1,
          position: toast.position,
        },
        ...dt,
      ];
    });
  }, [T, toast.title, toast.description, setHeights, toast.id]);
  const Ke = J.useCallback(() => {
    setF(true);
    setL(WeRef.current);
    setHeights((Te) => Te.filter((Ye) => Ye.toastId !== toast.id));
    setTimeout(() => {
      removeToast(toast);
    }, zL);
  }, [toast, removeToast, setHeights, WeRef]);
  J.useEffect(() => {
    if (
      (toast.promise && toast_type === "loading") ||
      toast.duration === Infinity ||
      toast.type === "loading"
    ) {
      return;
    }
    let Te;
    let Ye = Be;
    if (expanded || interacting || (pauseWhenPageIsHidden && Ee)) {
      (() => {
        if (qeRef.current < yeRef.current) {
          const Yt = new Date().getTime() - yeRef.current;
          Ye = Ye - Yt;
        }
        qeRef.current = new Date().getTime();
      })();
    } else if (Ye !== Infinity) {
      yeRef.current = new Date().getTime();
      Te = setTimeout(() => {
        toast.onAutoClose?.(toast);
        Ke();
      }, Ye);
    }
    return () => clearTimeout(Te);
  }, [
    expanded,
    interacting,
    expandByDefault,
    toast,
    Be,
    Ke,
    toast.promise,
    toast_type,
    pauseWhenPageIsHidden,
    Ee,
  ]);
  J.useEffect(() => {
    const eeRef_current = eeRef.current;
    if (eeRef_current) {
      const height = eeRef_current.getBoundingClientRect().height;
      setB(height);
      setHeights((Me) => [
        {
          toastId: toast.id,
          height,
          position: toast.position,
        },
        ...Me,
      ]);
      return () => setHeights((Me) => Me.filter((dt) => dt.toastId !== toast.id));
    }
  }, [setHeights, toast.id]);
  J.useEffect(() => {
    if (toast.delete) {
      Ke();
    }
  }, [Ke, toast.delete]);
  function HtComponent() {
    if (icons?.loading) {
      return (
        <div className="sonner-loader" data-visible={toast_type === "loading"}>
          {icons.loading}
        </div>
      );
    }
    if (loadingIcon) {
      return (
        <div className="sonner-loader" data-visible={toast_type === "loading"}>
          {loadingIcon}
        </div>
      );
    }
    return <TL visible={toast_type === "loading"} />;
  }
  return (
    <li
      aria-live={toast.important ? "assertive" : "polite"}
      aria-atomic="true"
      role="status"
      tabIndex={0}
      ref={eeRef}
      className={cn(
        className,
        Re,
        classNames?.toast,
        toast?.classNames?.toast,
        classNames?.default,
        classNames?.[toast_type],
        toast?.classNames?.[toast_type]
      )}
      data-sonner-toast=""
      data-rich-colors={toast.richColors ?? defaultRichColors}
      data-styled={!(toast.jsx || toast.unstyled || unstyled)}
      data-mounted={T}
      data-promise={!!toast.promise}
      data-removed={F}
      data-visible={ue || !!(expanded || (expandByDefault && T))}
      data-y-position={fe}
      data-x-position={le}
      data-index={index}
      data-front={te}
      data-swiping={D}
      data-dismissible={de}
      data-type={toast_type}
      data-invert={Ge}
      data-swipe-out={U}
      data-expanded={!!(expanded || (expandByDefault && T))}
      style={{
        "--index": index,
        "--toasts-before": index,
        "--z-index": toasts.length - index,
        "--offset": `${F ? L : WeRef.current}px`,
        "--initial-height": expandByDefault ? "auto" : `${B}px`,
        ...style,
        ...toast.style,
      }}
      onPointerDown={(Te) => {
        if (!(It || !de)) {
          KRef.current = new Date();
          setL(WeRef.current);
          Te.target.setPointerCapture(Te.pointerId);
          if (Te.target.tagName !== "BUTTON") {
            setD(true);
            VeRef.current = {
              x: Te.clientX,
              y: Te.clientY,
            };
          }
        }
      }}
      onPointerUp={() => {
        if (U || !de) {
          return;
        }
        VeRef.current = null;
        const Te = Number(
          eeRef.current?.style.getPropertyValue("--swipe-amount").replace("px", "") || 0
        );
        const Ye = new Date().getTime() - KRef.current?.getTime();
        const Me = Math.abs(Te) / Ye;
        if (Math.abs(Te) >= HL || Me > 0.11) {
          setL(WeRef.current);
          toast.onDismiss?.(toast);
          Ke();
          setU(true);
          return;
        }
        eeRef.current?.style.setProperty("--swipe-amount", "0px");
        setD(false);
      }}
      onPointerMove={(Te) => {
        if (!VeRef.current || !de) {
          return;
        }
        const Ye = Te.clientY - VeRef.current.y;
        const Me = Te.clientX - VeRef.current.x;
        const Yt = (fe === "top" ? Math.min : Math.max)(0, Ye);
        const ft = Te.pointerType === "touch" ? 10 : 2;
        if (Math.abs(Yt) > ft) {
          eeRef.current?.style.setProperty("--swipe-amount", `${Ye}px`);
        } else if (Math.abs(Me) > ft) {
          VeRef.current = null;
        }
      }}
    >
      {Fe && !toast.jsx ? (
        <button
          aria-label={closeButtonAriaLabel}
          data-disabled={It}
          data-close-button
          onClick={
            It || !de
              ? () => {}
              : () => {
                  Ke();
                  toast.onDismiss?.(toast);
                }
          }
          className={cn(classNames?.closeButton, toast?.classNames?.closeButton)}
        >
          {icons?.close ?? PL}
        </button>
      ) : null}
      {toast.jsx ? (
        toast.jsx
      ) : (
        <>
          {toast_type || toast.icon || toast.promise ? (
            <div data-icon="" className={cn(classNames?.icon, toast?.classNames?.icon)}>
              {toast.promise || (toast.type === "loading" && !toast.icon)
                ? toast.icon || HtComponent()
                : null}
              {toast.type !== "loading"
                ? toast.icon || icons?.[toast_type] || IL(toast_type)
                : null}
            </div>
          ) : null}
          <div data-content="" className={cn(classNames?.content, toast?.classNames?.content)}>
            <div data-title="" className={cn(classNames?.title, toast?.classNames?.title)}>
              {typeof toast.title === "object" && !J.isValidElement(toast.title)
                ? toast.title?.message ||
                  toast.title?.errorMessage?.message ||
                  JSON.stringify(toast.title)
                : toast.title}
            </div>
            {toast.description ? (
              <div
                data-description=""
                className={cn(
                  descriptionClassName,
                  Ae,
                  classNames?.description,
                  toast?.classNames?.description
                )}
              >
                {typeof toast.description === "object" && !J.isValidElement(toast.description)
                  ? toast.description?.message || JSON.stringify(toast.description)
                  : toast.description}
              </div>
            ) : null}
          </div>
          {J.isValidElement(toast.cancel) ? (
            toast.cancel
          ) : toast.cancel && zs(toast.cancel) ? (
            <button
              data-button
              data-cancel
              style={toast.cancelButtonStyle || cancelButtonStyle}
              onClick={(Te) => {
                if (zs(toast.cancel) && de) {
                  toast.cancel.onClick?.(Te);
                  Ke();
                }
              }}
              className={cn(classNames?.cancelButton, toast?.classNames?.cancelButton)}
            >
              {toast.cancel.label}
            </button>
          ) : null}
          {J.isValidElement(toast.action) ? (
            toast.action
          ) : toast.action && zs(toast.action) ? (
            <button
              data-button
              data-action
              style={toast.actionButtonStyle || actionButtonStyle}
              onClick={(Te) => {
                if (zs(toast.action)) {
                  if (!Te.defaultPrevented) {
                    toast.action.onClick?.(Te);
                    Ke();
                  }
                }
              }}
              className={cn(classNames?.actionButton, toast?.classNames?.actionButton)}
            >
              {toast.action.label}
            </button>
          ) : null}
        </>
      )}
    </li>
  );
};
function GL(offset, mobileOffset) {
  const r = {};
  [offset, mobileOffset].forEach((n, i) => {
    const a = i === 1;
    const o = a ? "--mobile-offset" : "--offset";
    const s = a ? jL : $L;
    function l(c) {
      ["top", "right", "bottom", "left"].forEach((u) => {
        r[`${o}-${u}`] = typeof c === "number" ? `${c}px` : c;
      });
    }
    if (typeof n === "number" || typeof n === "string") {
      l(n);
    } else if (typeof n === "object" && n !== null) {
      ["top", "right", "bottom", "left"].forEach((c) => {
        const u = n[c];
        r[`${o}-${c}`] = u === undefined ? s : typeof u === "number" ? `${u}px` : u;
      });
    } else {
      l(s);
    }
  });
  return r;
}
function Ey() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "ltr";
  }
  const e = document.documentElement.getAttribute("dir");
  if (e === "auto" || !e) {
    return window.getComputedStyle(document.documentElement).direction;
  }
  return e;
}
export const YL = v.forwardRef(
  (
    {
      invert,
      position = "bottom-right",
      hotkey = ["altKey", "KeyT"],
      expand,
      closeButton,
      className,
      offset,
      theme = "light",
      richColors,
      duration,
      style,
      visibleToasts = FL,
      toastOptions,
      dir = Ey(),
      gap = UL,
      loadingIcon,
      icons,
      containerAriaLabel = "Notifications",
      pauseWhenPageIsHidden,
      mobileOffset,
      cn = WL,
    },
    ref
  ) => {
    const [x, setX] = J.useState([]);
    const I = J.useMemo(
      () =>
        Array.from(new Set([position].concat(x.filter((B) => B.position).map((B) => B.position)))),
      [x, position]
    );
    const [P, setP] = J.useState([]);
    const [expanded, setExpanded] = J.useState(false);
    const [k, setK] = J.useState(false);
    const [R, setR] = J.useState(
      theme !== "system"
        ? theme
        : typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );
    const MRef = J.useRef(null);
    const U = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
    const HRef = J.useRef(null);
    const LRef = J.useRef(false);
    const removeToast = J.useCallback((B) => {
      setX((j) => {
        if (!j.find((K) => K.id === B.id)?.delete) {
          hr.dismiss(B.id);
        }
        return j.filter(({ id }) => id !== B.id);
      });
    }, []);
    J.useEffect(
      () =>
        hr.subscribe((B) => {
          if (B.dismiss) {
            setX((j) =>
              j.map((K) => {
                if (K.id === B.id) {
                  return {
                    ...K,
                    delete: true,
                  };
                }
                return K;
              })
            );
            return;
          }
          setTimeout(() => {
            qn.flushSync(() => {
              setX((j) => {
                const K = j.findIndex((ee) => ee.id === B.id);
                if (K !== -1) {
                  return [
                    ...j.slice(0, K),
                    {
                      ...j[K],
                      ...B,
                    },
                    ...j.slice(K + 1),
                  ];
                }
                return [B, ...j];
              });
            });
          });
        }),
      []
    );
    J.useEffect(() => {
      if (theme !== "system") {
        setR(theme);
        return;
      }
      if (theme === "system") {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          setR("dark");
        } else {
          setR("light");
        }
      }
      if (!(typeof window === "undefined")) {
        window
          .matchMedia("(prefers-color-scheme: dark)")
          .addEventListener("change", ({ matches }) => {
            setR(matches ? "dark" : "light");
          });
      }
    }, [theme]);
    J.useEffect(() => {
      if (x.length <= 1) {
        setExpanded(false);
      }
    }, [x]);
    J.useEffect(() => {
      const B = (j) => {
        if (hotkey.every((ee) => j[ee] || j.code === ee)) {
          setExpanded(true);
          MRef.current?.focus();
        }
        if (
          j.code === "Escape" &&
          (document.activeElement === MRef.current ||
            MRef.current?.contains(document.activeElement))
        ) {
          setExpanded(false);
        }
      };
      document.addEventListener("keydown", B);
      return () => document.removeEventListener("keydown", B);
    }, [hotkey]);
    J.useEffect(() => {
      if (MRef.current) {
        return () => {
          if (HRef.current) {
            HRef.current.focus({
              preventScroll: true,
            });
            HRef.current = null;
            LRef.current = false;
          }
        };
      }
    }, [MRef.current]);
    if (x.length) {
      return (
        <section aria-label={`${containerAriaLabel} ${U}`} tabIndex={-1} ref={ref}>
          {I.map((B, j) => {
            const [K, ee] = B.split("-");
            return (
              <ol
                key={B}
                dir={dir === "auto" ? Ey() : dir}
                tabIndex={-1}
                ref={MRef}
                className={className}
                data-sonner-toaster
                data-theme={R}
                data-y-position={K}
                data-x-position={ee}
                style={{
                  "--front-toast-height": `${P[0]?.height || 0}px`,
                  ...GL(offset, mobileOffset),
                  "--width": `${VL}px`,
                  "--gap": `${gap}px`,
                  ...style,
                }}
                onBlur={(te) => {
                  if (LRef.current && !te.currentTarget.contains(te.relatedTarget)) {
                    LRef.current = false;
                    if (HRef.current) {
                      HRef.current.focus({
                        preventScroll: true,
                      });
                      HRef.current = null;
                    }
                  }
                }}
                onFocus={(te) => {
                  if (
                    !(
                      (te.target instanceof HTMLElement &&
                        te.target.dataset.dismissible === "false") ||
                      LRef.current
                    )
                  ) {
                    LRef.current = true;
                    HRef.current = te.relatedTarget;
                  }
                }}
                onMouseEnter={() => setExpanded(true)}
                onMouseMove={() => setExpanded(true)}
                onMouseLeave={() => {
                  if (!k) {
                    setExpanded(false);
                  }
                }}
                onPointerDown={(te) => {
                  if (
                    !(te.target instanceof HTMLElement && te.target.dataset.dismissible === "false")
                  ) {
                    setK(true);
                  }
                }}
                onPointerUp={() => setK(false)}
              >
                {x
                  .filter((te) => (!te.position && j === 0) || te.position === B)
                  .map((toast, index) => (
                    <Toast
                      key={toast.id}
                      icons={icons}
                      index={index}
                      toast={toast}
                      defaultRichColors={richColors}
                      duration={toastOptions?.duration ?? duration}
                      className={toastOptions?.className}
                      descriptionClassName={toastOptions?.descriptionClassName}
                      invert={invert}
                      visibleToasts={visibleToasts}
                      closeButton={toastOptions?.closeButton ?? closeButton}
                      interacting={k}
                      position={B}
                      style={toastOptions?.style}
                      unstyled={toastOptions?.unstyled}
                      classNames={toastOptions?.classNames}
                      cancelButtonStyle={toastOptions?.cancelButtonStyle}
                      actionButtonStyle={toastOptions?.actionButtonStyle}
                      removeToast={removeToast}
                      toasts={x.filter((Z) => Z.position == toast.position)}
                      heights={P.filter((Z) => Z.position == toast.position)}
                      setHeights={setP}
                      expandByDefault={expand}
                      gap={gap}
                      loadingIcon={loadingIcon}
                      expanded={expanded}
                      pauseWhenPageIsHidden={pauseWhenPageIsHidden}
                      cn={cn}
                    />
                  ))}
              </ol>
            );
          })}
        </section>
      );
    }
    return null;
  }
);
