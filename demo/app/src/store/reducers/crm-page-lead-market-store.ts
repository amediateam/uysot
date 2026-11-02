// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (2)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isFilter: false,
  hasFilter: false,
  filter: {},
  total: 0,
  activeLeads: {},
};
export const D5 = createSlice({
  initialState,
  name: "crm-page-lead-market-store",
  reducers: {
    clear: () => initialState,
  },
});
