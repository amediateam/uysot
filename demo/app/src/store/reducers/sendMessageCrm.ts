// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (4)
import { createSlice } from "@reduxjs/toolkit";
const M1 = {
  MOI_ZVONKI: "MOI_ZVONKI",
  PLAY_MOBILE: "PLAY_MOBILE",
};
const initialState = {
  visible: false,
  type: M1.MOI_ZVONKI,
  phone: "",
};
const D1 = createSlice({
  name: "sendMessageCrm",
  initialState,
  reducers: {
    handleOpen: (e, t) => {
      e.visible = t.payload.visible;
      e.type = t.payload.type;
      e.phone = t.payload.phone;
    },
    handleType: (e, t) => {
      e.type = t.payload;
    },
  },
});
const { handleOpen: qee, handleType: Gee } = D1.actions;
export { D1 };
