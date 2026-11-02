// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  taskChangeText: "Topshiriq",
  intentWidth: 0,
  isDragAccept: false,
};
const V1 = createSlice({
  name: "taskChangeText",
  initialState,
  reducers: {
    setTaskChangeText: (e, t) => {
      e.taskChangeText = t.payload.taskChangeText;
    },
    setIntentWidth: (e, t) => {
      e.intentWidth = t.payload.intentWidth;
    },
    setIsDragAccepted: (e) => {
      e.isDragAccept = true;
    },
  },
});
const { setTaskChangeText: vte, setIntentWidth: gte, setIsDragAccepted: mte } = V1.actions;
export { V1 };
