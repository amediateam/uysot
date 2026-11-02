// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  filesHistoryVisible: false,
  refetchTimers: undefined,
};
const I1 = createSlice({
  name: "ioService",
  initialState,
  reducers: {
    openFilesHistory: (e, t) => {
      e.filesHistoryVisible = t.payload;
    },
    setRefetchTimer: (e, t) => {
      e.refetchTimers = t.payload;
    },
  },
});
const { openFilesHistory: iee, setRefetchTimer: aee } = I1.actions;
export { I1 };
