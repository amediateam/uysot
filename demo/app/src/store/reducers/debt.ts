// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  debtListActiveIds: [],
  debtListIgnoredIds: [],
  graphicPaymentActiveIds: [],
  graphicPaymentIgnoredIds: [],
  checked: false,
  isInfo: false,
  graphicPaymentChecked: false,
};
const b1 = createSlice({
  name: "debt",
  initialState,
  reducers: {
    setChecked: (e, t) => {
      e.checked = t.payload;
    },
    setGraphicPaymentChecked: (e, t) => {
      e.graphicPaymentChecked = t.payload;
    },
    setDebtActiveIds: (e, t) => {
      e.debtListActiveIds = t.payload.ids;
    },
    setDebtIgnoreIds: (e, t) => {
      e.debtListIgnoredIds = t.payload;
    },
    setGraphicPaymentActiveIds: (e, t) => {
      e.graphicPaymentActiveIds = t.payload.ids;
    },
    setGraphicPaymentIgnoreIds: (e, t) => {
      e.graphicPaymentIgnoredIds = t.payload;
    },
    setIsInfo: (e, t) => {
      e.isInfo = t.payload;
    },
    clearGraphicPaymentStates: (e) => {
      e.graphicPaymentActiveIds = [];
      e.graphicPaymentChecked = false;
      e.graphicPaymentIgnoredIds = [];
    },
  },
});
const {
  setDebtActiveIds,
  setDebtIgnoreIds,
  setChecked,
  setIsInfo,
  setGraphicPaymentActiveIds,
  setGraphicPaymentIgnoreIds,
  setGraphicPaymentChecked,
  clearGraphicPaymentStates,
} = b1.actions;
export { b1 };
