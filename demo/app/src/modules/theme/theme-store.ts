// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (14)
import { FI } from "@/constants/storage-keys";
import { ce } from "@/utils/storage";
import { create } from "zustand";
const JU = ["system", "light", "dark"];
const TP = FI;
const QU = "#006858";
const ZU = "#14191f";
const eH = (e) => typeof e === "string" && JU.includes(e);
const tH = () => {
  const e = ce.get(TP);
  if (eH(e)) {
    return e;
  }
  return "system";
};
const RP = (e) => {
  if (e === "system") {
    if (typeof window === "undefined" || !window.matchMedia) {
      return "light";
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }
  return e;
};
const pp = (e) => {
  const t = RP(e);
  const document_documentElement = document.documentElement;
  document_documentElement.classList.toggle("dark", t === "dark");
  document_documentElement.dataset.theme = t;
  document_documentElement.style.colorScheme = t;
  const n = document.querySelector('meta[name="theme-color"]');
  if (n) {
    n.setAttribute("content", t === "dark" ? ZU : QU);
  }
  return t;
};
const rH = (e) => {
  ce.set(TP, e);
};
const tb = typeof window === "undefined" ? "system" : tH();
const ya = create((e, t) => ({
  mode: tb,
  resolved: typeof window === "undefined" ? "light" : RP(tb),
  setMode: (r) => {
    rH(r);
    const n = pp(r);
    e({
      mode: r,
      resolved: n,
    });
  },
  syncResolved: () => {
    const { mode } = t();
    const n = pp(mode);
    e({
      resolved: n,
    });
  },
}));
const sH = (e = "light") => {
  if (e === "dark") {
    return {
      background: "transparent",
      textColor: "#9aa3b2",
      fontSize: 11,
      axis: {
        domain: {
          line: {
            stroke: "#2c3542",
            strokeWidth: 1,
          },
        },
        legend: {
          text: {
            fill: "#9aa3b2",
          },
        },
        ticks: {
          line: {
            stroke: "#2c3542",
            strokeWidth: 1,
          },
          text: {
            fill: "#9aa3b2",
          },
        },
      },
      grid: {
        line: {
          stroke: "#2c3542",
          strokeWidth: 1,
        },
      },
      crosshair: {
        line: {
          stroke: "#9aa3b2",
          strokeWidth: 1,
          strokeOpacity: 0.45,
        },
      },
      legends: {
        text: {
          fill: "#9aa3b2",
        },
      },
      tooltip: {
        container: {
          background: "#222a34",
          color: "#e6e9ee",
          fontSize: 12,
          borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          border: "1px solid #2c3542",
        },
      },
      labels: {
        text: {
          fill: "#e6e9ee",
        },
      },
      annotations: {
        text: {
          fill: "#e6e9ee",
        },
        outline: {
          stroke: "#2c3542",
        },
        link: {
          stroke: "#2c3542",
        },
        symbol: {
          fill: "#9aa3b2",
        },
      },
    };
  }
  return {
    background: "transparent",
    textColor: "#6c737f",
    fontSize: 11,
    axis: {
      domain: {
        line: {
          stroke: "#e5e7eb",
          strokeWidth: 1,
        },
      },
      legend: {
        text: {
          fill: "#6c737f",
        },
      },
      ticks: {
        line: {
          stroke: "#e5e7eb",
          strokeWidth: 1,
        },
        text: {
          fill: "#6c737f",
        },
      },
    },
    grid: {
      line: {
        stroke: "#e5e7eb",
        strokeWidth: 1,
      },
    },
    legends: {
      text: {
        fill: "#6c737f",
      },
    },
    labels: {
      text: {
        fill: "#111927",
      },
    },
    tooltip: {
      container: {
        background: "#ffffff",
        color: "#111927",
        fontSize: 12,
        borderRadius: 8,
        boxShadow: "0 4px 16px rgba(16,24,40,0.08)",
      },
    },
  };
};
const lH = (e = "light") => {
  if (e === "dark") {
    return "#e6e9ee";
  }
  return "#333333";
};
const OP = () => {
  const mode = ya((n) => n.mode);
  const t = ya((n) => n.resolved);
  const setMode = ya((n) => n.setMode);
  return {
    mode,
    resolved: t,
    setMode,
    isDark: t === "dark",
    nivoTheme: sH(t),
    nivoLabelColor: lH(t),
  };
};
export { OP, pp, ya };
