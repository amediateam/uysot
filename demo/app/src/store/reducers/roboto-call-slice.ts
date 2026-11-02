// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (4)
import { createSlice } from "@reduxjs/toolkit";
import { uid } from "uid";
import be from "dayjs";
import { me } from "@/constants/index";
const sn = {
  SCHEDULE: "SCHEDULE",
  EVERY_DAY: "EVERY_DAY",
  CUSTOM_DAILY: "CUSTOM_DAILY",
  CUSTOM_WEEKLY: "CUSTOM_WEEKLY",
};
const initialState = {
  collectionVisible: false,
  audience: {
    name: "",
    queries: [
      {
        uid: uid(),
        check: null,
        field: null,
      },
    ],
    dataType: "DEBT",
    version: "v2",
    spec: null,
  },
  planning: {
    channel: null,
    retryCount: 1,
    startTime: null,
    startDate: null,
    finishDate: null,
    dayOfWeeks: null,
    scheduleDate: null,
    repeatEveryDay: null,
    automationType: "NOW",
    channelsParallelCallCount: 1,
    visibleOtherAutomation: false,
  },
  media: {
    fileList: null,
  },
  action: {
    id: 0,
    visible: false,
    type: "delete",
  },
  speechKitVisible: {
    visible: false,
    order: 0,
  },
  speechKitText: "",
  totalElements: null,
  statusSpeechKit: false,
  chatFlowId: null,
  visibleRobotCallConfirm: {
    visible: false,
    name: "",
  },
  isRefreshing: false,
  lastCompletedAt: null,
  showInPercentage: false,
  marketingAnnotationState: false,
  isMarketingAnnotationRefreshing: false,
};
const FC = createSlice({
  initialState,
  name: "roboto-call-slice",
  reducers: {
    applyActionCollection: (e, t) => {
      const { visible, data, specRows } = t.payload;
      e.collectionVisible = visible;
      if (data) {
        e.id = data?.id || null;
        e.audience = {
          name: data?.name,
          id: data?.query?.id,
          dataType: data?.query?.dataType,
          version: data?.query?.spec || !data?.query?.id ? "v2" : "v1",
          spec: data?.query?.spec ?? null,
          queries: data?.query?.spec
            ? (specRows ?? []).map((a) => ({
                uid: uid(),
                ...a,
              }))
            : data?.query?.filter?.queries?.map((a) => ({
                uid: uid(),
                ...a,
                clientLevels: a?.values,
                field: a.field === "CUSTOM_FIELD" ? `CUSTOM_FIELD:${a?.id}` : a.field,
              })) ?? [],
        };
        e.planning = {
          ...data?.campaignAutomation,
          channel: data?.channel?.id,
          retryCount: data?.retryCount,
          visibleOtherAutomation: false,
          channelsParallelCallCount: data?.channelsParallelCallCount,
        };
        e.media = {
          fileList: data?.audios?.map(({ id, order, files, speed, text, type, voice }) => ({
            id,
            order,
            speed,
            text,
            type,
            voice,
            files,
          })),
        };
      }
    },
    setClearCollection: (e) => {
      e.id = null;
      e.media = initialState.media;
      e.audience = initialState.audience;
      e.planning = initialState.planning;
    },
    setCollectionId: (e, t) => {
      e.id = t.payload;
    },
    setCollectionAudienceItem: (e, t) => {
      const { key, value } = t.payload;
      e.audience[key] = value;
      if (key === "dataType") {
        e.audience.spec = null;
        e.audience.queries = [
          {
            uid: uid(),
            check: null,
            field: null,
          },
        ];
      }
    },
    setCollectionAudienceQueriesItem: (e, t) => {
      const { key, value, index } = t.payload;
      e.audience.queries[index][key] = value;
      if (key === "field") {
        e.audience.queries[index].ids = null;
        e.audience.queries[index].date = null;
        e.audience.queries[index].check = null;
        e.audience.queries[index].value = null;
        e.audience.queries[index].subIds = null;
        e.audience.queries[index].clientLevels = null;
      }
    },
    setCollectionAudienceQueryDelete: (e, t) => {
      e.audience.queries = e.audience.queries?.filter(({ uid }) => uid !== t.payload);
    },
    setCollectionAudienceQueryAdd: (e) => {
      e.audience.queries = [
        ...e.audience.queries,
        {
          uid: uid(),
          check: null,
          field: null,
        },
      ];
    },
    setCollectionPlanningItem: (e, t) => {
      const { key, value } = t.payload;
      e.planning[key] = value;
      if (
        key === "automationType" &&
        value &&
        !["OTHER", sn.EVERY_DAY, sn.CUSTOM_DAILY, sn.CUSTOM_WEEKLY].includes(value)
      ) {
        e.planning.finishDate = null;
        e.planning.startDate = null;
      }
      if (key === "automationType" && value === "OTHER") {
        e.planning.visibleOtherAutomation = true;
      }
      if (key === "automationType" && value !== sn.SCHEDULE) {
        e.planning.scheduleDate = null;
      }
      if (
        key === "automationType" &&
        value &&
        ![sn.CUSTOM_DAILY, sn.CUSTOM_WEEKLY].includes(value)
      ) {
        e.planning.dayOfWeeks = null;
        e.planning.repeatEveryDay = null;
      }
      if (
        key === "automationType" &&
        value &&
        ["OTHER", sn.EVERY_DAY, sn.CUSTOM_DAILY, sn.CUSTOM_WEEKLY].includes(value) &&
        !e.planning.startDate
      ) {
        e.planning.startDate = be().format(me);
      }
    },
    setCollectionMediaFile: (e, t) => {
      e.media.fileList = [
        ...(e.media.fileList || []),
        {
          files: t.payload?.files,
          type: "AUDIO",
          order: (e.media.fileList?.length || 0) + 1,
        },
      ];
    },
    setCollectionSpeechKitFile: (e, t) => {
      e.media.fileList = [
        ...(e.media.fileList || []),
        {
          ...t.payload,
          type: "YANDEX_TTS",
          order: (e.media.fileList?.length || 0) + 1,
        },
      ];
    },
    setCollectionMediaFileDelete: (e, t) => {
      e.media.fileList = e.media?.fileList?.filter((r) => r?.files?.id !== t.payload) || null;
    },
    setCollectionFileDelete: (e, t) => {
      e.media.fileList = e.media?.fileList?.filter((r) => r?.order !== t.payload) || null;
    },
    setAllCollectionMediaFiles: (e, t) => {
      e.media.fileList = t.payload;
    },
    setCollectionAction: (e, t) => {
      e.action = t.payload;
    },
    setSpeechKitVisible: (e, t) => {
      e.speechKitVisible.order = t.payload.order;
      e.speechKitVisible.visible = t.payload.visible;
    },
    setSpeechKitText: (e, t) => {
      e.speechKitText = t.payload;
    },
    setTotalElements: (e, t) => {
      e.totalElements = t.payload;
    },
    setStatusSpeechKit: (e, t) => {
      e.statusSpeechKit = t.payload;
    },
    setChatFlowId: (e, t) => {
      e.chatFlowId = t.payload;
    },
    setVisibleRobotCallConfirm: (e, t) => {
      e.visibleRobotCallConfirm = t.payload;
    },
    setDataType: (e, t) => {
      if (e.audience.dataType !== t.payload) {
        e.audience.spec = null;
      }
      e.audience.dataType = t.payload;
    },
    setMarketingRefreshAction: (e, t) => {
      e.isRefreshing = t.payload.isRefreshing;
      e.lastCompletedAt = t.payload.lastCompletedAt;
    },
    setShowInPercentage: (e, t) => {
      e.showInPercentage = t.payload;
    },
    setShowMarketingAnnotationState: (e, t) => {
      e.marketingAnnotationState = t.payload;
    },
    setMarketingAnnotationRefreshing: (e, t) => {
      e.isMarketingAnnotationRefreshing = t.payload;
    },
  },
});
const {
  setClearCollection,
  setCollectionAction,
  applyActionCollection,
  setCollectionMediaFile,
  setCollectionAudienceItem,
  setCollectionPlanningItem,
  setCollectionMediaFileDelete,
  setCollectionAudienceQueryAdd,
  setCollectionAudienceQueriesItem,
  setCollectionAudienceQueryDelete,
  setSpeechKitVisible,
  setSpeechKitText,
  setCollectionSpeechKitFile,
  setCollectionFileDelete,
  setAllCollectionMediaFiles,
  setTotalElements,
  setStatusSpeechKit,
  setChatFlowId,
  setVisibleRobotCallConfirm,
  setDataType,
  setMarketingRefreshAction,
  setShowInPercentage,
  setShowMarketingAnnotationState,
  setMarketingAnnotationRefreshing,
} = FC.actions;
export { FC };
