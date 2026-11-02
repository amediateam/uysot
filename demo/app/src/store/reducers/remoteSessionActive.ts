// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  data: [],
};
const k1 = createSlice({
  name: "remoteSessionActive",
  initialState,
  reducers: {
    setRemoteSessionActiveData: (e, t) => {
      e.data = t.payload;
    },
  },
});
const { setRemoteSessionActiveData: Wee } = k1.actions;
export { k1 };
