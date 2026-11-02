// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (4)
import { createSlice, current } from "@reduxjs/toolkit";
import { vt } from "@/utils/helpers";
import { W } from "@/utils/round";
const o0 = (currencyDto, t, balance) => ((currencyDto?.value || 1) * balance) / (t?.value || 1);
const initialState = {
  balanceString: "0",
  tags: [],
  contacts: [],
  balance: 0,
  pipeStatusId: 0,
  oldPipeStatusId: "0",
  leadFieldValue: [],
  pipeName: "",
  responsibleById: undefined,
  isChange: false,
  pipeId: 0,
  pipeStatusName: "",
  oldPipeStatusName: "",
  colorStatus: "",
  isAddContact: false,
  id: undefined,
  name: "",
  isMoiZvonki: false,
  showReasonRefusal: false,
  showComplete: false,
  oldPipeName: "",
  clientId: -1,
  clientName: "",
  clientPhone: "",
  clientIsVisible: false,
  openDublicateModal: false,
  openConfirmModal: false,
  dublicateClientId: undefined,
  isResponsible: false,
  leadFieldValueAi: [],
  loadingNoteIds: [],
  isHasTask: false,
  autofillWsData: {
    contactId: null,
    fieldId: null,
    leadId: null,
    value: null,
  },
  autofillLoading: {
    key: null,
    value: null,
  },
  mainContactId: null,
  countOpenTasks: null,
};
const v1 = createSlice({
  name: "CrmOneLidSlice",
  initialState,
  reducers: {
    setCrmOneLid: (e, t) => {
      const r = [...(t?.payload?.contacts || [])];
      for (let n = 0; n < r.length; n++) {
        if (r[n].phones.length === 0) {
          r[n].phones.push("");
        }
      }
      e.balance = t?.payload?.balance;
      e.balanceString = t?.payload?.balance.toLocaleString("ru");
      e.contacts = r;
      e.tags = t?.payload?.tags;
      e.pipeName = t?.payload?.pipeStatusResponse?.pipeName || "";
      e.leadFieldValue = t?.payload?.fields;
      e.pipeStatusId = t?.payload?.pipeStatusResponse?.id || 0;
      e.responsibleById = t?.payload?.responsibleById;
      e.isChange = false;
      e.pipeId = t?.payload?.pipeStatusResponse?.pipeId;
      e.pipeStatusName = t?.payload?.pipeStatusResponse?.name;
      e.colorStatus = t?.payload?.pipeStatusResponse?.color;
      e.isAddContact = false;
      e.id = t?.payload?.id;
      e.name = t?.payload?.name;
      e.isMoiZvonki = t?.payload?.isMoiZvonki;
      e.currencyDto = t?.payload?.currencyDto;
      e.mainContactId = t?.payload?.mainContactId;
    },
    setNewLid: (e, t) => {
      const t_payload = t.payload;
      e.balance = 0;
      e.balanceString = "0";
      e.contacts = [
        {
          name: "",
          fields: [],
          id: null,
          phones: [""],
          wazzupAccounts: [],
          lastUpdateCountDownTimestamp: null,
        },
      ];
      e.tags = [];
      e.leadFieldValue = t_payload?.leadFieldValue ?? [];
      e.pipeStatusId = t_payload?.pipeStatus?.id || 0;
      e.pipeStatusName = t_payload?.pipeStatus?.name ?? "";
      e.colorStatus = t_payload?.pipeStatus?.color ?? "";
      e.pipeId = t_payload?.pipeStatus?.pipeId ?? 0;
      e.pipeName = t_payload?.pipeStatus?.pipeName ?? "";
      e.showReasonRefusal = t_payload?.pipeStatus?.type === "FAILED";
      e.showComplete = t_payload?.pipeStatus?.type === "SUCCESS";
      e.responsibleById = t_payload?.responsibleById;
      e.isResponsible = !!t_payload?.responsibleById;
      e.isChange = true;
      e.isAddContact = true;
      e.id = undefined;
      e.name = "";
      e.mainContactId = null;
    },
    setChangeLidName: (e, t) => {
      e.name = t?.payload;
      e.isChange = true;
    },
    setChangePipeStatus: (e, t) => {
      e.pipeStatusId = t?.payload?.id || 0;
      e.pipeStatusName = t?.payload?.name;
      e.colorStatus = t?.payload?.color;
      e.pipeId = t?.payload?.pipeId;
      e.pipeName = t?.payload?.pipeName || "";
      e.showReasonRefusal = t?.payload?.type === "FAILED";
      e.showComplete = t?.payload?.type === "SUCCESS";
      e.isChange = true;
    },
    setChangePipeStatusClear: (e) => {
      e.pipeStatusId = 0;
      e.pipeStatusName = "";
      e.colorStatus = "";
      e.pipeId = 0;
      e.pipeName = "";
      e.showReasonRefusal = false;
      e.showComplete = false;
      e.isChange = false;
      e.responsibleById = undefined;
    },
    setchangeOldPipeStatus: (e, t) => {
      e.oldPipeStatusId = String(t?.payload?.id);
      e.oldPipeStatusName = t?.payload?.name;
      e.oldPipeName = t?.payload?.pipeName || "";
    },
    setTags: (e, t) => {
      e.tags = t?.payload;
      e.isChange = true;
    },
    setTagsNotChange: (e, t) => {
      e.tags = t?.payload;
    },
    setEmployeeId: (e, t) => {
      e.responsibleById = t?.payload;
      e.isChange = true;
      if (t?.payload) {
        e.isResponsible = true;
      } else {
        e.isResponsible = false;
      }
    },
    setBalance: (e, t) => {
      e.balance = vt.parseFloatStringToNumber(t?.payload);
      e.balanceString = t?.payload;
      e.isChange = true;
    },
    setCurrecyDto: (e, t) => {
      const { currencyDto, balance } = current(e);
      e.currencyDto = t?.payload;
      e.balance = o0(currencyDto, t?.payload, balance);
      e.balanceString = W(o0(currencyDto, t?.payload, balance)).toLocaleString("ru");
      e.isChange = true;
    },
    changeLeadsFiledValue: (e, t) => {
      const r = [...e.leadFieldValueAi];
      const n = [...e.leadFieldValue];
      let i = false;
      for (let a = 0; a < n.length; a++) {
        if (n[a].id === t?.payload?.id) {
          n[a].value = t?.payload?.value;
          n[a].valueType = t?.payload?.valueType;
          n[a].number = t?.payload?.number;
          if (t?.payload?.currencyId !== undefined) {
            n[a].currencyId = t?.payload?.currencyId;
          }
          i = true;
        }
      }
      if (!i) {
        n.push({
          value: t?.payload?.value,
          id: t?.payload?.id,
          number: t?.payload?.number,
          valueType: t?.payload?.valueType,
          ...(t?.payload?.currencyId !== undefined && {
            currencyId: t?.payload?.currencyId,
          }),
        });
      }
      if (t?.payload?.ai) {
        r.push(`${t?.payload?.id}:${t?.payload?.key}`);
        e.leadFieldValueAi = r;
      }
      e.leadFieldValue = n;
      e.isChange = true;
    },
    leadFieldFilterAi: (e, t) => {
      const { leadFieldValueAi } = current(e);
      e.leadFieldValueAi = leadFieldValueAi?.filter((n) => n !== t?.payload);
    },
    addLeadFieldAi: (e, t) => {
      const { leadFieldValueAi } = current(e);
      const n = [...leadFieldValueAi, t?.payload];
      e.leadFieldValueAi = n;
    },
    changeLeadFiledVal: (e, t) => {
      const r = [...e.leadFieldValue];
      let n = false;
      for (let i = 0; i < r.length; i++) {
        if (r[i].id === t?.payload?.id && r[i].valueType === t?.payload?.valueType) {
          r[i].value = t?.payload?.value;
          r[i].valueType = t?.payload?.valueType;
          if (t?.payload?.currencyId !== undefined) {
            r[i].currencyId = t?.payload?.currencyId;
          }
          n = true;
        }
      }
      if (!n) {
        r.push({
          value: t?.payload?.value,
          id: t?.payload?.id,
          valueType: t?.payload?.valueType,
          ...(t?.payload?.currencyId !== undefined && {
            currencyId: t?.payload?.currencyId,
          }),
        });
      }
      e.leadFieldValue = r;
      e.isChange = true;
    },
    changeLeadsFiledValueList: (e, t) => {
      const r = [...e.leadFieldValue];
      const n = [...e.leadFieldValueAi];
      let i = false;
      for (let a = 0; a < r.length; a++) {
        if (r[a].id === t?.payload?.id) {
          r[a].valueList = t?.payload?.valueList;
          i = true;
        }
      }
      if (!i) {
        r.push({
          valueList: t?.payload?.valueList,
          id: t?.payload?.id,
        });
      }
      if (t?.payload?.ai) {
        n.push(`${t?.payload?.id}:${t?.payload?.valueList[0]}`);
        e.leadFieldValueAi = n;
      }
      e.leadFieldValue = r;
      e.isChange = true;
    },
    changeLeadsFiledValueFiles: (e, t) => {
      const r = [...e.leadFieldValue];
      let n = false;
      for (let i = 0; i < r.length; i++) {
        if (r[i].id === t?.payload?.id) {
          r[i].files = t?.payload?.files;
          n = true;
        }
      }
      if (!n) {
        r.push({
          id: t?.payload?.id,
          files: t?.payload?.files,
        });
      }
      e.leadFieldValue = r;
      e.isChange = true;
    },
    changeContactsFiledValue: (e, t) => {
      const r = [...e.contacts];
      const n = [...e.leadFieldValueAi];
      for (let i = 0; i < r.length; i++) {
        if (r[i].id === t?.payload?.contactId) {
          let a = false;
          const o = r[i].fields ? [...r[i].fields] : [];
          for (let s = 0; s < o.length; s++) {
            if (o[s].id === t?.payload?.id) {
              o[s].value = t?.payload?.value;
              o[s].valueType = t?.payload?.valueType;
              if (t?.payload?.currencyId !== undefined) {
                o[s].currencyId = t?.payload?.currencyId;
              }
              o[s].number = t?.payload?.number;
              a = true;
            }
          }
          if (!a) {
            o.push({
              value: t?.payload?.value,
              id: t?.payload?.id,
              number: t?.payload?.number,
              valueType: t?.payload?.valueType,
              ...(t?.payload?.currencyId !== undefined && {
                currencyId: t?.payload?.currencyId,
              }),
            });
          }
          r[i].fields = o;
        }
      }
      if (t?.payload?.ai) {
        n.push(`${t?.payload?.id}:${t?.payload?.key}:${t?.payload?.contactId}`);
        e.leadFieldValueAi = n;
      }
      e.contacts = r;
      e.isChange = true;
    },
    changeContactsFiledValueList: (e, t) => {
      const r = [...e.contacts];
      const n = [...e.leadFieldValueAi];
      for (let i = 0; i < r.length; i++) {
        if (r[i].id === t?.payload?.contactId) {
          let a = false;
          const o = r[i].fields ? [...r[i].fields] : [];
          for (let s = 0; s < o.length; s++) {
            if (o[s].id === t?.payload?.id) {
              o[s].valueList = t?.payload?.valueList;
              a = true;
            }
          }
          if (!a) {
            o.push({
              valueList: t?.payload?.valueList,
              id: t?.payload?.id,
            });
          }
          r[i].fields = o;
        }
      }
      if (t?.payload?.ai) {
        n.push(`${t?.payload?.id}:${t?.payload?.key}:${t?.payload?.contactId}`);
        e.leadFieldValueAi = n;
      }
      e.contacts = r;
      e.isChange = true;
    },
    changeContactsFiledValueFiles: (e, t) => {
      const r = [...e.contacts];
      for (let n = 0; n < r.length; n++) {
        if (r[n].id === t?.payload?.contactId) {
          let i = false;
          const a = r[n].fields ? [...r[n].fields] : [];
          for (let o = 0; o < a.length; o++) {
            if (a[o].id === t?.payload?.id) {
              a[o].files = t?.payload?.files;
              i = true;
            }
          }
          if (!i) {
            a.push({
              id: t?.payload?.id,
              files: t?.payload?.files,
            });
          }
          r[n].fields = a;
        }
      }
      e.contacts = r;
      e.isChange = true;
    },
    changeContactName: (e, t) => {
      const r = [...e.contacts];
      const n = [...e.leadFieldValueAi];
      for (let i = 0; i < r.length; i++) {
        if (r[i].id === t?.payload?.contactId) {
          r[i].name = t?.payload?.value;
        }
      }
      if (t?.payload?.ai) {
        n.push(`${t?.payload?.contactId}:${t?.payload?.key}`);
        e.leadFieldValueAi = n;
      }
      e.contacts = r;
      e.isChange = true;
    },
    changeContactBlocked: (e, t) => {
      for (let r = 0; r < e.contacts.length; r++) {
        if (e.contacts[r].id === t.payload.contactId) {
          e.contacts[r].blocked = t.payload.blocked;
        }
      }
    },
    addContact: (e) => {
      const t = [...e.contacts];
      t.push({
        name: "",
        fields: [],
        id: null,
        phones: [""],
        wazzupAccounts: [],
        lastUpdateCountDownTimestamp: null,
      });
      e.isAddContact = true;
      e.contacts = t;
      e.isChange = true;
    },
    addPhoneInsideContact: (e, t) => {
      let { isChange } = e;
      const n = [];
      const contacts = current(e).contacts;
      for (let a = 0; a < contacts.length; a++) {
        if (a !== t?.payload?.indexContact) {
          n.push(contacts[a]);
        } else {
          const o = [];
          for (let s = 0; s < contacts[a].phones.length; s++) {
            o.push(contacts[a].phones[s]);
          }
          if (o[o.length - 1]) {
            o.push("");
            isChange = true;
          }
          n.push({
            ...contacts[a],
            phones: o,
          });
        }
      }
      e.contacts = n;
      e.isChange = isChange;
    },
    removeContactPhone: (e, t) => {
      e.contacts[t?.payload?.indexContact].phones = e.contacts[
        t?.payload?.indexContact
      ].phones?.filter((r, n) => n !== t?.payload?.deleteIndex);
      e.isChange = true;
    },
    changePhoneInsideContact: (e, t) => {
      const r = [];
      const contacts = current(e).contacts;
      for (let i = 0; i < contacts.length; i++) {
        if (i !== t?.payload?.indexContact) {
          r.push(contacts[i]);
        } else {
          const a = [];
          for (let o = 0; o < contacts[i].phones.length; o++) {
            if (o !== t?.payload?.indexPhone) {
              a.push(contacts[i].phones[o]);
            } else {
              a.push(t?.payload?.value);
            }
          }
          r.push({
            ...contacts[i],
            phones: a,
          });
        }
      }
      e.contacts = r;
      e.isChange = true;
    },
    removeContact: (e, t) => {
      const r = [...e.contacts];
      e.contacts = r.filter((n) => n.id !== t?.payload);
      if (t?.payload === null) {
        e.isAddContact = false;
      }
      e.isChange = true;
    },
    setOpenClientMessage: (e, t) => {
      e.clientIsVisible = t?.payload?.isVisible;
      e.clientId = t?.payload?.id;
      e.clientName = t?.payload?.name;
      e.clientPhone = t?.payload?.phone;
    },
    setOpenDublicateModal: (e, t) => {
      e.openDublicateModal = t?.payload;
    },
    setOpenConfirmModal: (e, t) => {
      e.openConfirmModal = t?.payload;
    },
    setChangeDublicateClientId: (e, t) => {
      e.dublicateClientId = t?.payload;
    },
    setChangeResponsible: (e) => {
      e.isResponsible = false;
    },
    setLoadingNoteId: (e, t) => {
      e.loadingNoteIds = [...e.loadingNoteIds, t?.payload];
    },
    setLoadingNoteIdFilter: (e, t) => {
      e.loadingNoteIds = [...e.loadingNoteIds].filter((r) => r !== t?.payload);
    },
    setCrmChange: (e, t) => {
      e.isChange = t?.payload;
    },
    setIsHasTask: (e, t) => {
      e.isHasTask = t?.payload;
    },
    setAutofillWsData: (e, t) => {
      e.autofillWsData = t.payload;
    },
    setAutofillLoading: (e, t) => {
      e.autofillLoading = {
        key: t.payload.key,
        value: t.payload.value,
      };
    },
    setCountOpenTasks: (e, t) => {
      e.countOpenTasks = t.payload;
    },
    changeCountOpenTasks: (e, t) => {
      if (e.countOpenTasks !== null) {
        e.countOpenTasks = Math.max(0, e.countOpenTasks + t.payload);
      }
    },
    setShowComplete(e, t) {
      e.showComplete = t.payload;
    },
  },
});
const {
  setCrmOneLid,
  setChangePipeStatus,
  setTags,
  setEmployeeId,
  setBalance,
  changeLeadsFiledValue,
  changeContactsFiledValue,
  changeContactName,
  addContact,
  setChangeLidName,
  setNewLid,
  addPhoneInsideContact,
  changePhoneInsideContact,
  removeContact,
  setchangeOldPipeStatus,
  changeLeadsFiledValueList,
  changeLeadsFiledValueFiles,
  changeLeadFiledVal,
  setOpenDublicateModal,
  setChangeDublicateClientId,
  setOpenClientMessage,
  setOpenConfirmModal,
  setChangePipeStatusClear,
  setChangeResponsible,
  leadFieldFilterAi,
  addLeadFieldAi,
  setLoadingNoteId,
  setLoadingNoteIdFilter,
  setTagsNotChange,
  changeContactsFiledValueList,
  changeContactsFiledValueFiles,
  setCurrecyDto,
  setCrmChange,
  removeContactPhone,
  setIsHasTask,
  setAutofillWsData,
  setAutofillLoading,
  setCountOpenTasks,
  changeCountOpenTasks,
  changeContactBlocked,
  setShowComplete,
} = v1.actions;
export { v1 };
