// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (6)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isActive: false,
  deviceCode: null,
  deviceName: null,
};
const OC = createSlice({
  name: "desktopAgentReducer",
  initialState,
  reducers: {
    setDesktopAgent: (e, t) => {
      e.isActive = t.payload.isActive;
      e.deviceCode = t.payload.deviceCode;
      e.deviceName = t.payload.deviceName;
    },
  },
});
const OC_reducer = OC.reducer;
const { setDesktopAgent } = OC.actions;
const I5 = 3127;
const A5 = 3130;
export { A5, I5, setDesktopAgent as P5, OC_reducer as w5 };
