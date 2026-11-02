// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (10)
import { createSlice } from "@reduxjs/toolkit";
import be from "dayjs";
import { Aa } from "@/constants/index";
const timeValue = "00:00 00:00";
const dateValue = "Bugun";
const text = "Boshqa";
const icon = "calendar-event";
const color = "#00A389";
const n7 = () => ({
  start: be().hour(0).minute(0).format(Aa),
  end: be().hour(23).minute(59).format(Aa),
});
const startEnd = {
  start: "00:00",
  end: "23:59",
};
const initialState = {
  dateConfig: {
    dateValue,
    timeValue,
    deadline: n7(),
    startEnd,
  },
  taskTypeConfig: {
    editActiveId: 0,
    selectActiveId: 0,
    editActiveName: "",
    icon,
    color,
    text,
  },
  uiState: {
    mPickerVisible: false,
    taskMeetingSelectVisible: false,
    taskMeetingCreateVisible: false,
    typeVisible: false,
    visibleEmoji: false,
  },
  activeEmployeeId: 0,
  activeChatMember: undefined,
  text: "",
  selectionStart: 0,
  files: [],
  conversationId: 0,
  selectedAISuggestTaskId: null,
  fieldValues: [],
  showRequiredFieldErrors: false,
};
const A1 = createSlice({
  name: "leadComposer",
  initialState,
  reducers: {
    updateDateConfig: (e, t) => {
      e.dateConfig = {
        ...e.dateConfig,
        ...t.payload,
      };
    },
    updateTaskTypeConfig: (e, t) => {
      e.taskTypeConfig = {
        ...e.taskTypeConfig,
        ...t.payload,
      };
    },
    updateUIState: (e, t) => {
      e.uiState = {
        ...e.uiState,
        ...t.payload,
      };
    },
    setActiveEmployeeId: (e, t) => {
      e.activeEmployeeId = t.payload;
    },
    setActiveChatMember: (e, t) => {
      e.activeChatMember = t.payload;
    },
    setText: (e, t) => {
      e.text = t.payload;
    },
    setSelectionStart: (e, t) => {
      e.selectionStart = t.payload;
    },
    setFiles: (e, t) => {
      e.files = t.payload;
    },
    setConversationId: (e, t) => {
      e.conversationId = t.payload;
    },
    setSelectedAISuggestTaskId: (e, t) => {
      e.selectedAISuggestTaskId = t.payload;
    },
    setFieldValues: (e, t) => {
      e.fieldValues = t.payload;
    },
    setShowRequiredFieldErrors: (e, t) => {
      e.showRequiredFieldErrors = t.payload;
    },
    resetLeadComposer: (e) => {
      Object.assign(e, initialState);
    },
  },
});
const {
  updateDateConfig: oee,
  updateTaskTypeConfig: see,
  updateUIState: lee,
  setActiveEmployeeId: cee,
  setActiveChatMember: uee,
  setText: dee,
  setSelectionStart: fee,
  setFiles: hee,
  setConversationId: pee,
  setSelectedAISuggestTaskId: vee,
  setFieldValues: gee,
  setShowRequiredFieldErrors: mee,
  resetLeadComposer: yee,
} = A1.actions;
export { A1 };
