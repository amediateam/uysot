// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  totalElements: 0,
  totalPages: 0,
  openRealtorDrawer: {
    realtorId: null,
    visible: false,
    name: "",
  },
};
const VC = createSlice({
  initialState,
  name: "company-realtor-slice",
  reducers: {
    setCompanyRealtorTotalItems: (e, t) => {
      e.totalElements = t.payload.totalElements;
      e.totalPages = t.payload.totalPages;
    },
    setOpenRealtorDrawer: (e, t) => {
      const { realtorId, visible, name } = t.payload;
      e.openRealtorDrawer.realtorId = realtorId;
      e.openRealtorDrawer.visible = visible;
      e.openRealtorDrawer.name = name;
    },
  },
});
const { setCompanyRealtorTotalItems, setOpenRealtorDrawer } = VC.actions;
export { VC };
