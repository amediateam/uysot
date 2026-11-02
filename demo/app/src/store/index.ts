// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (74)
import { createSlice, current, combineReducers, configureStore } from "@reduxjs/toolkit";
import { k7 } from "@/services/verto/index";
import { w5 as desktopAgentReducer } from "@/store/reducers/desktopAgentReducer";
import { X$ } from "@/store/store-registry";
import { SC } from "@/store/reducers/user";
import { D5 } from "@/store/reducers/crm-page-lead-market-store";
import { MC } from "@/store/reducers/block-employee-slice";
import { DC } from "@/store/reducers/feedback-slice";
import { FC } from "@/store/reducers/roboto-call-slice";
import { $C } from "@/store/reducers/settings-slice";
import { jC } from "@/store/reducers/ai-agents-slice";
import { BC } from "@/store/reducers/ai-assistant";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { t4 } from "@/store/reducers/common-slice";
import { VC } from "@/store/reducers/company-realtor-slice";
import { a4 } from "@/store/reducers/contact-slice";
import { UC } from "@/store/reducers/dashboard-v2-slice";
import { qC } from "@/store/reducers/currencySlice";
import { GC } from "@/store/reducers/showroom-slice";
import { YC } from "@/store/reducers/offer-slice";
import { KC } from "@/store/reducers/realtor-flat-slice";
import { XC } from "@/store/reducers/realtor-offer-slice";
import { JC } from "@/store/reducers/realtor-search-slice";
import { QC } from "@/store/reducers/realtor-booking-slice";
import { ZC } from "@/store/reducers/task-slice";
import { e1 } from "@/store/reducers/wazzup";
import { t1, g1 } from "@/store/reducers/allHouseFilter";
import { r1 } from "@/store/reducers/bossCurrency";
import { n1 } from "@/store/reducers/changes";
import { i1 } from "@/store/reducers/client";
import { a1, E1 } from "@/store/reducers/companies";
import { o1 } from "@/store/reducers/companyEmployees";
import { s1 } from "@/store/reducers/CompanySlice";
import { l1 } from "@/store/reducers/contract";
import { cv } from "@/store/reducers/createContractV2";
import { f1 } from "@/store/reducers/createContract";
import { p1 } from "@/store/reducers/crmFieldState";
import { v1 } from "@/store/reducers/CrmOneLidSlice";
import { y1, w1 } from "@/store/reducers/house";
import { _1 } from "@/store/reducers/crmV2Slice";
import { b1 } from "@/store/reducers/debt";
import { S1 } from "@/store/reducers/flat";
import { C1 } from "@/store/reducers/house-history";
import { x1 } from "@/store/reducers/houseConfig";
import { P1 } from "@/store/reducers/importedFiles";
import { I1 } from "@/store/reducers/ioService";
import { A1 } from "@/store/reducers/leadComposer";
import { T1 } from "@/store/reducers/monthlyPayments";
import { R1 } from "@/store/reducers/notification";
import { O1 } from "@/store/reducers/notTaskLeadNotification";
import { N1 } from "@/store/reducers/qrCodeModeSlice";
import { k1 } from "@/store/reducers/remoteSessionActive";
import { D1 } from "@/store/reducers/sendMessageCrm";
import { L1 } from "@/store/reducers/shaxmatka";
import { F1 } from "@/store/reducers/shaxmatkaV3";
import { $1 } from "@/store/reducers/showroomModal";
import { B1 } from "@/store/reducers/taskCalendarView";
import { V1 } from "@/store/reducers/taskChangeText";
import { U1 } from "@/store/reducers/text-editor";
import { W1 } from "@/store/reducers/trigger";
const SC_reducer = SC.reducer;
const D5_reducer = D5.reducer;
const MC_reducer = MC.reducer;
const DC_reducer = DC.reducer;
const FC_reducer = FC.reducer;
const $C_reducer = $C.reducer;
const jC_reducer = jC.reducer;
const BC_reducer = BC.reducer;
const commonSlice = persistReducer(
  {
    storage,
    key: "common-slice",
  },
  t4.reducer
);
const VC_reducer = VC.reducer;
const a4_reducer = a4.reducer;
const UC_reducer = UC.reducer;
const qC_reducer = qC.reducer;
const O4 = {
  storage,
  whitelist: ["filter", "visualWeather"],
  key: "showroom-slice",
};
const showroomSlice = persistReducer(O4, GC.reducer);
const YC_reducer = YC.reducer;
const L4 = {
  storage,
  whitelist: ["isProfit"],
  key: "realtor-flat-view-profit",
};
const realtorFlatReducer = persistReducer(L4, KC.reducer);
const XC_reducer = XC.reducer;
const V4 = {
  storage,
  whitelist: ["isProfit"],
  key: "realtor-view-profit",
};
const realtorSearchReducer = persistReducer(V4, JC.reducer);
const QC_reducer = QC.reducer;
const ZC_reducer = ZC.reducer;
const e1_reducer = e1.reducer;
const t1_reducer = t1.reducer;
const r1_reducer = r1.reducer;
const n1_reducer = n1.reducer;
const i1_reducer = i1.reducer;
const a1_reducer = a1.reducer;
const o1_reducer = o1.reducer;
const s1_reducer = s1.reducer;
const l1_reducer = l1.reducer;
const cv_reducer = cv.reducer;
const f1_reducer = f1.reducer;
const p1_reducer = p1.reducer;
const v1_reducer = v1.reducer;
const g1_reducer = g1.reducer;
const y1_reducer = y1.reducer;
const M8 = {
  storage,
  key: "crmV2",
  whitelist: ["leadLayoutResizable", "activeEmbedWidgetId", "activeEmbeddedApplicationId"],
};
const crmV2Slice = persistReducer(M8, _1.reducer);
const b1_reducer = b1.reducer;
const S1_reducer = S1.reducer;
const E1_reducer = E1.reducer;
const C1_reducer = C1.reducer;
const x1_reducer = x1.reducer;
const w1_reducer = w1.reducer;
const P1_reducer = P1.reducer;
const I1_reducer = I1.reducer;
const A1_reducer = A1.reducer;
const T1_reducer = T1.reducer;
const R1_reducer = R1.reducer;
const O1_reducer = O1.reducer;
const N1_reducer = N1.reducer;
const k1_reducer = k1.reducer;
const D1_reducer = D1.reducer;
const L1_reducer = L1.reducer;
const F1_reducer = F1.reducer;
const $1_reducer = $1.reducer;
const B1_reducer = B1.reducer;
const V1_reducer = V1.reducer;
const U1_reducer = U1.reducer;
const W1_reducer = W1.reducer;
const M7 = {
  webrtc: {
    host: "",
    password: "",
    user: "",
    domain: "",
  },
  vertoRef: null,
  video: null,
  answerCalling: false,
  calling: false,
  running_call: null,
  startTimer: false,
  resedTimer: false,
  callerName: "",
  callerNumber: "",
  disable: false,
  hold: false,
  phones: {},
};
const q1 = createSlice({
  name: "user",
  initialState: M7,
  reducers: {
    setWebRTC: (e, t) => {
      const { webrtc } = current(e);
      if (!webrtc?.password) {
        e.webrtc = {
          ...webrtc,
          ...t.payload,
        };
        e.vertoRef = new k7({
          transportConfig: {
            passwd: t.payload?.password,
            socketUrl: `wss://${t.payload?.host}`,
            login: `${t.payload?.user}@${webrtc?.domain}`,
          },
          debug: true,
          ice_timeout: 5000,
        });
      }
    },
    setVerto: (e, t) => {
      e.vertoRef = t?.payload;
    },
    setAnswerCalling: (e, t) => {
      e.answerCalling = t.payload;
    },
    setCalling: (e, t) => {
      e.calling = t.payload;
    },
    setRunningCall: (e, t) => {
      e.running_call = t.payload;
    },
    setStartTimer: (e, t) => {
      e.startTimer = t.payload;
    },
    setResedTimer: (e, t) => {
      e.resedTimer = t.payload;
    },
    setCallerName: (e, t) => {
      e.callerName = t.payload?.callerName;
      e.callerNumber = t.payload?.callerNumber;
    },
    setWebRTCDisable: (e, t) => {
      e.disable = t.payload;
    },
    setWebRTCHold: (e, t) => {
      e.hold = t.payload;
    },
    setPhones: (e, t) => {
      e.phones = {
        ...e.phones,
        ...t.payload,
      };
    },
    setPhoneEdit: (e, t) => {
      e.phones[t.payload.key] = {
        ...e.phones[t.payload.key],
        ...t.payload.params,
      };
    },
    setPhoneDelete: (e, t) => {
      delete e.phones[t.payload];
    },
  },
});
const {
  setWebRTC: lne,
  setVerto: cne,
  setAnswerCalling: une,
  setCalling: dne,
  setRunningCall: fne,
  setStartTimer: hne,
  setResedTimer: pne,
  setCallerName: vne,
  setWebRTCDisable: gne,
  setWebRTCHold: mne,
  setPhones: yne,
  setPhoneDelete,
  setPhoneEdit: bne,
} = q1.actions;
const q1_reducer = q1.reducer;
const L7 = {
  editAndCreateModalOpen: false,
  id: 0,
};
const G1 = createSlice({
  name: "companies",
  initialState: L7,
  reducers: {
    editAndCreateModal: (e, t) => {
      e.editAndCreateModalOpen = t.payload.open;
      e.id = t.payload.id;
    },
  },
});
const { editAndCreateModal: Sne } = G1.actions;
const G1_reducer = G1.reducer;
const $7 = combineReducers({
  shaxmatkaV3: F1_reducer,
  showroomModal: $1_reducer,
  userReducer: SC_reducer,
  houseReducer: w1_reducer,
  clientReducer: i1_reducer,
  flatReducer: S1_reducer,
  monthlyPaymentsReducer: T1_reducer,
  houseConfigReducer: x1_reducer,
  shaxmatkaReducer: L1_reducer,
  contractReducer: l1_reducer,
  companiesReducer: a1_reducer,
  websiteUserReducer: G1_reducer,
  companyEmployeesReducer: o1_reducer,
  changesReducer: n1_reducer,
  allHouseFilter: t1_reducer,
  assigmentSlice: g1_reducer,
  crmField: p1_reducer,
  crmOneLidField: v1_reducer,
  notificationSlice: R1_reducer,
  sendMessageCrmSlice: D1_reducer,
  triggerSlice: W1_reducer,
  crmStatistic: y1_reducer,
  taskCalendarViewSlice: B1_reducer,
  createContract: f1_reducer,
  currency: qC_reducer,
  googleDocViewer: E1_reducer,
  notTaskLeadNotification: O1_reducer,
  bossCurrency: r1_reducer,
  companyReducer: s1_reducer,
  webRTCReducer: q1_reducer,
  textEditorReducer: U1_reducer,
  showroomSlice,
  debtSlice: b1_reducer,
  qrCodeModeSlice: N1_reducer,
  taskChangeTextSlice: V1_reducer,
  ioServiceSlice: I1_reducer,
  houseHistorySlice: C1_reducer,
  crmV2Slice,
  dashboardReducer: UC_reducer,
  createContractV2: cv_reducer,
  taskReducer: ZC_reducer,
  offerReducer: YC_reducer,
  realtorOfferReducer: XC_reducer,
  realtorBookingReducer: QC_reducer,
  companyRealtorReducer: VC_reducer,
  realtorFlatReducer,
  robotoCallReducer: FC_reducer,
  feedbackReducer: DC_reducer,
  blockEmployeeReducer: MC_reducer,
  realtorSearchReducer,
  aiAgentReducer: jC_reducer,
  aiAssistantReducer: BC_reducer,
  wazzupReducer: e1_reducer,
  crmPageLeadMarketStore: D5_reducer,
  commonSlice,
  contactSlice: a4_reducer,
  leadComposerReducer: A1_reducer,
  settingsReduces: $C_reducer,
  importedFilesReducer: P1_reducer,
  desktopAgentReducer,
  remoteSessionActive: k1_reducer,
});
const reducer = X$($7);
const B7 = () =>
  configureStore({
    reducer,
    middleware: (e) =>
      e({
        serializableCheck: false,
      }),
  });
export const Ha = B7();
