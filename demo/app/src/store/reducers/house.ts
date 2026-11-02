// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (8)
import { createSlice } from "@reduxjs/toolkit";
import be from "dayjs";
import { me, Aa } from "@/constants/index";
const Co = {
  NOW: "NOW",
  TODAY: "TODAY",
  YESTERDAY: "YESTERDAY",
  THIS_WEEK: "THIS_WEEK",
  THIS_MONTH: "THIS_MONTH",
  SPECIAL: "SPECIAL",
  SPECIAL1: "SPECIAL",
};
const m1 = {
  ALL: "ALL",
  CLOSED: "CLOSED",
  ACTIVE: "ACTIVE",
};
const R8 = {
  finishData: be(new Date()).endOf("d").format(me),
  startDate: be(new Date()).startOf("month").format(me),
  finishDatePipe: be(new Date()).endOf("month").format(me),
  startDatePipe: be(new Date()).startOf("month").format(me),
  planFactId: 0,
  costTypeLead: false,
  selectedPipe: undefined,
  leadStatus: m1.ALL,
  employeeId: undefined,
  finish1: String(be(new Date()).endOf("d").format(Aa)),
  start1: String(be(new Date()).startOf("month").format(Aa)),
  finish2: String(be(new Date()).endOf("d").unix()),
  start2: String(be(new Date()).startOf("month").unix()),
  finish3: String(be(new Date()).add(6, "month").unix()),
  start3: String(be(new Date()).add(-6, "month").unix()),
  defaulGlobaltValue: Co.THIS_MONTH,
  defaultValue: Co.THIS_MONTH,
  defaultValue1: Co.THIS_MONTH,
  defaultValue2: Co.THIS_MONTH,
  nextMonth: String(be(new Date()).add(1, "month").startOf("month").format(me)),
  unSuccessfulLeadModal: {
    visible: false,
    type: "REASON",
  },
  successfulLeadModal: {
    visible: false,
    page: 1,
  },
  planFact: {
    planFactConfig: {
      visible: false,
    },
  },
};
const y1 = createSlice({
  name: "house",
  initialState: R8,
  reducers: {
    setDate: (e, t) => {
      e.startDate = t.payload.startDate;
      e.finishData = t.payload.finishData;
    },
    setDate1: (e, t) => {
      e.start1 = t.payload.startDate;
      e.finish1 = t.payload.finishDate;
    },
    setDate3: (e, t) => {
      e.start2 = t.payload.startDate;
      e.finish2 = t.payload.finishData;
    },
    setDate4: (e, t) => {
      e.start3 = t.payload.startDate;
      e.finish3 = t.payload.finishData;
    },
    setDatePipe: (e, t) => {
      e.startDatePipe = t.payload.startDate;
      e.finishDatePipe = t.payload.finishData;
    },
    setPlanFactId: (e, t) => {
      e.planFactId = t.payload;
    },
    setCostTypeLead: (e, t) => {
      e.costTypeLead = t.payload;
    },
    setPipe: (e, t) => {
      e.selectedPipe = t.payload;
    },
    setLeadStatus: (e, t) => {
      e.leadStatus = t.payload;
    },
    setEmployeeId: (e, t) => {
      e.employeeId = t.payload;
    },
    setDefaultData: (e) => {
      e.finishData = be(new Date()).format(me);
      e.startDate = be(new Date()).startOf("month").format(me);
      e.finishDatePipe = be(new Date()).format(me);
      e.startDatePipe = be(new Date()).startOf("month").format(me);
      e.planFactId = 0;
      e.costTypeLead = false;
    },
    setChangeDefaultGlobalValue: (e, t) => {
      e.defaulGlobaltValue = t.payload;
    },
    setChangeDefaultValue: (e, t) => {
      e.defaultValue = t.payload;
    },
    setChangeDefaultValue1: (e, t) => {
      e.defaultValue1 = t.payload;
    },
    setChangeDefaultValue2: (e, t) => {
      e.defaultValue2 = t.payload;
    },
    setUnSuccessfulLeadsModal: (e, t) => {
      e.unSuccessfulLeadModal.type = t.payload.type;
      e.unSuccessfulLeadModal.visible = t?.payload?.visible;
      e.unSuccessfulLeadModal.reasonsFRId = t?.payload?.reasonsFRId;
      e.unSuccessfulLeadModal.responsibleById = t.payload?.responsibleById;
    },
    setSuccessfulLeadsModal: (e, t) => {
      e.successfulLeadModal.page = t.payload.page;
      e.successfulLeadModal.search = t.payload.search;
      e.successfulLeadModal.visible = t.payload.visible;
      e.successfulLeadModal.responsibleById = t.payload.responsibleById;
    },
    setPlanFactDate: (e, t) => {
      e.planFact.startDate = t.payload.startDate;
      e.planFact.finishDate = t.payload.finishDate;
    },
    setPlanFactFormatDate: (e, t) => {
      e.planFact.formatDate = t.payload;
    },
    setPlanFactPipeId: (e, t) => {
      e.planFact.pipeId = t.payload;
    },
    setPlanFactVisibleCustomDateModal: (e, t) => {
      e.planFact.visibleCustomDateModal = t.payload;
    },
    setPlanFactConfig: (e, t) => {
      e.planFact.planFactConfig.id = t.payload.id;
      e.planFact.planFactConfig.visible = t.payload.visible;
      e.planFact.planFactConfig.isLoading = t.payload.isLoading;
    },
  },
});
const {
  setDate,
  setPipe,
  setDate1,
  setDate3,
  setDate4,
  setDatePipe,
  setPlanFactId,
  setLeadStatus,
  setEmployeeId,
  setDefaultData,
  setCostTypeLead,
  setChangeDefaultValue,
  setChangeDefaultValue1,
  setChangeDefaultValue2,
  setSuccessfulLeadsModal,
  setUnSuccessfulLeadsModal,
  setChangeDefaultGlobalValue,
  setPlanFactDate,
  setPlanFactPipeId,
  setPlanFactVisibleCustomDateModal,
  setPlanFactFormatDate,
  setPlanFactConfig,
} = y1.actions;
const q8 = {
  saleHouses: [],
  totalPages: 2,
  page: 1,
  currentPage: 1,
  homeCurrentPage: 1,
};
const w1 = createSlice({
  name: "house",
  initialState: q8,
  reducers: {
    setSaleHouses: (e, t) => {
      e.saleHouses = e.saleHouses.concat(t.payload.data);
      e.page = t.payload.currentPage;
      e.totalPages = t.payload.totalPages;
    },
    setPageNumber: (e, t) => {
      e.page = t.payload;
    },
    clearSaleHouses: (e) => {
      e.saleHouses = [];
      e.totalPages = 2;
      e.page = 1;
    },
    setCurrentPage: (e, t) => {
      e.currentPage = t.payload;
    },
    setHomeCurrentPage: (e, t) => {
      e.homeCurrentPage = t.payload;
    },
  },
});
const {
  setSaleHouses,
  setPageNumber,
  clearSaleHouses,
  setCurrentPage,
  setHomeCurrentPage: eee,
} = w1.actions;
export { w1, y1 };
