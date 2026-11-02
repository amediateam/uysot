// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isProfit: false,
  searchVisible: false,
};
const JC = createSlice({
  name: "realtor-search-slice",
  initialState,
  reducers: {
    setRealtorSearchProfit: (e) => {
      e.isProfit = !e.isProfit;
    },
    setSearchVisible: (e, t) => {
      e.searchVisible = t.payload;
    },
  },
});
const { setRealtorSearchProfit, setSearchVisible } = JC.actions;
export { JC };
