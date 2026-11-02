// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  contractId: null,
  contractNumber: null,
  visible: false,
  currentPage: 1,
  openDownloadModal: false,
  viewCanceledPayment: false,
};
const l1 = createSlice({
  name: "contract",
  initialState,
  reducers: {
    setContractId: (e, t) => {
      e.contractId = t.payload;
    },
    setContractNumber: (e, t) => {
      e.contractNumber = t.payload;
    },
    setVisible: (e, t) => {
      e.visible = t.payload.visible;
      e.contractId = t.payload.contractId;
      e.contractNumber = t.payload.contractNumber;
    },
    setClear: (e) => {
      e.contractId = null;
      e.contractNumber = null;
      e.visible = false;
    },
    setCurrentPage: (e, t) => {
      e.currentPage = t.payload;
    },
    setOpenDownloadModal: (e, t) => {
      e.openDownloadModal = t.payload;
    },
    setTemplateData: (e, t) => {
      e.templateData = t.payload;
    },
    setPaymentData: (e, t) => {
      e.paymentData = t.payload;
    },
    setViewCanceledPayments: (e, t) => {
      e.viewCanceledPayment = t.payload;
    },
  },
});
const {
  setContractNumber,
  setContractId,
  setVisible,
  setClear,
  setCurrentPage,
  setOpenDownloadModal,
  setTemplateData,
  setPaymentData,
  setViewCanceledPayments,
} = l1.actions;
export { l1 };
