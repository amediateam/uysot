// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (4)
import { createSlice } from "@reduxjs/toolkit";
import be from "dayjs";
import { me } from "@/constants/index";
const j1 = {
  WEEK: "WEEK",
  DAY: "DAY",
  MONTH: "MONTH",
};
const initialState = {
  type: j1.DAY,
  date: be(new Date()).format(me),
  createTaskVisible: false,
  completeTaskVisible: false,
  task: undefined,
};
const B1 = createSlice({
  name: "taskCalendarView",
  initialState,
  reducers: {
    setType: (e, t) => {
      e.type = t.payload;
      e.date = be(new Date()).format(me);
    },
    addMonth: (e) => {
      e.date = be(e.date, me).add(1, "month").startOf("month").format(me);
    },
    minusMonth: (e) => {
      e.date = be(e.date, me).add(-1, "month").startOf("month").format(me);
    },
    addDate: (e) => {
      e.date = be(e.date, me).add(1, "day").format(me);
    },
    minusDate: (e) => {
      e.date = be(e.date, me).add(-1, "day").format(me);
    },
    addWeek: (e) => {
      e.date = be(e.date, me).add(1, "week").format(me);
    },
    minusWeek: (e) => {
      e.date = be(e.date, me).add(-1, "week").format(me);
    },
    createTaskVisible: (e, t) => {
      e.createTaskVisible = t.payload;
    },
    completeTaskVisible: (e, t) => {
      e.completeTaskVisible = t.payload.visible;
      e.task = t.payload.task;
    },
    setTypeAndDate: (e, t) => {
      e.type = t.payload.type;
      e.date = t.payload.date;
    },
  },
});
const {
  setType: ate,
  addMonth: ote,
  minusMonth: ste,
  addDate: lte,
  minusDate: cte,
  createTaskVisible: ute,
  completeTaskVisible: dte,
  setTypeAndDate: fte,
  addWeek: hte,
  minusWeek: pte,
} = B1.actions;
export { B1 };
