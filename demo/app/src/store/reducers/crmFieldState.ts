// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (4)
import { createSlice } from "@reduxjs/toolkit";
const h1 = {
  LED: "LED",
  CONTACT: "CONTACT",
};
const initialState = {
  led: [],
  contact: [],
  isChangeFields: false,
  isChangeNotTaskConf: false,
  autoRemindNotTask: false,
  autoRemindTime: 3000,
  notChangeStepStatus: false,
  notTaskPipes: [],
  dataByKey: [],
  fieldSection: [],
  initialFieldSection: [],
  deletedSectionIds: [],
  editingSectionUuid: null,
};
const p1 = createSlice({
  name: "crmFieldState",
  initialState,
  reducers: {
    setCrmFields: (e, t) => {
      const r = [];
      const n = [];
      for (let i = 0; i < t.payload?.data?.length; i++) {
        if (t.payload?.data[i]?.infoType === h1.CONTACT) {
          if (
            t.payload?.customdata?.length > 0 &&
            t.payload?.customdata[i]?.id === t.payload?.data[i]?.id
          ) {
            n.push({
              ...t.payload?.data[i],
              orders: i,
              checked: t.payload?.customdata[i].checked,
              fieldStatuses: t.payload.data[i].fieldStatuses,
            });
          } else {
            n.push({
              ...t.payload?.data[i],
              orders: i,
              checked: true,
            });
          }
        } else if (
          t.payload?.customdata?.length > 0 &&
          t.payload?.customdata[i]?.id === t.payload?.data[i]?.id
        ) {
          r.push({
            ...t.payload?.data[i],
            orders: i,
            checked: t.payload?.customdata[i].checked,
            fieldStatuses: t.payload.data[i].fieldStatuses,
          });
        } else {
          r.push({
            ...t.payload?.data[i],
            orders: i,
            checked: true,
          });
        }
      }
      e.led = r;
      e.contact = n;
      e.isChangeFields = false;
    },
    setLedFields: (e, t) => {
      e.led = t.payload;
      e.isChangeFields = true;
    },
    setContactFields: (e, t) => {
      e.contact = t.payload;
      e.isChangeFields = true;
    },
    setLedFieldsAdd: (e, t) => {
      const r = -Date.now();
      const n = {
        orders: e.led.length,
        ...t.payload,
        id: t.payload.id ?? r,
      };
      e.led = [...e.led, n];
      if (e.fieldSection.length > 0) {
        const i = e.fieldSection.reduce((acc, item) => {
          if (item.orders > acc.orders) {
            return item;
          }
          return acc;
        }, e.fieldSection[0]);
        i.fieldIds = [...(i.fieldIds ?? []), r];
      }
      e.isChangeFields = true;
    },
    setLedFieldsDelete: (e, t) => {
      const r = [];
      for (let n = 0; n < e.led.length; n++) {
        if (n !== t.payload) {
          r.push(e.led[n]);
        }
      }
      e.led = r;
      e.isChangeFields = true;
    },
    setLedFieldsEdit: (e, t) => {
      e.led[t.payload.index] = t.payload.field;
      e.isChangeFields = true;
    },
    setContactFieldsAdd: (e, t) => {
      e.contact = [
        ...e.contact,
        {
          orders: e.contact?.length,
          ...t.payload,
        },
      ];
      e.isChangeFields = true;
    },
    setContactFieldsDelete: (e, t) => {
      const r = [];
      for (let n = 0; n < e.contact.length; n++) {
        if (n !== t.payload) {
          r.push(e.contact[n]);
        }
      }
      e.contact = r;
      e.isChangeFields = true;
    },
    setContactFieldsEdit: (e, t) => {
      e.contact[t.payload.index] = t.payload.field;
      e.isChangeFields = true;
    },
    setNotChangeStepStatus: (e, t) => {
      e.notChangeStepStatus = t.payload;
      e.isChangeNotTaskConf = true;
    },
    setAutoRemindNotTask: (e, t) => {
      e.autoRemindNotTask = t.payload;
      e.isChangeNotTaskConf = true;
    },
    setAutoRemindTime: (e, t) => {
      e.autoRemindTime = t.payload;
      e.isChangeNotTaskConf = true;
    },
    setNotTaskPipes: (e, t) => {
      e.notTaskPipes = t.payload;
      e.isChangeNotTaskConf = true;
    },
    setCheckedLead: (e, t) => {
      const r = e.led.map((n) => {
        if (n.id === t.payload.id) {
          return {
            ...n,
            checked: t.payload.checked,
          };
        }
        return {
          ...n,
        };
      });
      e.led = r;
    },
    setCheckedContact: (e, t) => {
      const r = e.contact.map((n) => {
        if (n.name === t.payload.name) {
          return {
            ...n,
            checked: t.payload.checked,
          };
        }
        return {
          ...n,
        };
      });
      e.contact = r;
    },
    updateLedOrder(e, t) {
      const r = t.payload?.map((n, i) => ({
        ...n,
        orders: i,
      }));
      e.led = r;
    },
    updateContactOrder(e, t) {
      const r = t.payload?.map((n, i) => ({
        ...n,
        orders: i,
      }));
      e.contact = r;
    },
    setDataByKey: (e, t) => {
      e.dataByKey = t.payload;
    },
    addSection: (e, t) => {
      if (
        e.fieldSection.some(
          (a) => !a.isDeleted && a.name.trim().toLowerCase() === t.payload.name.trim().toLowerCase()
        )
      ) {
        return;
      }
      const n = e.fieldSection.filter((a) => !a.isDeleted).length === 0;
      const i = {
        uuid: crypto.randomUUID(),
        id: undefined,
        name: t.payload.name,
        orders: t.payload.orders,
        fieldIds: n ? e.led.map((a) => a.id).filter((a) => a != null) : [],
        isNew: true,
        isDeleted: false,
        isRenamed: false,
      };
      e.fieldSection = [i, ...e.fieldSection];
      e.isChangeFields = true;
    },
    deleteSection: (e, t) => {
      const r = e.fieldSection.find((i) => i.uuid === t.payload.uuid);
      if (!r) {
        return;
      }
      r.isDeleted = true;
      const n = e.fieldSection.find((i) => !i.isDeleted && i.uuid !== t.payload.uuid);
      if (n && r.fieldIds?.length) {
        n.fieldIds = [...(n.fieldIds ?? []), ...(r.fieldIds ?? [])];
      }
      e.isChangeFields = true;
    },
    renameSection: (e, t) => {
      if (
        e.fieldSection.some(
          (i) =>
            !i.isDeleted &&
            i.uuid !== t.payload.uuid &&
            i.name.trim().toLowerCase() === t.payload.name.trim().toLowerCase()
        )
      ) {
        return;
      }
      const n = e.fieldSection.find((i) => i.uuid === t.payload.uuid);
      if (n) {
        n.name = t.payload.name;
        if (!n.isNew) {
          n.isRenamed = true;
        }
        e.isChangeFields = true;
      }
    },
    reorderSections: (e, t) => {
      const r = e.fieldSection.filter((o) => !o.isDeleted);
      const [n] = r.splice(t.payload.sourceIndex, 1);
      r.splice(t.payload.destinationIndex, 0, n);
      const i = r.map((o, s) => ({
        ...o,
        orders: s,
      }));
      const a = e.fieldSection.filter((o) => o.isDeleted);
      e.fieldSection = [...i, ...a];
      e.isChangeFields = true;
    },
    reorderFieldsInSection: (e, t) => {
      const r = e.fieldSection.find((n) => n.uuid === t.payload.uuid);
      if (r) {
        r.fieldIds = t.payload.fieldIds;
        e.isChangeFields = true;
      }
    },
    moveFieldBetweenSections: (e, t) => {
      const { fieldId, sourceUuid, destinationUuid, destinationIndex } = t.payload;
      if (String(sourceUuid) === String(destinationUuid)) {
        return;
      }
      if (sourceUuid !== undefined) {
        const s = e.fieldSection.find((l) => String(l.uuid) === String(sourceUuid));
        if (s) {
          s.fieldIds = s.fieldIds.filter((l) => String(l) !== String(fieldId));
        }
      }
      const o = e.fieldSection.find((s) => String(s.uuid) === String(destinationUuid));
      if (o) {
        const s = [...o.fieldIds];
        if (!s.some((l) => String(l) === String(fieldId))) {
          s.splice(destinationIndex, 0, fieldId);
          o.fieldIds = s;
        }
      }
      e.isChangeFields = true;
    },
    updateSectionId: (e, t) => {
      const r = e.fieldSection.find((n) => n.uuid === t.payload.uuid);
      if (r) {
        r.id = t.payload.realId;
        r.isNew = false;
      }
    },
    setSectionsFromServer: (e, t) => {
      e.fieldSection = t.payload;
      e.initialFieldSection = t.payload;
    },
    revertChanges: (e) => {
      e.fieldSection = e.initialFieldSection;
      e.led = e.led;
      e.contact = e.contact;
      e.isChangeFields = false;
      e.isChangeNotTaskConf = false;
    },
    revertChangeStates: (e) => {
      e.isChangeFields = false;
      e.isChangeNotTaskConf = false;
    },
    setEditingSectionUuid: (e, t) => {
      e.editingSectionUuid = t.payload;
    },
  },
});
const {
  setCrmFields,
  setContactFieldsDelete,
  setContactFieldsEdit,
  setLedFields,
  setContactFields,
  setLedFieldsAdd,
  setContactFieldsAdd,
  setLedFieldsEdit,
  setLedFieldsDelete,
  setAutoRemindNotTask,
  setNotChangeStepStatus,
  setNotTaskPipes,
  setAutoRemindTime,
  setCheckedLead,
  setCheckedContact,
  updateLedOrder,
  updateContactOrder,
  setDataByKey,
  addSection,
  reorderSections,
  moveFieldBetweenSections,
  reorderFieldsInSection,
  renameSection,
  deleteSection,
  setSectionsFromServer,
  revertChanges,
  setEditingSectionUuid,
  updateSectionId,
  revertChangeStates,
} = p1.actions;
export { p1 };
