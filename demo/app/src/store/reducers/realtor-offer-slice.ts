// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  view: {
    visible: false,
    status: "ACCESSED",
    house: {
      id: null,
      name: null,
    },
  },
  offerTerms: {
    visible: false,
  },
  rejected: {
    visible: false,
  },
};
const XC = createSlice({
  initialState,
  name: "realtor-offer-slice",
  reducers: {
    setView: (e, t) => {
      e.view = t.payload;
    },
    setViewPage: (e, t) => {
      e.view.page = t.payload;
    },
    setHouse: (e, t) => {
      e.view.house = t.payload;
    },
    setOfferTerms: (e, t) => {
      e.offerTerms = t.payload;
    },
    setRejected: (e, t) => {
      e.rejected = t.payload;
    },
  },
});
const { setView, setHouse, setViewPage, setOfferTerms, setRejected } = XC.actions;
export { XC };
