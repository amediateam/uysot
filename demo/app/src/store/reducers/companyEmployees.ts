// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  editAndCreateModalOpen: false,
  id: 0,
};
const o1 = createSlice({
  name: "companyEmployees",
  initialState,
  reducers: {
    editAndCreateModal: (e, t) => {
      e.editAndCreateModalOpen = t.payload.open;
      e.id = t.payload.id;
    },
  },
});
const { editAndCreateModal } = o1.actions;
export { o1 };
