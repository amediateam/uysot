// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (5)
import { createSlice } from "@reduxjs/toolkit";
import xt from "i18next";
import be from "dayjs";
import { Aa } from "@/constants/index";
const createOrUpdate = {
  name: "",
  visible: false,
  isDirtyHouseOrBuilding: false,
  paymentType: {
    type: "PREPAYMENT_N_PERCENT",
  },
  filter: {
    houses: [],
    buildings: [],
  },
  flatIds: [],
  realtors: [0],
  totalElements: 0,
};
const u4 = {
  uz: "Taklif",
  ru: "Предложение",
  en: "Offer",
  tr: "Teklif",
  tj: "Пешниҳод",
  ky: "Сунуш",
};
const initialState = {
  table: {
    totalPages: 0,
    currentPage: 1,
    totalElements: 0,
  },
  trash: {
    visible: false,
  },
  view: {
    page: 1,
    currentPage: 1,
    visible: false,
    type: "ACTIVE",
    totalElements: 0,
  },
  createOrUpdate,
};
const YC = createSlice({
  name: "offer-slice",
  initialState,
  reducers: {
    setTrash: (e, t) => {
      e.trash = t.payload;
    },
    setCreateOrUpdate: (e, t) => {
      e.createOrUpdate = t.payload;
    },
    setCreateOrUpdateVisible: (e, t) => {
      e.createOrUpdate.id = t.payload?.id;
      e.createOrUpdate.visible = t.payload?.visible;
      e.createOrUpdate.name = `${u4[xt.language]} ${be().format(Aa)}`;
    },
    setCreateOrUpdateItem: (e, t) => {
      e.createOrUpdate[t.payload.key] = t.payload.value;
    },
    setCreateOrUpdateFilterItem: (e, t) => {
      e.createOrUpdate.filter[t.payload.key] = t.payload.value;
    },
    setCreateOrUpdateDeselectHouse: (e, t) => {
      e.createOrUpdate.filter.buildings = e.createOrUpdate.filter.buildings?.filter(
        (r) => JSON.parse(r)?.houseId !== t.payload
      );
      e.createOrUpdate.flatIds = [];
    },
    setCreateOrUpdateDeselectBuilding: (e) => {
      e.createOrUpdate.flatIds = [];
    },
    setCreateOrUpdateIsDirtyHouseOrBuilding: (e) => {
      e.createOrUpdate.isDirtyHouseOrBuilding = true;
    },
    setCreateOrUpdateAllChecked: (e, t) => {
      if (t.payload) {
        e.createOrUpdate.ignoreFlatIds = [];
        e.createOrUpdate.flatIds = [];
      }
      e.createOrUpdate.allChecked = t.payload;
    },
    setCreateOrUpdateTotalElements: (e, t) => {
      e.createOrUpdate.totalElements = t.payload;
    },
    setCreateOrUpdateClearFlats: (e) => {
      e.createOrUpdate.ignoreFlatIds = [];
      e.createOrUpdate.flatIds = [];
      e.createOrUpdate.allChecked = false;
    },
    setView: (e, t) => {
      e.view = t.payload;
    },
    setViewPage: (e, t) => {
      e.view.page = t.payload;
    },
    setViewType: (e, t) => {
      e.view.type = t.payload;
    },
    setViewTotalItems: (e, t) => {
      e.view.totalElements = t.payload.totalElements;
      e.view.currentPage = t.payload.currentPage;
    },
    setTableItems: (e, t) => {
      e.table = t.payload;
    },
  },
});
const {
  setCreateOrUpdate,
  setCreateOrUpdateItem,
  setTrash,
  setCreateOrUpdateFilterItem,
  setCreateOrUpdateVisible,
  setCreateOrUpdateIsDirtyHouseOrBuilding,
  setCreateOrUpdateDeselectHouse,
  setCreateOrUpdateDeselectBuilding,
  setView,
  setViewPage,
  setCreateOrUpdateAllChecked,
  setCreateOrUpdateTotalElements,
  setCreateOrUpdateClearFlats,
  setTableItems,
  setViewTotalItems,
  setViewType,
} = YC.actions;
export { YC };
