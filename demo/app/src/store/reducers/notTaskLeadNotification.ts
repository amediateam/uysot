// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  showModal: false,
  showCreateTaskConfirmModal: false,
  createTaskLater: {},
  draggingLeadId: null,
  clickedLeadId: null,
  forceCreateTaskConfirmModal: {},
};
const O1 = createSlice({
  name: "notTaskLeadNotification",
  initialState,
  reducers: {
    showNotificationNotTaskLead: (e) => {
      e.showModal = true;
    },
    hideNotificationNotTaskLead: (e) => {
      e.showModal = false;
      e.forceCreateTaskConfirmModal = {
        [e.clickedLeadId]: true,
      };
    },
    setShowCreateTaskConfirmModal: (e, t) => {
      e.showCreateTaskConfirmModal = t.payload;
    },
    setCreateTaskLater: (e, t) => {
      e.showCreateTaskConfirmModal = false;
      const { leadId, value } = t.payload;
      if (value) {
        e.createTaskLater[leadId] = true;
      } else {
        delete e.createTaskLater[leadId];
      }
    },
    clearCreateTaskLater: (e) => {
      e.createTaskLater = {};
    },
    setDraggingLeadId: (e, t) => {
      e.draggingLeadId = t.payload;
    },
    setForceCreateTaskConfirmModal: (e, t) => {
      e.forceCreateTaskConfirmModal = {
        [e.clickedLeadId]: t.payload,
      };
    },
    setMandatoryAssignmentStatus: (e, t) => {
      e.mandatoryAssignmentStatus = t.payload;
    },
    setClickedLeadId: (e, t) => {
      e.clickedLeadId = t.payload;
    },
    onReset: (e) => {
      e.showModal = false;
      e.createTaskLater = {};
      e.draggingLeadId = null;
      e.clickedLeadId = null;
      e.forceCreateTaskConfirmModal = {};
      e.showCreateTaskConfirmModal = false;
      e.mandatoryAssignmentStatus = "NONE";
    },
  },
});
const {
  showNotificationNotTaskLead: Mee,
  hideNotificationNotTaskLead: Dee,
  setShowCreateTaskConfirmModal: Lee,
  setCreateTaskLater: Fee,
  clearCreateTaskLater,
  setDraggingLeadId: jee,
  setForceCreateTaskConfirmModal: Bee,
  setMandatoryAssignmentStatus: Vee,
  setClickedLeadId: Uee,
  onReset: Hee,
} = O1.actions;
export { O1 };
