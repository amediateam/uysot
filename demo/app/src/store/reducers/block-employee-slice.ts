// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  actions: [],
  isSubmit: false,
};
const MC = createSlice({
  name: "block-employee-slice",
  initialState,
  reducers: {
    setBlockEmployeeAction: (e, t) => {
      if (e.actions?.some(({ name }) => name === t.payload.name)) {
        e.actions = e.actions?.map((r) => {
          if (r?.name === t?.payload?.name) {
            return {
              ...r,
              ...t.payload,
            };
          }
          return r;
        });
      } else {
        e.actions = [...(e.actions || []), t.payload];
      }
    },
    setClearBlockEmployeeActions: (e) => {
      e.actions = [];
      e.isSubmit = false;
    },
    setBlockEmployeeIsSubmit: (e, t) => {
      e.isSubmit = t.payload;
    },
  },
});
const { setBlockEmployeeAction, setClearBlockEmployeeActions, setBlockEmployeeIsSubmit } =
  MC.actions;
export { MC };
