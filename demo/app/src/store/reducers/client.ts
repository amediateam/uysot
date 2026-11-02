// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice, current } from "@reduxjs/toolkit";
import { Hn } from "@/constants/client-type";
const initialState = {
  type: Hn.NATURAL,
  juridicalPerson: null,
  naturalPerson: null,
  clientPhones: [
    {
      phone: "",
      active: true,
      code: "",
    },
  ],
  searchByPhone: null,
  leadContact: "",
  leadContactName: "",
  leadName: "",
  countryCode: "",
  currentPage: 1,
  searchPhone: null,
  wsClientData: undefined,
  currentLead: undefined,
  openConnectLeadModal: false,
  viewCanceledPayment: false,
  searchClientPhone: null,
  createNewClient: false,
  selectedClientId: -1,
};
const i1 = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClientType: (e, t) => {
      e.type = t.payload;
      e.clientPhones = [
        {
          phone: "",
          active: true,
          code: "",
        },
      ];
      e.juridicalPerson = null;
      e.naturalPerson = null;
      e.searchByPhone = null;
      e.juridicalPerson = null;
      e.naturalPerson = null;
      e.searchClientPhone = null;
    },
    setClientBySearchPassportDate: (e, t) => {
      e.naturalPerson = {
        ...current(e).naturalPerson,
        ...t.payload,
      };
      e.currentLead = t.payload.lead;
    },
    setClientPhone: (e, t) => {
      e.clientPhones = e.clientPhones.map((r, n) => {
        if (n === t.payload.index) {
          return {
            ...r,
            phone: t.payload.phone,
          };
        }
        return r;
      });
    },
    setClientAndClientTypeAndClientPhone: (e, t) => {
      if (t.payload.type === Hn.NATURAL) {
        e.naturalPerson = t.payload.client;
        e.currentLead = t.payload.client.lead;
        if (t.payload.client?.passportImg1Id) {
          e.passportOneId = t.payload.client?.passportImg1Id;
        }
        if (t.payload.client?.passportImg2Id) {
          e.passportTwoId = t.payload.client?.passportImg2Id;
        }
      } else {
        e.juridicalPerson = t.payload.client;
      }
      e.type = t.payload.type;
      e.clientPhones = t.payload.phones;
    },
    setClient: (e, t) => {
      if (t.payload?.type === Hn.NATURAL) {
        e.naturalPerson = t.payload;
        e.currentLead = t.payload.lead;
      } else {
        e.juridicalPerson = t.payload;
      }
    },
    setClientPhones: (e, t) => {
      e.clientPhones = t.payload;
    },
    deleteClientPhones: (e, t) => {
      const { clientPhones } = current(e);
      const n = e.clientPhones.filter((i, a) => a !== t.payload);
      if (clientPhones[t.payload].active) {
        n[0].active = true;
      }
      e.clientPhones = n;
    },
    addClientPhone: (e) => {
      e.clientPhones.push({
        phone: "",
        active: false,
        code: "",
      });
    },
    checkClientPhone: (e, t) => {
      const r = e.clientPhones.slice();
      for (let n = 0; n < r.length; n++) {
        r[n].active = n === t.payload;
      }
      e.clientPhones = r;
    },
    clearClientReducer: (e) => {
      e.type = Hn.NATURAL;
      e.juridicalPerson = null;
      e.naturalPerson = null;
      e.currentLead = undefined;
      e.passportTwoId = undefined;
      e.passportOneId = undefined;
      e.clientPhones = [
        {
          phone: "",
          active: true,
          code: "",
        },
      ];
      e.searchByPhone = null;
      e.searchPhone = null;
      e.searchClientPhone = null;
      e.createNewClient = false;
    },
    clearSelectedClient: (e) => {
      e.juridicalPerson = null;
      e.naturalPerson = null;
      e.currentLead = undefined;
      e.passportTwoId = undefined;
      e.passportOneId = undefined;
      e.clientPhones = [
        {
          phone: "",
          active: true,
          code: "",
        },
      ];
      e.searchByPhone = null;
      e.searchPhone = null;
      e.searchClientPhone = null;
      e.createNewClient = false;
    },
    setSearchByPhone: (e, t) => {
      e.searchByPhone = t.payload;
    },
    setSearchPhone: (e, t) => {
      e.searchPhone = t.payload;
    },
    setSearchOrderClientPhone: (e, t) => {
      e.searchClientPhone = t.payload;
    },
    setNaturalPersonImage: (e, t) => {
      if (t.payload.type === "first") {
        e.passportOneId = t.payload.id;
      } else {
        e.passportTwoId = t.payload.id;
      }
    },
    changeCountryCode: (e, t) => {
      e.countryCode = t.payload;
    },
    setCurrentPage: (e, t) => {
      e.currentPage = t.payload;
    },
    setWSClientData: (e, t) => {
      e.wsClientData = t.payload;
    },
    setCurrentLead: (e, t) => {
      e.currentLead = t.payload;
    },
    setOpenConnectLeadModal: (e, t) => {
      e.openConnectLeadModal = t.payload;
    },
    setWSMyCallData: (e, t) => {
      const t_payload = t.payload;
      if (t_payload?.action === "ANSWERED" && !e.wsMyCallData?.callStartTime) {
        e.wsMyCallData = {
          ...t_payload,
          callStartTime: Date.now(),
        };
      } else if (t_payload?.action === "FINISHED") {
        e.wsMyCallData = undefined;
      } else if (t_payload) {
        e.wsMyCallData = {
          ...e.wsMyCallData,
          ...t_payload,
        };
      } else {
        e.wsMyCallData = t_payload;
      }
    },
    setViewCanceledPayments: (e, t) => {
      e.viewCanceledPayment = t.payload;
    },
    setCreateNewClient: (e, t) => {
      e.createNewClient = t.payload;
    },
    setNewClientValues: (e, t) => {
      if (t.payload === undefined) {
        e.newClientValues = undefined;
      } else {
        e.newClientValues = {
          ...e.newClientValues,
          ...t.payload,
        };
      }
    },
    setSelectedClientId: (e, t) => {
      e.selectedClientId = t.payload;
    },
  },
});
const {
  setClientType,
  setClient,
  setClientAndClientTypeAndClientPhone,
  setClientPhones,
  deleteClientPhones,
  addClientPhone,
  checkClientPhone,
  setSearchByPhone,
  clearClientReducer,
  clearSelectedClient,
  setNaturalPersonImage,
  setClientBySearchPassportDate,
  setClientPhone,
  changeCountryCode,
  setCurrentPage,
  setSearchPhone,
  setWSClientData,
  setCurrentLead,
  setOpenConnectLeadModal,
  setWSMyCallData,
  setViewCanceledPayments,
  setSearchOrderClientPhone,
  setCreateNewClient,
  setNewClientValues,
  setSelectedClientId,
} = i1.actions;
export { i1 };
