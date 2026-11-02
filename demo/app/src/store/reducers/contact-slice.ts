// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (2)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  tab: "info",
  isSetting: false,
  contact: {},
  isChanges: false,
};
export const a4 = createSlice({
  initialState,
  name: "contact-slice",
  reducers: {
    clear: () => initialState,
  },
});
