// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (6)
import { createSlice } from "@reduxjs/toolkit";
const o8 = {
  editAndCreateModalOpen: false,
  id: 0,
};
const a1 = createSlice({
  name: "companies",
  initialState: o8,
  reducers: {
    editAndCreateModal: (e, t) => {
      e.editAndCreateModalOpen = t.payload.open;
      e.id = t.payload.id;
    },
  },
});
const { editAndCreateModal } = a1.actions;
const B8 = {
  isOpen: false,
  url: "",
  format: "",
  name: "",
};
const E1 = createSlice({
  name: "companies",
  initialState: B8,
  reducers: {
    handleOpen: (e, t) => {
      e.isOpen = t.payload.isOpen;
      e.format = t.payload.format;
      e.url = t.payload.url;
      e.name = t.payload.name;
    },
    handleClose: (e) => {
      e.isOpen = false;
      e.format = "";
      e.url = "";
      e.name = "";
    },
  },
});
const { handleOpen, handleClose } = E1.actions;
export { E1, a1 };
