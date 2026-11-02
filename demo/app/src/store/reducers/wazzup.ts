// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  visibleWazzupChannels: false,
  visibleWazzupConfiguration: false,
  visibleWazzupConnect: false,
  visibleWazzupSettings: false,
};
const e1 = createSlice({
  name: "wazzup",
  initialState,
  reducers: {
    setWazzupState: (e, t) => {
      e[t.payload.key] = t.payload.value;
    },
    setSelectedContact: (e, t) => {
      e.selectedContact = t.payload;
    },
    clearWazzupState: (e) => {
      e.visibleWazzupChannels = false;
      e.visibleWazzupConfiguration = false;
      e.visibleWazzupConnect = false;
      e.visibleWazzupSettings = false;
      e.wazzupAccounts = undefined;
      e.selectedContact = undefined;
    },
  },
});
const { setWazzupState, clearWazzupState, setSelectedContact } = e1.actions;
export { e1 };
