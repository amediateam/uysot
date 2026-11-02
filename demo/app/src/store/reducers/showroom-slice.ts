// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice, current } from "@reduxjs/toolkit";
import { ce } from "@/utils/storage";
const initialState = {
  filter: {
    page: 1,
    size: 10,
    orders: {},
  },
  drawer: {
    id: null,
    floor: null,
    visible: false,
  },
  listSettingDrawer: false,
  apartments: [{}],
  apartmentActiveIndex: 0,
  petition: {
    visible: false,
    houseName: "",
  },
  flatNumber: ce.get("flatNumber") || "number",
  flatCount: 0,
  showroomV2: ce.get("showroomV2") || false,
  switchFilterStatus: false,
  activeInfoTab: "flat",
  isViewBookingBadge: JSON.parse(ce.get("isViewBookingBadge") || "false"),
  visualWeather: ce.get("visualWeather") || "SUNNY",
};
const GC = createSlice({
  name: "showroom-slice",
  initialState,
  reducers: {
    setShowroomFilter: (e, t) => {
      const { filter } = current(e);
      e.filter = {
        ...filter,
        ...t.payload,
      };
    },
    setShowroomNewFilter: (e, t) => {
      const { filter } = current(e);
      e.filter = {
        houseId: filter?.houseId,
        buildingIds: filter?.buildingIds,
        orders: filter?.orders,
        ...t.payload,
      };
    },
    setShowroomDrawer: (e, t) => {
      e.drawer = {
        ...t.payload,
      };
    },
    setListSettingDrawer: (e, t) => {
      e.listSettingDrawer = t.payload;
    },
    setShowroomApartments: (e, t) => {
      e.apartments = t.payload;
    },
    setShowroomApartmentActive: (e, t) => {
      e.apartmentActiveIndex = t.payload;
    },
    setResetActiveFlat: (e) => {
      e.apartmentActiveIndex = 0;
      e.apartments = [{}];
      e.drawer = {
        floor: null,
        id: null,
        visible: false,
      };
    },
    setShowroomPetition: (e, t) => {
      e.petition = t.payload;
    },
    setShowroomFlatNumber: (e, t) => {
      e.flatNumber = t?.payload;
      ce.set("flatNumber", t?.payload);
    },
    setShowroomFlatCount: (e, t) => {
      e.flatCount = t?.payload;
    },
    setShowroomV2: (e, t) => {
      e.showroomV2 = t.payload;
      ce.set("showroomV2", String(t.payload));
    },
    setSwitchFilterStatus: (e, t) => {
      e.switchFilterStatus = t.payload;
    },
    setIsViewBookingBadge: (e, t) => {
      e.isViewBookingBadge = t.payload;
      ce.set("isViewBookingBadge", String(t.payload));
      if (!t.payload) {
        e.activeInfoTab = "flat";
      }
    },
    setActiveInfoTab: (e, t) => {
      e.activeInfoTab = t.payload;
    },
    setVisualWeather: (e, t) => {
      e.visualWeather = t.payload;
    },
  },
});
const {
  setShowroomFilter,
  setShowroomDrawer,
  setListSettingDrawer,
  setShowroomNewFilter,
  setShowroomApartments,
  setShowroomApartmentActive,
  setShowroomPetition,
  setShowroomFlatNumber,
  setShowroomFlatCount,
  setResetActiveFlat,
  setShowroomV2,
  setSwitchFilterStatus,
  setIsViewBookingBadge,
  setActiveInfoTab,
  setVisualWeather,
} = GC.actions;
export { GC };
