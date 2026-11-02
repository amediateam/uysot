// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  totalElements: 0,
  totalPages: 0,
  view: {
    visible: false,
  },
};
const QC = createSlice({
  initialState,
  name: "realtor-booking-slice",
  reducers: {
    setRealtorBookingTotalItems: (e, t) => {
      e.totalElements = t.payload.totalElements;
      e.totalPages = t.payload.totalPages;
    },
    setRealtorBookingView: (e, t) => {
      e.view = t.payload;
    },
  },
});
const { setRealtorBookingTotalItems, setRealtorBookingView } = QC.actions;
export { QC };
