// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const Z5 = () => {
  try {
    const e = localStorage.getItem("lead:positionMode");
    if (e && ["full", "sideBar", "modal"].includes(e)) {
      return e;
    }
  } catch {}
  try {
    const e = localStorage.getItem("lead");
    if (e) {
      const r = (typeof e === "string" ? JSON.parse(e) : e)?.positionMode;
      if (r && ["full", "sideBar", "modal"].includes(r)) {
        return r;
      }
    }
  } catch {}
  try {
    const e = localStorage.getItem("persist:common-slice");
    if (e) {
      const t = JSON.parse(e);
      const r = typeof t?.singleModal === "string" ? JSON.parse(t.singleModal) : t?.singleModal;
      if (r?.positionMode && ["full", "sideBar", "modal"].includes(r.positionMode)) {
        return r.positionMode;
      }
    }
  } catch {}
  return "sideBar";
};
const initialState = {
  singleModal: {
    positionMode: Z5(),
    sidebarWidth: 1150,
    closeValidate: undefined,
  },
};
export const t4 = createSlice({
  initialState,
  name: "common-slice",
  reducers: {
    positionMode: (e, t) => {
      e.singleModal.positionMode = t.payload;
    },
    sidebarWidth: (e, t) => {
      e.singleModal.sidebarWidth = t.payload;
    },
    clear: (e) => {
      e.singleModal.closeValidate = undefined;
    },
    closeValidate: (e, t) => {
      e.singleModal.closeValidate = t.payload;
    },
  },
});
