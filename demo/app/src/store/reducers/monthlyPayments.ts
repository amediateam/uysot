// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice, current } from "@reduxjs/toolkit";
import { W } from "@/utils/round";
import { ha } from "@/utils/payment-schedule";
import { Ti } from "@/components/toaster/state";
import be from "dayjs";
import { me } from "@/constants/index";
import { vt } from "@/utils/helpers";
const initialState = {
  amount: 0,
  clientName: "",
  contractNumber: "",
  contractId: 0,
  firstPaymentDate: be(new Date()).add(1, "month").format(me),
  delayInterval: 1,
  delay: 6,
  sumTablePayments: 0,
  residueTablePayments: 0,
  total: 0,
};
const T1 = createSlice({
  name: "monthlyPayments",
  initialState,
  reducers: {
    setFirstData: (e, t) => {
      const r = [];
      let residue = t.payload.residue;
      for (let i = 0; i < t.payload.monthlyPaymentParts.length; i++) {
        r.push({
          ...t.payload.monthlyPaymentParts[i],
          amountString: t.payload.monthlyPaymentParts[i].amount.toLocaleString("ru"),
          sum: residue,
        });
        residue = W(residue - t.payload.monthlyPaymentParts[i].amount);
      }
      e.contractId = t.payload.id;
      e.clientName = t.payload.clientName;
      e.contractNumber = t.payload.number;
      e.delay = t.payload.delay;
      e.amount = t.payload.residue;
      e.delayInterval = t.payload.interval;
      e.firstPaymentDate = t.payload.date;
      e.monthlyPaymentPartDtos = r;
      e.sumTablePayments = t.payload.residue;
      e.residueTablePayments = 0;
      e.currency = t.payload.currency;
      e.remainingAmount = t.payload?.remainingAmount;
      e.remainingDate = t.payload?.remainingDate;
      e.total = t?.payload.residue + (t?.payload?.remainingAmount || 0);
    },
    setDelay: (e, t) => {
      e.delay = t.payload;
      e.delayInterval = 1;
      e.monthlyPaymentPartDtos = ha(e.amount, e.firstPaymentDate, t.payload || 0, 1);
      e.sumTablePayments = e.amount;
      e.residueTablePayments = 0;
    },
    setDelayInterval: (e, t) => {
      if (!t.payload) {
        e.delayInterval = null;
        return;
      }
      if ((e.delay || 0) % t.payload === 0) {
        e.delayInterval = t.payload;
        e.monthlyPaymentPartDtos = ha(e.amount, e.firstPaymentDate, e.delay || 0, t.payload);
        e.sumTablePayments = e.amount;
        e.residueTablePayments = 0;
        return;
      }
      const r = t.payload - ((e.delay || 0) % t.payload);
      Ti.warning(
        `Interval kiritishda xatolikni oldini olish maqsadida vaqt oralig'i ${e.delay} dan ${
          (e.delay || 0) + r
        } ga o'zgartirildi!`
      );
      e.delay = (e.delay || 0) + r;
      e.delayInterval = t.payload;
      e.monthlyPaymentPartDtos = ha(e.amount, e.firstPaymentDate, e.delay, t.payload);
      e.sumTablePayments = e.amount;
      e.residueTablePayments = 0;
    },
    setFirstPaymentDate: (e, t) => {
      const r = e.monthlyPaymentPartDtos?.slice();
      const n = e?.delayInterval;
      let i = 0;
      if (Array.isArray(r)) {
        for (let a = 0; a < r.length; a++) {
          r[a].date = be(t.payload, me).add(i, "month").format(me);
          i += n || 0;
        }
      }
      e.monthlyPaymentPartDtos = r;
      e.firstPaymentDate = t.payload;
    },
    changeOnePaymentDate: (e, t) => {
      const r = e.monthlyPaymentPartDtos?.slice() || [];
      if (Array.isArray(r)) {
        r[t.payload.index].date = t.payload.date;
      }
      e.firstPaymentDate = r[0].date || "";
      e.monthlyPaymentPartDtos = r;
    },
    changeOnePaymentAmount: (e, t) => {
      const { monthlyPaymentPartDtos, amount } = current(e);
      let i = 0;
      let a = amount;
      const o = [];
      if (Array.isArray(monthlyPaymentPartDtos)) {
        for (let s = 0; s < monthlyPaymentPartDtos.length; s++) {
          if (s === t.payload.index) {
            o.push({
              ...monthlyPaymentPartDtos[s],
              amount: vt.parseFloatStringToNumber(t.payload.amount),
              amountString: t.payload.amount,
              sum: a,
            });
            a = W(a - vt.parseFloatStringToNumber(t.payload.amount));
            i = W(i + vt.parseFloatStringToNumber(t.payload.amount));
          } else {
            o.push({
              ...monthlyPaymentPartDtos[s],
              sum: a,
            });
            a = W(a - o[s].amount);
            i = W(i + o[s].amount);
          }
        }
      }
      e.monthlyPaymentPartDtos = o;
      e.sumTablePayments = i;
      e.residueTablePayments = a;
    },
    clearMonthlyPaymentsTable: (e) => {
      const { amount } = current(e);
      e.monthlyPaymentPartDtos = undefined;
      e.residueTablePayments = amount;
      e.sumTablePayments = 0;
    },
    addItemsTable: (e, t) => {
      const { monthlyPaymentPartDtos, amount, delayInterval, delay } = current(e);
      const o = monthlyPaymentPartDtos ? monthlyPaymentPartDtos.slice() : [];
      let s = 0;
      for (let u = 0; u < t.payload.number; u++) {
        o.push({
          amount: t.payload.amount,
          date: be(t.payload.date, me).add(s, "month").format(me),
          amountString: t.payload.amount.toLocaleString("ru"),
        });
        s += 1;
      }
      let l = 0;
      let c = amount;
      for (let u = 0; u < o.length; u++) {
        o[u] = {
          ...o[u],
          sum: c,
        };
        c = W(c - o[u].amount);
        l = W(l + o[u].amount);
      }
      if (c > 0 && (delay || 1) / (delayInterval || 1) === o.length) {
        o[o.length - 1].amount = W(o[o.length - 1].amount + c);
        o[o.length - 1].amountString = W(o[o.length - 1].amount + c).toLocaleString("ru");
        l = W(l + c);
        c = 0;
      }
      e.firstPaymentDate = o[0].date;
      e.residueTablePayments = c;
      e.sumTablePayments = l;
      e.monthlyPaymentPartDtos = o;
    },
    deleteItemTable: (e, t) => {
      const { monthlyPaymentPartDtos, amount } = current(e);
      const i = [];
      let a = 0;
      let o = amount;
      if (Array.isArray(monthlyPaymentPartDtos)) {
        for (let s = 0; s < monthlyPaymentPartDtos.length; s++) {
          if (s !== t.payload) {
            i.push({
              ...monthlyPaymentPartDtos[s],
              sum: o,
            });
            o = W(o - monthlyPaymentPartDtos[s].amount);
            a = W(a + monthlyPaymentPartDtos[s].amount);
          }
        }
      }
      e.firstPaymentDate = i.length > 0 ? i[0].date : "";
      e.residueTablePayments = o;
      e.sumTablePayments = a;
      e.monthlyPaymentPartDtos = i;
    },
    clear: (e) => {
      e.delayInterval = 1;
      e.delay = 6;
      e.amount = 0;
      e.firstPaymentDate = be(new Date()).add(1, "month").format(me);
      e.monthlyPaymentPartDtos = undefined;
      e.contractId = 0;
      e.sumTablePayments = 0;
      e.residueTablePayments = 0;
      e.currency = undefined;
      e.remainingAmount = undefined;
      e.remainingDate = undefined;
      e.total = 0;
    },
    changeRemainingAmount: (e, t) => {
      e.remainingAmount = t.payload;
      const r = e.total - t.payload;
      let n = 0;
      const i = [...(e.monthlyPaymentPartDtos || [])];
      for (let a = 0; a < i.length; a++) {
        let amount = Math.floor(r / i.length);
        n = W(n + amount);
        if (a === i.length - 1) {
          amount += r - n;
          n += r - n;
        }
        i[a] = {
          ...i[a],
          amount,
          amountString: amount?.toLocaleString("ru"),
        };
      }
      if (e.sumTablePayments) {
        e.sumTablePayments = r - e.residueTablePayments;
        e.monthlyPaymentPartDtos = i;
      } else {
        e.residueTablePayments = r;
      }
      e.amount = r;
    },
    changeRemainingDate: (e, t) => {
      e.remainingDate = t.payload;
    },
  },
});
const {
  setFirstData,
  setDelay: bee,
  setDelayInterval: See,
  setFirstPaymentDate: Eee,
  changeOnePaymentDate: Cee,
  changeOnePaymentAmount: xee,
  clearMonthlyPaymentsTable: wee,
  addItemsTable: Pee,
  deleteItemTable: Iee,
  clear: Aee,
  changeRemainingAmount: Tee,
  changeRemainingDate: Ree,
} = T1.actions;
export { T1 };
