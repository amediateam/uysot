// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  visible: false,
  dynamicNumber: Math.random() * 10,
};
const C1 = createSlice({
  name: "house-history",
  initialState,
  reducers: {
    setVisibleHouseHistory: (e, t) => {
      e.id = t.payload?.id;
      e.visible = t.payload.visible;
      e.dynamicNumber = t.payload?.dynamicNumber;
    },
  },
});
const { setVisibleHouseHistory } = C1.actions;
export { C1 };
