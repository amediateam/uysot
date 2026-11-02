// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (5)
import { createSlice } from "@reduxjs/toolkit";
import { ce } from "@/utils/storage";
const Ld = {
  left: {
    default: 35,
  },
  center: {
    default: 40,
  },
  right: {
    default: 25,
  },
};
const N8 = ["crm", "task", "event-list", "chat", "arrearage"];
const initialState = {
  lead: N8?.some((e) => window.location.pathname?.includes(e))
    ? ce.get("lead") || {}
    : {
        positionMode: ce.get("lead") ? ce.get("lead")?.positionMode : "sideBar",
      },
  setting: false,
  minimizedPipes: ce.get("minimizedPipes") || [],
  offsetTop: 0,
  isNewCRM: !!ce.get("isNewCRM"),
  chatType: "task",
  openSettingColumns: false,
  openCollapse: ce.get("crm-filter-collapse") ? !!ce.get("crm-filter-collapse") : true,
  leadWidgetCollapse: false,
  isFilterDropdownOpen: false,
  isSearching: false,
  searchValue: "",
  aiCreditLimitVisible: false,
  leadLayoutResizable: {
    percent: [Ld.left.default, Ld.center.default, Ld.right.default],
    px: [],
    rightCollapsed: true,
  },
  activeLeadId: null,
  lastActiveLead: {},
  showWelcomeModal: false,
};
const _1 = createSlice({
  name: "crmV2Slice",
  initialState,
  reducers: {
    setLead: (e, t) => {
      const { separator, ...rest } = t.payload;
      const positionMode = e.lead?.positionMode || "sideBar";
      const a = document.querySelector(".leadSaveButtons");
      e.lastActiveLead = {
        [Number(e.lead?.id)]: true,
      };
      if (a && e?.lead?.id !== "new") {
        a.classList.add("animate-bounce-x");
        setTimeout(() => {
          a.classList.remove("animate-bounce-x");
        }, 300);
      } else if (separator) {
        e.lead = {
          ...e.lead,
          positionMode,
          ...rest,
        };
        ce.set(
          "lead",
          JSON.stringify({
            ...e.lead,
            positionMode,
            ...rest,
          })
        );
      } else {
        e.lead = {
          positionMode,
          ...rest,
        };
        ce.set(
          "lead",
          JSON.stringify({
            positionMode,
            ...rest,
          })
        );
      }
    },
    setSetting: (e, t) => {
      e.setting = t.payload;
    },
    setMinimizedPipes: (e, t) => {
      if (e.minimizedPipes?.includes(t.payload)) {
        e.minimizedPipes = e.minimizedPipes?.filter((r) => r !== t.payload);
      } else {
        e.minimizedPipes.push(t.payload);
      }
      ce.set("minimizedPipes", JSON.stringify(e.minimizedPipes));
    },
    setOffsetTop: (e, t) => {
      e.offsetTop = t.payload;
    },
    setNewCrm: (e, t) => {
      e.isNewCRM = t.payload;
      if (t.payload) {
        ce.set("isNewCRM", String(t.payload));
      } else {
        ce.remove("isNewCRM");
      }
    },
    setChatType: (e, t) => {
      e.chatType = t.payload;
    },
    setOpenSettingColumns: (e, t) => {
      e.openSettingColumns = t.payload;
    },
    setOpenCollapse: (e, t) => {
      e.openCollapse = t.payload;
      if (t.payload) {
        ce.set("crm-filter-collapse", String(t.payload));
      } else {
        ce.remove("crm-filter-collapse");
      }
    },
    setIsFilterDropdownOpen: (e, t) => {
      e.isFilterDropdownOpen = t.payload;
    },
    setIsSearching: (e, t) => {
      e.isSearching = t.payload;
    },
    setSearchValue: (e, t) => {
      e.searchValue = t.payload;
    },
    closeFilterDropdown: (e) => {
      e.isFilterDropdownOpen = false;
      e.isSearching = false;
    },
    setLeadWidgetCollapse: (e, t) => {
      e.leadWidgetCollapse = t.payload;
    },
    setActiveEmbeddedApplicationId: (e, t) => {
      e.activeEmbeddedApplicationId = t.payload;
    },
    setAICreditLimitVisible: (e, t) => {
      e.aiCreditLimitVisible = t.payload;
    },
    setLeadLayoutResizable: (e, t) => {
      e.leadLayoutResizable = t.payload;
    },
    setActiveLeadId: (e, t) => {
      e.activeLeadId = t.payload;
    },
    setActiveEmbedWidgetId: (e, t) => {
      e.activeEmbedWidgetId = t.payload;
    },
    setShowWelcomeModal: (e, t) => {
      e.showWelcomeModal = t.payload;
    },
  },
});
const {
  setLead,
  setSetting,
  setMinimizedPipes,
  setOffsetTop,
  setNewCrm,
  setChatType,
  setOpenSettingColumns,
  setOpenCollapse,
  setIsFilterDropdownOpen,
  setIsSearching,
  setSearchValue,
  closeFilterDropdown,
  setLeadWidgetCollapse,
  setActiveEmbedWidgetId,
  setActiveEmbeddedApplicationId,
  setAICreditLimitVisible,
  setLeadLayoutResizable,
  setActiveLeadId,
  setShowWelcomeModal,
} = _1.actions;
export { _1 };
