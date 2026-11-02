// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (10)
import { createSlice, current } from "@reduxjs/toolkit";
import { vt } from "@/utils/helpers";
const Ol = {
  TEXT: "TEXT",
  DATE: "DATE",
  SELECT: "SELECT",
  MULTI_SELECT: "MULTI_SELECT",
  URL: "URL",
  TOGGLE_SWITCH: "TOGGLE_SWITCH",
  RADIO: "RADIO",
  LOCATION: "LOCATION",
  COUNTER: "COUNTER",
  ADDRESS: "ADDRESS",
  LEAD_BALANCE: "LEAD_BALANCE",
  LEAD_RESPONSIBLE: "LEAD_RESPONSIBLE",
  LEAD_PIPE_STATUS: "LEAD_PIPE_STATUS",
  LEAD_NAME: "LEAD_NAME",
  EXTENDED_TEXT: "EXTENDED_TEXT",
  EMPLOYEE: "EMPLOYEE",
  FILE: "FILE",
  LEAD_CHANNEL: "LEAD_CHANNEL",
  LEAD_SOURCE: "LEAD_SOURCE",
  NUMBER: "NUMBER",
};
const lt = {
  TAG: "TAG",
  EMPLOYEE: "EMPLOYEE",
  BUDGET: "BUDGET",
  FIELD: "FIELD",
  SOURCE: "SOURCE",
  REASONS_FR: "REASONS_FR",
};
const uv = {
  WHEN_CREATE_THIS_STAGE: "WHEN_CREATE_THIS_STAGE",
  WHEN_MOVED_THIS_STAGE: "WHEN_MOVED_THIS_STAGE",
  WHEN_CREATE_OR_MOVED_THIS_STAGE: "WHEN_CREATE_OR_MOVED_THIS_STAGE",
  WHEN_RESPONSIBLE_USER_CHANGE: "WHEN_RESPONSIBLE_USER_CHANGE",
};
const oc = {
  NOW: "NOW",
  AFTER_10_MINUTES: "AFTER_10_MINUTES",
  AFTER_5_MINUTES: "AFTER_5_MINUTES",
  AFTER_DAY: "AFTER_DAY",
};
const H1 = {
  OR: "OR",
  AND: "AND",
};
const z1 = {
  MATCHES: "MATCHES",
  NOT_MATCHES: "NOT_MATCHES",
  CONTAINS: "CONTAINS",
  NOT_CONTAINS: "NOT_CONTAINS",
  EMPTY: "EMPTY",
  NOT_EMPTY: "NOT_EMPTY",
};
const dv = {
  PIPE_STATUS_TRIGGER: "PIPE_STATUS_TRIGGER",
  TASK_TRIGGER: "TASK_TRIGGER",
  MANAGER_TRIGGER: "MANAGER_TRIGGER",
  FIELD_SETTER_TRIGGER: "FIELD_SETTER_TRIGGER",
  META_CONVERSION_TRIGGER: "META_CONVERSION_TRIGGER",
  ONLINE_PBX_CALLBACK_TRIGGER: "ONLINE_PBX_CALLBACK_TRIGGER",
  SMS_TRIGGER: "SMS_TRIGGER",
  WEBHOOK_TRIGGER: "WEBHOOK_TRIGGER",
  COPY_LEAD_TRIGGER: "COPY_LEAD_TRIGGER",
  TASK_RESULT_TRIGGER: "TASK_RESULT_TRIGGER",
};
const initialState = {
  visible: false,
  assignById: null,
  useAll: false,
  note: "",
  pipeStatusId: -1,
  orderTriggerCondition: [],
  order: -1,
  deadLineAfter: 0,
  execStatus: uv.WHEN_CREATE_THIS_STAGE,
  execAfterStatus: oc.NOW,
  errorList: [],
  typeTrigger: dv.TASK_TRIGGER,
  toPipeStatusId: -1,
  changeEmployees: [],
  assignOnWorkdays: false,
};
const W1 = createSlice({
  name: "trigger",
  initialState,
  reducers: {
    setVisible: (e, t) => {
      e.visible = t.payload.visible;
      e.id = t.payload.id;
      e.pipeStatusId = t.payload.pipeStatusId;
      e.typeTrigger = t.payload.typeTrigger;
      if (t.payload.order) {
        e.order = t.payload.order;
      }
    },
    setTrigger: (e, t) => {
      let r = [];
      const { tag } = t.payload;
      if (tag) {
        r.push({
          order: tag.order,
          type: lt.TAG,
        });
      }
      const { balance } = t.payload;
      if (balance) {
        const c = [];
        let u = false;
        if (r.length === 0) {
          c.push({
            order: balance.order,
            type: lt.BUDGET,
          });
        } else {
          r.forEach((d, f) => {
            if (
              (d.order < balance.order && f === r.length - 1) ||
              (d.order === balance.order && !u)
            ) {
              c.push(d);
              c.push({
                order: balance.order,
                type: lt.BUDGET,
              });
              u = true;
            } else if (d.order < balance.order || u) {
              c.push(d);
            } else if (d.order > balance.order) {
              c.push({
                order: balance.order,
                type: lt.BUDGET,
              });
              u = true;
              c.push(d);
            }
          });
        }
        r = c;
      }
      const { employee } = t.payload;
      if (employee) {
        const c = [];
        let u = false;
        if (r.length === 0) {
          c.push({
            order: employee.order,
            type: lt.EMPLOYEE,
          });
        } else {
          r.forEach((d, f) => {
            if (
              (d.order < employee.order && f === r.length - 1) ||
              (d.order === employee.order && !u)
            ) {
              c.push(d);
              c.push({
                order: employee.order,
                type: lt.EMPLOYEE,
              });
              u = true;
            } else if (d.order < employee.order || u) {
              c.push(d);
            } else if (d.order > employee.order) {
              c.push({
                order: employee.order,
                type: lt.EMPLOYEE,
              });
              u = true;
              c.push(d);
            }
          });
        }
        r = c;
      }
      const { fields } = t.payload;
      if (fields && fields.length > 0) {
        fields.forEach((c, u) => {
          let d = false;
          const f = [];
          if (r.length === 0 && u === 0) {
            f.push({
              order: c.order,
              type: lt.FIELD,
              fieldId: c.fieldId,
            });
          } else {
            r.forEach((h, g) => {
              if ((h.order < c.order && g === r.length - 1) || (h.order === c.order && !d)) {
                f.push(h);
                f.push({
                  order: c.order,
                  type: lt.FIELD,
                  fieldId: c.fieldId,
                });
                d = true;
              } else if (h.order < c.order || d) {
                f.push(h);
              } else if (h.order > c.order) {
                f.push({
                  order: c.order,
                  type: lt.FIELD,
                  fieldId: c.fieldId,
                });
                d = true;
                f.push(h);
              }
            });
          }
          r = f;
        });
      }
      const { source } = t.payload;
      if (source) {
        const c = {
          order: source.order,
          type: lt.SOURCE,
        };
        const u = r.findIndex((d) => d.order > source.order);
        if (u === -1) {
          r.push(c);
        } else {
          r.splice(u, 0, c);
        }
      }
      const { reasonsFR } = t.payload;
      if (reasonsFR) {
        const c = {
          order: reasonsFR.order,
          type: lt.REASONS_FR,
        };
        const u = r.findIndex((d) => d.order > reasonsFR.order);
        if (u === -1) {
          r.push(c);
        } else {
          r.splice(u, 0, c);
        }
      }
      e.id = t.payload.id;
      e.pipeStatusId = t.payload.pipeStatusId;
      e.order = t.payload.order;
      e.fields = fields;
      e.orderTriggerCondition = r;
      e.deadLineAfterStatus = t.payload.deadLineAfterStatus;
      e.deadLineAfter = t.payload.deadLineAfter;
      e.execStatus = t.payload.execStatus;
      e.execAfter = t.payload.execAfter;
      e.execAfterStatus = t.payload.execAfterStatus;
      e.note = t.payload.text || "";
      e.useAll = false;
      e.assignOnWorkdays = !!t.payload.assignOnWorkdays;
      e.employee = employee;
      e.assignById = t.payload.assignById;
      e.taskTypeId = t.payload.taskTypeId;
      e.toPipeStatusId = t.payload.toPipeStatusId || -1;
      e.changeEmployees = t.payload.employees || [];
      e.balance = {
        order: balance?.order || 0,
        low: balance?.low || 0,
        high: balance?.high || 0,
        lowString: balance?.low?.toLocaleString("ru") || "",
        highString: balance?.high?.toLocaleString("ru") || "",
      };
      e.tag = tag;
      e.source = source
        ? {
            order: source.order,
            sources: source.sources || [],
            channelIds: source.channelIds || [],
          }
        : undefined;
      e.reasonsFR = reasonsFR
        ? {
            order: reasonsFR.order,
            reasonsFRIds: reasonsFR.reasonsFRIds || [],
          }
        : undefined;
    },
    setTagCondition: (e, t) => {
      const r = [...e.orderTriggerCondition];
      if (t.payload.add) {
        let n = 0;
        if (r.length > 0) {
          n = r[r.length - 1]?.order;
        }
        r.push({
          order: n + 1,
          type: lt.TAG,
        });
        e.tag = {
          logic: H1.AND,
          tags: [],
          order: n + 1,
        };
        e.orderTriggerCondition = r;
      } else {
        const n = [];
        let i = 1;
        r.forEach((a) => {
          if (a.type !== lt.TAG) {
            n.push({
              ...a,
              order: i,
            });
            i++;
          }
        });
        e.orderTriggerCondition = n;
        e.tag = undefined;
      }
    },
    setTypeTag: (e, t) => {
      const { tag } = e;
      if (tag) {
        e.tag = {
          tags: tag.tags,
          order: tag.order,
          logic: t.payload,
        };
      }
    },
    setTag: (e, t) => {
      const { tag } = e;
      if (tag) {
        if (tag.tags.length > 0) {
          tag.tags.push({
            tagId: t.payload,
          });
        } else {
          tag.tags = [
            {
              tagId: t.payload,
            },
          ];
        }
      }
      e.tag = tag;
    },
    removeTag: (e, t) => {
      const { tag } = e;
      if (tag) {
        tag.tags = tag.tags.filter((n) => n.tagId !== t.payload);
      }
      e.tag = tag;
    },
    setSourceCondition: (e, t) => {
      const r = [...e.orderTriggerCondition];
      if (t.payload.add) {
        let n = 0;
        if (r.length > 0) {
          n = r[r.length - 1]?.order;
        }
        r.push({
          order: n + 1,
          type: lt.SOURCE,
        });
        e.source = {
          order: n + 1,
          sources: [],
          channelIds: [],
        };
        e.orderTriggerCondition = r;
      } else {
        const n = [];
        let i = 1;
        r.forEach((a) => {
          if (a.type !== lt.SOURCE) {
            n.push({
              ...a,
              order: i,
            });
            i++;
          }
        });
        e.orderTriggerCondition = n;
        e.source = undefined;
      }
    },
    setSources: ({ source }, t) => {
      if (source) {
        const n = source.sources.some((i) => !t.payload.includes(i));
        source.sources = t.payload;
        if (n) {
          source.channelIds = [];
        }
      }
    },
    setSourceChannels: ({ source }, t) => {
      if (source) {
        source.channelIds = t.payload;
      }
    },
    setReasonsFRCondition: (e, t) => {
      const r = [...e.orderTriggerCondition];
      if (t.payload.add) {
        const n = r[r.length - 1]?.order ?? 0;
        r.push({
          order: n + 1,
          type: lt.REASONS_FR,
        });
        e.reasonsFR = {
          order: n + 1,
          reasonsFRIds: [],
        };
        e.orderTriggerCondition = r;
      } else {
        e.orderTriggerCondition = r
          .filter((n) => n.type !== lt.REASONS_FR)
          .map((n, i) => ({
            ...n,
            order: i + 1,
          }));
        e.reasonsFR = undefined;
      }
    },
    setReasonsFRIds: (e, t) => {
      if (e.reasonsFR) {
        e.reasonsFR.reasonsFRIds = t.payload;
      }
    },
    setAssignById: (e, t) => {
      e.assignById = t.payload;
    },
    setUseAll: (e, t) => {
      e.useAll = t.payload;
    },
    setAssignOnWorkdays: (e, t) => {
      e.assignOnWorkdays = t.payload;
    },
    setNote: (e, t) => {
      e.note = t.payload;
    },
    setTaskType: (e, t) => {
      e.taskTypeId = t.payload;
    },
    setBudgetCondition: (e, t) => {
      const r = [...e.orderTriggerCondition];
      if (t.payload.add) {
        let n = 0;
        if (r.length > 0) {
          n = r[r.length - 1]?.order;
        }
        r.push({
          order: n + 1,
          type: lt.BUDGET,
        });
        e.balance = {
          low: null,
          highString: "",
          lowString: "",
          high: null,
          order: n + 1,
        };
        e.orderTriggerCondition = r;
      } else {
        const n = [];
        let i = 1;
        r.forEach((a) => {
          if (a.type !== lt.BUDGET) {
            n.push({
              ...a,
              order: i,
            });
            i++;
          }
        });
        e.balance = undefined;
        e.orderTriggerCondition = n;
      }
    },
    setBudgetLow: (e, t) => {
      const { balance } = e;
      if (balance) {
        balance.low = vt.parseFloatStringToNumber(t.payload);
        balance.lowString = t.payload;
      }
      e.balance = balance;
    },
    setBudgetHigh: (e, t) => {
      const { balance } = e;
      if (balance) {
        balance.high = vt.parseFloatStringToNumber(t.payload);
        balance.highString = t.payload;
      }
      e.balance = balance;
    },
    setEmployeeCondition: (e, t) => {
      const r = [...e.orderTriggerCondition];
      if (t.payload.add) {
        let n = 0;
        if (r.length > 0) {
          n = r[r.length - 1]?.order;
        }
        r.push({
          order: n + 1,
          type: lt.EMPLOYEE,
        });
        e.employee = {
          order: n + 1,
          employees: [],
          departmentIds: [],
        };
        e.orderTriggerCondition = r;
      } else {
        const n = [];
        let i = 1;
        r.forEach((a) => {
          if (a.type !== lt.EMPLOYEE) {
            n.push({
              ...a,
              order: i,
            });
            i++;
          }
        });
        e.orderTriggerCondition = n;
        e.employee = undefined;
      }
    },
    setEmployee: (e, t) => {
      const { employee } = e;
      if (employee) {
        if (employee.employees.length > 0) {
          employee.employees.push({
            employeeId: t.payload,
          });
        } else {
          employee.employees = [
            {
              employeeId: t.payload,
            },
          ];
        }
      }
      e.employee = employee;
    },
    setChangeEmployee: (e, t) => {
      const { changeEmployees } = e;
      changeEmployees.push(t.payload);
      e.changeEmployees = changeEmployees;
    },
    removeChangeEmployee: (e, t) => {
      let e_changeEmployees = e.changeEmployees;
      e_changeEmployees = e_changeEmployees.filter((n) => n !== t.payload);
      e.changeEmployees = e_changeEmployees || [];
    },
    removeEmployee: (e, t) => {
      const { employee } = e;
      if (employee) {
        employee.employees = employee.employees.filter((n) => n.employeeId !== t.payload);
      }
      e.employee = employee;
    },
    setEmployeeIds: (e, t) => {
      if (e.employee) {
        e.employee.employees = t.payload.map((employeeId) => ({
          employeeId,
        }));
      }
    },
    setEmployeeDepartmentIds: (e, t) => {
      if (e.employee) {
        e.employee.departmentIds = t.payload;
      }
    },
    setFieldCondition: (e, t) => {
      const { orderTriggerCondition } = e;
      if (t.payload.add) {
        let n = 0;
        const i = e.fields || [];
        if (orderTriggerCondition.length > 0) {
          n = orderTriggerCondition[orderTriggerCondition.length - 1]?.order;
        }
        orderTriggerCondition.push({
          order: n + 1,
          type: lt.FIELD,
          fieldId: t.payload.fieldId,
        });
        i.push({
          order: n + 1,
          fieldId: t.payload.fieldId,
          logic:
            t.payload.type === Ol.TEXT || t.payload.type === Ol.COUNTER ? z1.MATCHES : undefined,
          values:
            t.payload.type === Ol.NUMBER
              ? [
                  {
                    order: 1,
                    value: "",
                    low: undefined,
                    high: undefined,
                    currencyId: undefined,
                  },
                ]
              : [],
        });
        e.orderTriggerCondition = orderTriggerCondition;
        e.fields = i;
      } else {
        const n = e.fields || [];
        const i = [];
        let a = 1;
        orderTriggerCondition.forEach((o) => {
          const s = current(o);
          if (s.type !== lt.FIELD || s.fieldId !== t.payload.fieldId) {
            i.push({
              ...s,
              order: a,
            });
            a++;
          }
        });
        e.orderTriggerCondition = i;
        e.fields = n.filter((o) => o.fieldId !== t.payload.fieldId);
      }
    },
    setFieldValueInput: (e, t) => {
      const { fields } = e;
      const n = [];
      fields?.forEach((i) => {
        if (i.fieldId === t.payload.id) {
          if (t.payload.value) {
            n.push({
              ...i,
              values: [
                {
                  value: t.payload.value,
                },
              ],
            });
          } else {
            n.push({
              ...i,
              values: [],
            });
          }
        } else {
          n.push(i);
        }
      });
      e.fields = n;
    },
    setFieldInputLogic: (e, t) => {
      const { fields } = e;
      const n = [];
      fields?.forEach((i) => {
        if (i.fieldId === t.payload.id) {
          n.push({
            ...i,
            logic: t.payload.logic,
          });
        } else {
          n.push(i);
        }
      });
      e.fields = n;
    },
    setFieldValueSelect: (e, t) => {
      const { fields } = e;
      const n = [];
      fields?.forEach((i) => {
        if (i.fieldId === t.payload.id) {
          const values = i.values || [];
          values.push({
            value: t.payload.value,
          });
          n.push({
            ...i,
            values,
          });
        } else {
          n.push(i);
        }
      });
      e.fields = n;
    },
    removeFieldValueSelect: (e, t) => {
      const { fields } = e;
      const n = [];
      fields?.forEach((i) => {
        if (i.fieldId === t.payload.id) {
          const a = i.values.filter((o) => o.value !== t.payload.value);
          n.push({
            ...i,
            values: a || [],
          });
        } else {
          n.push(i);
        }
      });
      e.fields = n;
    },
    setDeadLineAfterStatus: (e, t) => {
      e.deadLineAfterStatus = t.payload;
      e.deadLineAfter = undefined;
    },
    setDeadLineAfter: (e, t) => {
      e.deadLineAfterStatus = undefined;
      e.deadLineAfter = t.payload;
    },
    setExecStatus: (e, t) => {
      e.execStatus = t.payload;
      e.execAfterStatus = oc.NOW;
      e.execAfter = undefined;
    },
    setExecAfterStatus: (e, t) => {
      e.execAfterStatus = t.payload;
      e.execAfter = undefined;
    },
    setExecAfter: (e, t) => {
      e.execAfter = t.payload;
    },
    setPipeStatusId: (e, t) => {
      e.toPipeStatusId = t.payload;
    },
    setErrorList: (e, t) => {
      e.errorList = t.payload;
    },
    clearAll: (e) => {
      e.visible = false;
      e.order = -1;
      e.id = undefined;
      e.pipeStatusId = -1;
      e.assignById = null;
      e.useAll = false;
      e.note = "";
      e.taskTypeId = undefined;
      e.orderTriggerCondition = [];
      e.execAfter = undefined;
      e.execAfterStatus = oc.NOW;
      e.execStatus = uv.WHEN_CREATE_THIS_STAGE;
      e.employee = undefined;
      e.tag = undefined;
      e.balance = undefined;
      e.source = undefined;
      e.reasonsFR = undefined;
      e.fields = undefined;
      e.deadLineAfter = 0;
      e.deadLineAfterStatus = undefined;
      e.errorList = [];
      e.typeTrigger = dv.PIPE_STATUS_TRIGGER;
      e.toPipeStatusId = -1;
      e.changeEmployees = [];
    },
    setFieldNumberRange: (e, t) => {
      const { fields } = e;
      const n = [];
      fields?.forEach((i) => {
        if (i.fieldId === t.payload.id) {
          const a = i.values?.[0];
          const lowString = t.payload.lowString ?? a?.lowString ?? "";
          const highString = t.payload.highString ?? a?.highString ?? "";
          n.push({
            ...i,
            values: [
              {
                order: a?.order ?? 1,
                value: "",
                low: lowString === "" ? undefined : lowString,
                high: highString === "" ? undefined : highString,
                lowString,
                highString,
                currencyId: t.payload.currencyId ?? a?.currencyId,
              },
            ],
          });
        } else {
          n.push(i);
        }
      });
      e.fields = n;
    },
    setFieldFileLogic: (e, t) => {
      const { fields } = e;
      const n = [];
      fields?.forEach((i) => {
        if (i.fieldId === t.payload.id) {
          n.push({
            ...i,
            logic: t.payload.logic,
          });
        } else {
          n.push(i);
        }
      });
      e.fields = n;
    },
  },
});
const {
  setVisible: Sre,
  setTypeTag: Ere,
  setTag: Cre,
  removeTag: xre,
  setAssignById: wre,
  setUseAll: Pre,
  setNote: Ire,
  setTaskType: Are,
  setTagCondition: Tre,
  setBudgetCondition: Rre,
  setSourceCondition: Ore,
  setSources: Nre,
  setSourceChannels: kre,
  setBudgetLow: Mre,
  setBudgetHigh: Dre,
  setEmployeeCondition: Lre,
  setEmployee: Fre,
  removeEmployee,
  setEmployeeIds: jre,
  setEmployeeDepartmentIds: Bre,
  setFieldCondition: Vre,
  setFieldInputLogic: Ure,
  setFieldValueInput: Hre,
  removeFieldValueSelect: zre,
  setFieldValueSelect: Wre,
  setDeadLineAfterStatus: qre,
  setDeadLineAfter: Gre,
  setExecAfter: Yre,
  setExecAfterStatus: Kre,
  setExecStatus: Xre,
  setTrigger: Jre,
  clearAll: Qre,
  setErrorList: Zre,
  setPipeStatusId: ene,
  setReasonsFRCondition: tne,
  setReasonsFRIds: rne,
  setChangeEmployee: nne,
  removeChangeEmployee: ine,
  setAssignOnWorkdays: ane,
  setFieldNumberRange: one,
  setFieldFileLogic: sne,
} = W1.actions;
export { W1 };
