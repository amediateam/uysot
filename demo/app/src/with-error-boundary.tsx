// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (1)
import * as A from "react/jsx-runtime";
import { t as t_1 } from "@/i18n/t";
import { Button } from "antd";
import { aL as AL } from "@/assets/icons/message-question-icon";
import J from "react";
import { Eh, Ch, yL, bL, _L } from "@/bootstrap/chunk-recovery";
import { sL } from "@/services/sentry";
import { by as By } from "@/components/error-boundary/ChunkRecoveryFallback";
function _s(e) {
  const t = e.displayName || e.name || "Component";
  const RComponent = () => (
    <div
      className="flex h-[38px] cursor-pointer items-center gap-[8px] border border-solid border-red-500 p-[6px]"
      onClick={() => {
        document.getElementById("feadback")?.click();
      }}
    >
      🤯{t_1("shaxmatka.Xatolik_mavjud")?.toString()}⚠️
      <Button size="small" className="flex items-center gap-[4px]">
        <AL className="size-[16px]" /> {t_1("global.Xabar_berish")?.toString()}
      </Button>
    </div>
  );
  if (typeof e === "function") {
    let WrappedWithErrorBoundary = function (a) {
      try {
        return <I {...a} />;
      } catch {
        return RComponent();
      }
    };
    class I extends J.Component {
      state = {
        hasError: false,
        componentStack: "",
        recovering: false,
        chunkFailed: false,
      };
      benignRecoveryCount = 0;
      static getDerivedStateFromError() {
        return {
          hasError: true,
        };
      }
      componentDidCatch(o, s) {
        const l = Eh(o);
        if (l && Ch("render-boundary", o)) {
          this.setState({
            recovering: true,
          });
          return;
        }
        if (
          l &&
          (this.setState({
            chunkFailed: true,
          }),
          navigator.onLine === false)
        ) {
          return;
        }
        this.setState({
          componentStack: s.componentStack,
        });
        const componentName = yL(s.componentStack || "");
        const errorLine = bL(o);
        if (_L(o) && this.benignRecoveryCount < 3) {
          this.benignRecoveryCount += 1;
          this.setState({
            hasError: false,
          });
          return;
        }
        const d = Math.floor(Date.now() / 60000);
        sL(o, {
          fingerprint: l
            ? ["chunk-load-exhausted"]
            : [componentName, window.location.pathname, String(d)],
          ...(l && {
            level: "warning",
          }),
          tags: {
            error_type: "render_error",
            component: "high",
            componentUrl: window.location.href,
            componentName,
            boundaryComponent: t,
            errorLine,
            allClientError: "true",
            ...(l && {
              chunk_load: "exhausted",
            }),
          },
          contexts: {
            react: {
              componentStack: s.componentStack,
              wrappedComponent: t,
            },
          },
        });
      }
      render() {
        if (this.state.recovering) {
          return <By delayMs={1500} />;
        }
        if (this.state.hasError && this.state.chunkFailed) {
          return <By />;
        }
        if (this.state.hasError) {
          return RComponent();
        }
        return A.jsx(e, {
          ...this.props,
        });
      }
    }
    I.displayName = `ErrorBoundary(${t})`;
    WrappedWithErrorBoundary.displayName = `withErrorBoundary(${t})`;
    return WrappedWithErrorBoundary;
  }
  return e;
}
export { _s };
