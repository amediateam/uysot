// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  data: {
    Otib_ketgan: {
      count: 0,
      list: [],
      total: 0,
    },
    Bugungi: {
      count: 0,
      list: [],
      total: 0,
    },
    Ertangi: {
      count: 0,
      list: [],
      total: 0,
    },
    Rejada: {
      count: 0,
      list: [],
      total: 0,
    },
  },
  isDragging: false,
  actionModal: {
    visible: false,
    type: "done",
  },
  action: {
    done: false,
    delete: false,
    lastDay: false,
    lastMonth: false,
    lastMonday: false,
  },
};
const ZC = createSlice({
  initialState,
  name: "task-slice",
  reducers: {
    setTaskColumns: (e, t) => {
      e.data = t.payload;
    },
    setTaskColumnData: (e, t) => {
      e.data[t.payload.key] = t.payload.data;
    },
    setTaskColumnDataItem: (e, t) => {
      const { activeId, oldOverId, overId, task } = t.payload;
      if (oldOverId && overId && activeId && oldOverId !== overId) {
        e.data[oldOverId] = {
          ...e.data[oldOverId],
          count: e.data[oldOverId]?.count - 1,
          list: e.data[oldOverId]?.list?.filter(({ id }) => id !== Number(activeId)),
        };
        e.data[overId] = {
          total: e.data[overId]?.total,
          count: e.data[overId]?.count + 1,
          list: [...e.data[overId]?.list, task],
        };
      }
    },
    setTaskAction: (e, t) => {
      e.action[t.payload.key] = t.payload.value;
      Object.keys(e.action).forEach((r) => {
        if (r !== t.payload.key) {
          e.action[r] = false;
        }
      });
    },
    setTaskDragging: (e, t) => {
      e.isDragging = t.payload;
    },
    setTaskVisibleAction: (e, t) => {
      e.actionModal = t.payload;
    },
    setTaskActiveData: (e, t) => {
      e.activeTask = t.payload;
    },
    setTaskStartColumn: (e, t) => {
      e.startColumn = t.payload;
    },
  },
});
const {
  setTaskAction,
  setTaskColumns,
  setTaskDragging,
  setTaskColumnData,
  setTaskActiveData,
  setTaskStartColumn,
  setTaskVisibleAction,
  setTaskColumnDataItem,
} = ZC.actions;
export { ZC };
