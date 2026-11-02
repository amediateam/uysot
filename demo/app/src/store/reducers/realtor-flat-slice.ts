// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isProfit: false,
  print: {
    visible: false,
  },
};
const KC = createSlice({
  initialState,
  name: "realtor-flat-slice",
  reducers: {
    setRealtorFlatProfit: (e) => {
      e.isProfit = !e.isProfit;
    },
    setPrint: (e, t) => {
      e.print = t.payload;
    },
  },
});
const { setPrint, setRealtorFlatProfit } = KC.actions;
export { KC };
