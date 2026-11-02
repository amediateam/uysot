// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  open: false,
  id: undefined,
  status: "ALL",
  currencyAmount: undefined,
  ccy: "UZS",
  sessionStatus: undefined,
  paymentsCount: 0,
  createdTimestamp: undefined,
};
const P1 = createSlice({
  name: "importedFiles",
  initialState,
  reducers: {
    setOpenImportedFilesModal: (e, t) => {
      e.open = t.payload.open;
      e.id = t.payload.id;
      e.sessionStatus = t.payload.sessionStatus;
      e.paymentsCount = t.payload.paymentsCount ?? 0;
      e.createdTimestamp = t.payload.createdTimestamp;
    },
    setImportStatus: (e, t) => {
      e.status = t.payload.status;
    },
    setCurrencyAmount: (e, t) => {
      e.currencyAmount = t.payload.currencyAmount;
      e.ccy = t.payload.ccy;
    },
  },
});
const { setOpenImportedFilesModal: tee, setImportStatus: ree, setCurrencyAmount: nee } = P1.actions;
export { P1 };
