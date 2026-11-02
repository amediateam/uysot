// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (9)
import { createSlice, current } from "@reduxjs/toolkit";
import { ce } from "@/utils/storage";
import { If } from "@/constants/storage-keys";
const K4 = {
  filter: {
    rooms: [1, 2, 3, 4, 5],
    maxArea: 160,
    minArea: 0,
    maxPrice: 2000000000,
    minPrice: 1000000,
    maxPerPrice: 15000000,
    minPerPrice: 0,
    repaired: "null",
    empty: false,
    attached: false,
    apartment: "null",
    fields: null,
    buildingId: null,
  },
  filterDefault: {
    rooms: [1, 2, 3, 4, 5],
    maxArea: 160,
    minArea: 0,
    maxPrice: 2000000000,
    minPrice: 1000000,
    maxPerPrice: 15000000,
    minPerPrice: 0,
    repaired: "null",
    empty: false,
    attached: false,
    apartment: "null",
    fields: null,
    buildingId: null,
  },
  data: [],
  reload: true,
  openDrawer: {
    id: 0,
    visible: false,
  },
  apartments: [{}],
  apartmentActiveIndex: 0,
  flatNumber: "number",
  status: "",
  flatCount: -1,
  showroomStatus: undefined,
};
const t1 = createSlice({
  name: "allHouseFilter",
  initialState: K4,
  reducers: {
    setAllHouseFilter: (e, t) => {
      e.filter = t.payload;
    },
    setAllHouseDefaultFilter: (e, t) => {
      e.filterDefault = t.payload;
    },
    setAllHouseCopy: (e, t) => {
      const r = [];
      t.payload.map((n) =>
        n?.map((i) =>
          i.map((a) =>
            a.map((o) => {
              if (!o.disable) {
                r.push(o.id);
              }
              return {
                ...o,
                isActive: o.disable ? false : o.isActive,
              };
            })
          )
        )
      );
    },
    setHouseReload: (e, t) => {
      e.reload = t.payload;
    },
    setApartments: (e, t) => {
      e.apartments = t.payload;
    },
    setApartmentActive: (e, t) => {
      e.apartmentActiveIndex = t.payload;
    },
    setOpenDrawer: (e, t) => {
      e.openDrawer = t.payload;
      const r = current(e.data).map((n) =>
        n?.map((i) =>
          i.map((a) =>
            a.map((o) => ({
              ...o,
              isActive: o.id === t.payload.id,
            }))
          )
        )
      );
      e.data = r;
    },
    setFlatNumber: (e, t) => {
      e.flatNumber = t?.payload;
    },
    setFlatStatus: (e, t) => {
      e.status = t.payload;
    },
    setFlatCount: (e, t) => {
      e.flatCount = t.payload;
    },
    setShowroomStatus: (e, t) => {
      e.showroomStatus = t.payload;
    },
  },
});
const {
  setAllHouseFilter,
  setAllHouseCopy,
  setHouseReload,
  setOpenDrawer,
  setAllHouseDefaultFilter,
  setApartments,
  setApartmentActive,
  setFlatNumber,
  setFlatStatus,
  setFlatCount,
  setShowroomStatus,
} = t1.actions;
const P8 = ce.get(If);
const I8 = (selectedLeads, payload) => {
  const r = new Map(selectedLeads.map((n) => [n.id, n]));
  payload.forEach((n) => r.set(n.id, n));
  return Array.from(r.values());
};
const Dd = (selectedLeads) => [...new Set(selectedLeads.map((t) => t.pipeStatusId))];
const A8 = {
  listViewActiveIds: [],
  listViewIgnoreIds: [],
  listViewAllChecked: false,
  taskListViewActiveIds: [],
  taskListViewIgnoreIds: [],
  sortableColumn: false,
  aktiveVoronkaId: 0,
  isOpenTableSettings: false,
  balance: 0,
  taskBalance: 0,
  showListView: !!P8,
  allColumnDisable: false,
  openDublicateModal: false,
  activeDashboardId: 0,
  checked: false,
  openDashboard: false,
  openDashboard1: false,
  updateWidget: false,
  isDefaultChecked: false,
  scrollPosition: 0,
  scolledIds: [],
  scrolledIdsAndPositions: [],
  createVoronka: false,
  listColumnIds: [],
  ignoreBalance: {},
  globalDuplicate: false,
  balanceCurrency: {},
  listBalance: {},
  currentPageLeadIds: [],
  leadCallNoteResponse: {},
  selectedLeads: [],
  selectedPipeStatusIds: [],
};
const g1 = createSlice({
  name: "allHouseFilter",
  initialState: A8,
  reducers: {
    setSortableColumn: (e, t) => {
      e.sortableColumn = t.payload;
    },
    setActiveVoronkaId: (e, t) => {
      e.aktiveVoronkaId = t.payload;
    },
    setActiveDashboardId: (e, t) => {
      e.activeDashboardId = t.payload;
    },
    openTableSettings: (e, t) => {
      e.isOpenTableSettings = t.payload;
    },
    setClearListView: (e) => {
      e.balance = 0;
      e.listViewActiveIds = [];
      e.balanceCurrency = {};
    },
    setClearTaskListView: (e) => {
      e.taskBalance = 0;
      e.taskListViewActiveIds = [];
      e.balanceCurrency = {};
    },
    setBalanceAndIds: (e, t) => {
      e.balance = t.payload.balance;
      e.listViewActiveIds = t.payload.ids;
      if (t?.payload?.ccy) {
        e.listBalance = {
          ...e.listBalance,
          [t.payload.ccy]: t.payload.balance || 0,
        };
      }
    },
    setTaskBalanceAndIds: (e, t) => {
      e.taskBalance = t.payload.balance;
      e.taskListViewActiveIds = t.payload.ids;
    },
    setTaskIgnoreIds: (e, t) => {
      e.taskListViewIgnoreIds = t.payload;
    },
    setListView: (e, t) => {
      e.showListView = t.payload;
      if (t.payload) {
        ce.set(If, "true");
      } else {
        ce.remove(If);
      }
    },
    setAllColumnDisable: (e, t) => {
      e.allColumnDisable = t.payload;
    },
    setOpenDublicateModal: (e, t) => {
      e.openDublicateModal = t.payload;
    },
    setChecked: (e, t) => {
      e.checked = t.payload;
    },
    setOpenDashboard: (e, t) => {
      e.openDashboard = t.payload;
    },
    setOpenDashboard1: (e, t) => {
      e.openDashboard1 = t.payload;
    },
    setUpdateWidgets: (e, t) => {
      e.updateWidget = t.payload;
    },
    setIsDefaultChecked: (e, t) => {
      e.isDefaultChecked = t.payload;
    },
    setScrolledIdsAndPositions: (e, t) => {
      const r = [...e.scrolledIdsAndPositions];
      const n = e.scrolledIdsAndPositions.findIndex((i) => i.id === t.payload.id);
      if (n !== -1) {
        r[n].position = t.payload.position;
        r[n].id = t.payload.id;
      } else {
        r.push({
          id: t.payload.id,
          position: t.payload.position,
        });
      }
      e.scrolledIdsAndPositions = r;
    },
    setCreateVoronka: (e, t) => {
      e.createVoronka = t.payload;
    },
    setListColumnIds: (e, t) => {
      e.listColumnIds = t.payload;
    },
    setListViewAllChecked: (e, t) => {
      e.listBalance = {};
      e.ignoreBalance = {};
      e.listViewIgnoreIds = [];
      e.listViewActiveIds = [];
      e.listViewAllChecked = t.payload;
    },
    setListViewIgnoreIds: (e, t) => {
      e.ignoreBalance = t.payload.balance;
      e.listViewIgnoreIds = t.payload.ids;
    },
    setClearListViewIds: (e) => {
      e.listBalance = {};
      e.ignoreBalance = {};
      e.listViewIgnoreIds = [];
      e.listViewActiveIds = [];
      e.selectedLeads = [];
      e.selectedPipeStatusIds = [];
      e.listViewAllChecked = false;
    },
    globalDuplicate: (e, t) => {
      if (typeof t?.payload === "boolean") {
        e.globalDuplicate = t?.payload;
      } else {
        e.globalDuplicate = !e.globalDuplicate;
      }
    },
    setCurrentPageLeadIds: (e, t) => {
      e.currentPageLeadIds = t.payload;
    },
    setLeadCallNoteResponse: (e, t) => {
      e.leadCallNoteResponse = {
        ...e.leadCallNoteResponse,
        ...t.payload,
      };
    },
    setToggleLeadSelection: (e, t) => {
      const r = e.selectedLeads.some((n) => n.id === t.payload.id);
      e.selectedLeads = r
        ? e.selectedLeads.filter((n) => n.id !== t.payload.id)
        : [...e.selectedLeads, t.payload];
      e.selectedPipeStatusIds = Dd(e.selectedLeads);
    },
    setSelectManyLeads: (e, t) => {
      e.selectedLeads = I8(e.selectedLeads, t.payload);
      e.selectedPipeStatusIds = Dd(e.selectedLeads);
    },
    setDeselectManyLeads: (e, t) => {
      const r = new Set(t.payload);
      e.selectedLeads = e.selectedLeads.filter((n) => !r.has(n.id));
      e.selectedPipeStatusIds = Dd(e.selectedLeads);
    },
    setSelectedPipeStatusIds: (e, t) => {
      e.selectedPipeStatusIds = t.payload;
    },
    setClearLeadSelection: (e) => {
      e.selectedLeads = [];
      e.selectedPipeStatusIds = [];
    },
  },
});
const {
  setActiveVoronkaId,
  setSortableColumn,
  openTableSettings,
  setClearListView,
  setBalanceAndIds,
  setListView,
  setAllColumnDisable,
  setActiveDashboardId,
  setClearTaskListView,
  setTaskBalanceAndIds,
  setOpenDublicateModal,
  setTaskIgnoreIds,
  setChecked,
  setOpenDashboard,
  setOpenDashboard1,
  setUpdateWidgets,
  setIsDefaultChecked,
  setScrolledIdsAndPositions,
  setCreateVoronka,
  setListColumnIds,
  setListViewIgnoreIds,
  setListViewAllChecked,
  setClearListViewIds,
  globalDuplicate,
  setCurrentPageLeadIds,
  setLeadCallNoteResponse,
  setClearLeadSelection,
  setDeselectManyLeads,
  setSelectManyLeads,
  setToggleLeadSelection,
  setSelectedPipeStatusIds,
} = g1.actions;
export { g1, t1 };
