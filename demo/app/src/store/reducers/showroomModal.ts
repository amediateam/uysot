// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  visible: false,
};
const $1 = createSlice({
  name: "showroomModal",
  initialState,
  reducers: {
    setShowroomModal: (e, t) => {
      e.visible = t.payload;
    },
  },
});
const { setShowroomModal: ite } = $1.actions;
export { $1 };
