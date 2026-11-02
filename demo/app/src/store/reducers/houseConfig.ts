// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  editModalOpen: false,
  openDeleteModal: false,
  notSalePageSize: 10,
  salePageSize: 10,
  houseName: "",
};
const x1 = createSlice({
  name: "houseConfig",
  initialState,
  reducers: {
    setHouseCreateModalOpen: (e) => {
      e.editModalOpen = true;
    },
    setHouseEditModalOpen: (e, t) => {
      e.id = t.payload;
      e.editModalOpen = true;
    },
    clearHouseEditModalOpen: (e) => {
      e.id = undefined;
      e.editModalOpen = false;
    },
    setNotSalePageSize: (e, t) => {
      e.notSalePageSize = t.payload;
    },
    setSalePageSize: (e, t) => {
      e.salePageSize = t.payload;
    },
    setOpenDeleteModal: (e, t) => {
      e.openDeleteModal = true;
      e.houseName = t.payload.houseName;
      e.id = t.payload.id;
    },
    setCloseDeleteModal: (e) => {
      e.openDeleteModal = false;
      e.houseName = "";
      e.id = undefined;
    },
    clearHouseConfig: (e) => {
      e.editModalOpen = false;
      e.openDeleteModal = false;
      e.id = undefined;
      e.notSalePageSize = 10;
      e.salePageSize = 10;
      e.houseName = "";
    },
  },
});
const {
  setHouseCreateModalOpen,
  setNotSalePageSize,
  setSalePageSize,
  setHouseEditModalOpen,
  clearHouseEditModalOpen,
  setOpenDeleteModal,
  setCloseDeleteModal,
  clearHouseConfig,
} = x1.actions;
export { x1 };
