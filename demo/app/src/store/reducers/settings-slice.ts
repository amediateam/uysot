// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  smartButtonVisible: {
    open: false,
    id: null,
  },
};
const $C = createSlice({
  name: "settings-slice",
  initialState,
  reducers: {
    setSmartButtonVisible: (e, t) => {
      e.smartButtonVisible = t.payload;
    },
  },
});
const { setSmartButtonVisible } = $C.actions;
export { $C };
