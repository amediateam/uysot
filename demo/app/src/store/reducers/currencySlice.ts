// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isModalOpen: false,
  selectedCurrency: undefined,
  mainCurrency: undefined,
  houseCurrency: undefined,
};
const qC = createSlice({
  name: "currencySlice",
  initialState,
  reducers: {
    openModal: (e, t) => {
      e.isModalOpen = t.payload.isOpen;
      e.selectedCurrency = t.payload.data;
    },
    setMainCurrency: (e, t) => {
      e.mainCurrency = t.payload;
    },
    setHouseCurrency: (e, t) => {
      e.houseCurrency = t.payload;
    },
  },
});
const { openModal, setMainCurrency, setHouseCurrency } = qC.actions;
export { qC };
