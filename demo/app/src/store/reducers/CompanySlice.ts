// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  companyId: 0,
  token: "",
};
const s1 = createSlice({
  name: "CompanySlice",
  initialState,
  reducers: {
    setCompanyId: (e, t) => {
      e.companyId = t.payload;
    },
    setVisualAuthToken: (e, t) => {
      e.token = t.payload;
    },
  },
});
const { setCompanyId, setVisualAuthToken } = s1.actions;
export { s1 };
