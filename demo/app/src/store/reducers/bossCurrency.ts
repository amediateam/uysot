// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currency: undefined,
  houses: [],
  buildings: [],
  type: "price",
  monthType: "overallAmount",
  monthCurrency: "USD",
  discountCurrency: "USD",
  discountBuildings: [],
  discountHouses: [],
};
const r1 = createSlice({
  name: "bossCurrency",
  initialState,
  reducers: {
    setBossCurrency: (e, t) => {
      e.currency = t.payload;
    },
    setChangeHouses: (e, t) => {
      e.houses = t.payload;
    },
    setChangeBuildings: (e, t) => {
      e.buildings = t.payload;
    },
    setChangeDiscountHouses: (e, t) => {
      e.discountHouses = t.payload;
    },
    setChangeDiscountBuildings: (e, t) => {
      e.discountBuildings = t.payload;
    },
    setChangeType: (e, t) => {
      e.type = t.payload;
    },
    setChangeMonthType: (e, t) => {
      e.monthType = t.payload;
    },
    setChangeMonthCurrency: (e, t) => {
      e.monthCurrency = t.payload;
    },
    setChangeDiscountCurrency: (e, t) => {
      e.discountCurrency = t.payload;
    },
  },
});
const {
  setBossCurrency,
  setChangeHouses,
  setChangeBuildings,
  setChangeMonthType,
  setChangeMonthCurrency,
  setChangeDiscountCurrency,
  setChangeType,
  setChangeDiscountBuildings,
  setChangeDiscountHouses,
} = r1.actions;
export { r1 };
