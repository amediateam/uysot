// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  taskCount: 0,
  messageDrawerVisible: false,
};
const R1 = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setTaskCount: (e, t) => {
      e.taskCount = t.payload;
    },
    setMessageDrawerVisible: (e, t) => {
      e.messageDrawerVisible = t.payload;
    },
    setChannelOrGroupId: (e, t) => {
      e.channelOrGroupId = t.payload;
    },
  },
});
const { setTaskCount: Oee, setMessageDrawerVisible: Nee, setChannelOrGroupId: kee } = R1.actions;
export { R1 };
