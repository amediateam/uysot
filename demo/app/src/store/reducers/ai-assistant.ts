// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (10)
import { createSlice } from "@reduxjs/toolkit";
import { ce } from "@/utils/storage";
import { LI, DI } from "@/constants/storage-keys";
const t0 = {
  sidebar: false,
  floating: false,
};
const q5 = () => {
  const e = ce.get(LI);
  return {
    sidebar: e?.sidebar ?? t0.sidebar,
    floating: e?.floating ?? t0.floating,
  };
};
const G5 = (viewMode) => q5()[viewMode];
const Y5 = ["sidebar", "floating"];
const K5 = (e) => {
  if (e === "sidebar" || e === "floating") {
    return e;
  }
  if (e === "modal") {
    return "floating";
  }
  return null;
};
const X5 = () => {
  const e = K5(ce.get(DI));
  if (e && Y5.includes(e)) {
    return e;
  }
  return "floating";
};
const viewMode = X5();
const initialState = {
  isOpen: G5(viewMode),
  currentChatId: null,
  viewMode,
};
const BC = createSlice({
  name: "ai-assistant",
  initialState,
  reducers: {
    setIsOpen: (e, t) => {
      e.isOpen = t.payload;
    },
    setViewMode: (e, t) => {
      e.viewMode = t.payload;
    },
    setCurrentChatId: (e, t) => {
      e.currentChatId = t.payload;
    },
  },
});
const { setIsOpen, setViewMode, setCurrentChatId } = BC.actions;
export { BC };
