// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
import { ce } from "@/utils/storage";
const initialState = {
  active: !!ce.get("qrCodeMode") || false,
};
const N1 = createSlice({
  name: "qrCodeModeSlice",
  initialState,
  reducers: {
    setQrCodeModeActive: (e, t) => {
      e.active = t.payload;
      ce.set("qrCodeMode", String(t.payload));
    },
  },
});
const { setQrCodeModeActive: zee } = N1.actions;
export { N1 };
