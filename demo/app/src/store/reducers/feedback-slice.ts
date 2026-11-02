// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  visible: false,
  isLoading: false,
  isCapture: false,
};
const DC = createSlice({
  name: "feedback-slice",
  initialState,
  reducers: {
    setFeedbackVisible: (e, t) => {
      e.visible = t.payload;
    },
    setFeedbackIsLoading: (e, t) => {
      e.isLoading = t.payload;
    },
    setFeedbackIsCapture: (e, t) => {
      e.isCapture = t.payload;
    },
    setFeedbackSrc: (e, t) => {
      e.src = t.payload;
    },
  },
});
const { setFeedbackSrc, setFeedbackIsCapture, setFeedbackIsLoading, setFeedbackVisible } =
  DC.actions;
export { DC };
