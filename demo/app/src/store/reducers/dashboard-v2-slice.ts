// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  layout: [],
  isUpdate: false,
  activeMappingFilterId: null,
  widgetMappingDrafts: {},
  visibleShareDashboard: false,
  isVisibleAlert: false,
  resizable: {
    isDragDrop: false,
    isResize: false,
  },
  controller: {
    visible: false,
  },
  createOrUpdateDashboard: {
    visible: false,
  },
  dashboardDelete: {
    visible: false,
  },
  dashboards: {
    visible: false,
  },
  dashboardUpdate: {
    visible: false,
  },
  settings: {
    id: "color_1",
    visible: false,
  },
  widgetDelete: {
    visible: false,
  },
  widgetConvert: {
    visible: false,
  },
  widgetSettingsV2: {
    visible: false,
  },
  widgetUpdate: {
    visible: false,
  },
  scrollToWidgetId: null,
};
const UC = createSlice({
  name: "dashboard-v2-slice",
  initialState,
  reducers: {
    setLayout: (e, t) => {
      e.layout = t.payload.map((r) => ({
        ...r,
      }));
    },
    setUpdate: (e, t) => {
      e.isUpdate = t.payload;
      if (!t.payload) {
        e.activeMappingFilterId = null;
        e.widgetMappingDrafts = {};
      }
    },
    setActiveMappingFilterId: (e, t) => {
      e.activeMappingFilterId = t.payload;
    },
    setWidgetMappingDraft: (e, t) => {
      e.widgetMappingDrafts[t.payload.widgetId] = t.payload.mappings;
    },
    clearWidgetMappingDrafts: (e) => {
      e.widgetMappingDrafts = {};
    },
    setSettings: (e, t) => {
      e.settings = t.payload;
    },
    setDashboardsDrawer: (e, t) => {
      e.dashboards.visible = t.payload;
    },
    setDashboardDelete: (e, t) => {
      e.dashboardDelete = t.payload;
    },
    setWidgetDelete: (e, t) => {
      e.widgetDelete = t.payload;
    },
    setWidgetConvert: (e, t) => {
      e.widgetConvert = t.payload;
    },
    setWidgetSettingsV2: (e, t) => {
      if (!t.payload.visible) {
        if (t.payload.persisting) {
          e.widgetSettingsV2 = {
            ...e.widgetSettingsV2,
            ...t.payload,
            visible: false,
            persisting: true,
          };
          return;
        }
        e.widgetSettingsV2 = {
          visible: false,
        };
        return;
      }
      e.widgetSettingsV2 = {
        ...e.widgetSettingsV2,
        ...t.payload,
        persisting: false,
      };
    },
    patchWidgetSettingsV2: (e, t) => {
      if (!(!e.widgetSettingsV2.visible && !e.widgetSettingsV2.persisting)) {
        Object.assign(e.widgetSettingsV2, t.payload);
      }
    },
    setDashboardUpdate: (e, t) => {
      e.dashboardUpdate = t.payload;
    },
    setWidgetUpdate: (e, t) => {
      e.widgetUpdate = t.payload;
    },
    setActiveDashboard: (e, t) => {
      e.activeDashboard = t.payload;
    },
    setRedirectDashboard: (e, t) => {
      e.redirectDashboard = t.payload;
    },
    setDashboardController: (e, t) => {
      e.controller = t.payload;
    },
    setCreateOrUpdateWidget: (e, t) => {
      e.createOrUpdateDashboard = t.payload;
    },
    setIsVisibleAlert: (e, t) => {
      e.isVisibleAlert = t.payload;
    },
    setResizable: (e, t) => {
      e.resizable = t.payload;
    },
    setVisibleShareDashboard: (e, t) => {
      e.visibleShareDashboard = t.payload;
    },
    setScrollToWidgetId: (e, t) => {
      e.scrollToWidgetId = t.payload;
    },
  },
});
const {
  setUpdate,
  setActiveMappingFilterId,
  setWidgetMappingDraft,
  clearWidgetMappingDrafts,
  setSettings,
  setDashboardsDrawer,
  setLayout,
  setDashboardDelete,
  setDashboardUpdate,
  setWidgetDelete,
  setWidgetConvert,
  setWidgetSettingsV2,
  patchWidgetSettingsV2,
  setWidgetUpdate,
  setActiveDashboard,
  setRedirectDashboard,
  setDashboardController,
  setCreateOrUpdateWidget,
  setIsVisibleAlert,
  setResizable,
  setVisibleShareDashboard,
  setScrollToWidgetId,
} = UC.actions;
export { UC };
