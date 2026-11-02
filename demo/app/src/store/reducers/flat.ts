// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (6)
import { createSlice, current } from "@reduxjs/toolkit";
import { Tt } from "@/utils/current-user";
import { Ti } from "@/components/toaster/state";
import { W } from "@/utils/round";
import { vt } from "@/utils/helpers";
import be from "dayjs";
import { me } from "@/constants/index";
import { Oe } from "@/utils/contract-calc";
import { ha } from "@/utils/payment-schedule";
const s0 = (e, prepayment) => {
  for (let r = 0; r < e.length; r++) {
    if (
      (prepayment >= e[r].firstPayment && r === e.length - 1) ||
      (prepayment >= e[r].firstPayment && prepayment < e[r + 1].firstPayment)
    ) {
      return e[r].discountAmount;
    }
  }
  return null;
};
const Ys = (e) => {
  const t = {
    ...e,
  };
  if (t.prepayment && t.isUsingDiscount) {
    if (t.selectedType === "repaired") {
      const r = s0(t.discountRepaired, t.prepayment);
      t.discount = r;
      if (r && r !== 0) {
        t.discount = r;
        t.discountDescription = "Chegirma mavjudligi tufayli";
      } else {
        t.discount = null;
        t.discountDescription = "";
      }
    } else {
      const r = s0(t.discountNotRepaired, t.prepayment);
      if (r && r !== 0) {
        t.discount = r;
        t.discountDescription = "Chegirma mavjudligi tufayli";
      } else {
        t.discount = null;
        t.discountDescription = "";
      }
    }
  }
  return t;
};
const gi = {
  REPAIRED: "REPAIRED",
  NOT_REPAIRED: "NOT_REPAIRED",
  BOTH: "BOTH",
};
const initialState = {
  prepaymentString: "",
  discountString: "",
  flat: null,
  prepayment: null,
  discount: null,
  prepaymentDate: be(new Date()).format(me),
  firstPaymentDate: be(new Date()).add(1, "month").format(me),
  delayInterval: 1,
  delay: 6,
  selectedType: "unrepaired",
  repaired: gi.BOTH,
  flatId: null,
  priceRepaired: null,
  priceNotRepaired: null,
  prePaymentPercent: null,
  isUsingDiscount: false,
  haveDiscount: false,
  discountNotRepaired: [],
  discountRepaired: [],
  number: "",
  sumTablePayments: 0,
  residueTablePayments: 0,
  brokerId: Number(Tt?.id),
  changeNumber: false,
  fields: [],
};
const S1 = createSlice({
  name: "flat",
  initialState,
  reducers: {
    setFlat: (e, t) => {
      const { flat, alwaysClear } = t.payload;
      if (e.flatId !== flat.id || alwaysClear) {
        let i = gi.BOTH;
        if (!flat.pricePerArea) {
          i = gi.REPAIRED;
          e.selectedType = "repaired";
        }
        if (!flat.pricePerAreaRepaired) {
          i = gi.NOT_REPAIRED;
          e.selectedType = "unrepaired";
        }
        if (flat.repaired) {
          i = gi.REPAIRED;
          e.selectedType = "repaired";
        }
        e.flat = flat;
        e.repaired = i;
        e.delay = flat.delay || 6;
        e.delayInterval = 1;
        e.prepayment = flat.prepayment || null;
        e.prepaymentString = flat.prepayment.toLocaleString("ru");
        e.prePaymentPercent = flat.prepaymentPercent;
        e.priceRepaired = flat.priceRepaired;
        e.priceNotRepaired = flat.priceNotRepaired;
        e.flatId = flat.id;
        e.isUsingDiscount = false;
        e.number = "";
        e.brokerId = Number(Tt?.id);
        e.changeNumber = false;
        e.discount = null;
        e.discountString = "";
        e.discountDescription = "";
        e.fields = [];
      }
    },
    setDelay: (e, t) => {
      e.delayInterval = 1;
      e.delay = t.payload;
    },
    setDelayInterval: (e, t) => {
      if (!t.payload) {
        e.delayInterval = null;
        return;
      }
      if ((e.delay || 0) % t.payload === 0) {
        e.delayInterval = t.payload;
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
    },
    setSelectedType: (e, t) => {
      e.selectedType = t.payload;
      if (t.payload === "repaired") {
        const r = W(((e.priceRepaired || 0) * (e.prePaymentPercent || 0)) / 100);
        e.prepayment = r;
        e.prepaymentString = r.toLocaleString("ru");
      } else {
        const r = W(((e.priceNotRepaired || 0) * (e.prePaymentPercent || 0)) / 100);
        e.prepayment = r;
        e.prepaymentString = r.toLocaleString("ru");
      }
      if (current(e).isUsingDiscount) {
        const { discount, discountDescription } = Ys(current(e));
        e.discount = discount;
        e.discountString = Number(discount).toLocaleString("ru");
        e.discountDescription = discountDescription;
      }
    },
    setDiscount: (e, t) => {
      e.discount = vt.parseFloatStringToNumber(t.payload || "") || null;
      e.discountString = t.payload;
      if (
        W(
          (e.selectedType === "repaired"
            ? e?.flat?.priceRepaired || 0
            : e?.flat?.priceNotRepaired || 0) -
            (e?.discount || 0) -
            (e?.prepayment || 0)
        ) === 0
      ) {
        e.delay = 0;
        e.delayInterval = 1;
      }
    },
    setDiscountDescription: (e, t) => {
      e.discountDescription = t.payload;
    },
    setPrepayment: (e, t) => {
      e.prepayment = vt.parseFloatStringToNumber(t.payload || "") || null;
      e.prepaymentString = t.payload;
      if (current(e).isUsingDiscount) {
        const { discount, discountDescription } = Ys(current(e));
        e.discount = discount;
        e.discountDescription = discountDescription;
      }
      if (
        W(
          e.selectedType === "repaired"
            ? e?.flat?.priceRepaired || 0
            : e?.flat?.priceNotRepaired || 0
        ) -
          (e?.discount || 0) ===
        vt.parseFloatStringToNumber(t.payload || "")
      ) {
        e.delay = 0;
        e.delayInterval = 1;
      }
    },
    setPrepaymentDate: (e, t) => {
      e.prepaymentDate = t.payload;
    },
    setFirstPaymentDate: (e, t) => {
      const r = e.monthlyPaymentPartDtos?.slice();
      const { delayInterval } = e;
      let i = 0;
      if (Array.isArray(r)) {
        for (let a = 0; a < r.length; a++) {
          r[a].date = be(t.payload, me).add(i, "month").format(me);
          i += delayInterval || 0;
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
      e.monthlyPaymentPartDtos = r;
      e.firstPaymentDate = r[0].date;
    },
    setMonthlyPaymentPartDtos: (e) => {
      const t = Oe(
        (e.selectedType === "repaired"
          ? e.flat?.priceRepaired || 0
          : e.flat?.priceNotRepaired || 0) -
          (e.discount || 0) -
          (e.prepayment || 0),
        2
      );
      e.monthlyPaymentPartDtos = ha(t, e.firstPaymentDate, e.delay || 0, e.delayInterval || 1);
      e.sumTablePayments = t;
      e.residueTablePayments = 0;
    },
    changeOnePaymentAmount: (e, t) => {
      const { monthlyPaymentPartDtos, selectedType, flat, discount, prepayment } = current(e);
      let s = 0;
      let l = W(
        (selectedType === "repaired" ? flat?.priceRepaired || 0 : flat?.priceNotRepaired || 0) -
          (discount || 0) -
          (prepayment || 0)
      );
      const c = [];
      if (Array.isArray(monthlyPaymentPartDtos)) {
        for (let u = 0; u < monthlyPaymentPartDtos.length; u++) {
          const amount = vt.parseFloatStringToNumber(t.payload.amount);
          if (u === t.payload.index) {
            c.push({
              ...monthlyPaymentPartDtos[u],
              amount,
              amountString: t.payload.amount,
              sum: l,
            });
            l = W(l - amount);
            s = W(s + amount);
          } else {
            c.push({
              ...monthlyPaymentPartDtos[u],
              sum: l,
            });
            l = W(l - c[u].amount);
            s = W(s + c[u].amount);
          }
        }
      }
      e.monthlyPaymentPartDtos = c;
      e.sumTablePayments = s;
      e.residueTablePayments = l;
    },
    addItemsTable: (e, t) => {
      const {
        monthlyPaymentPartDtos,
        selectedType,
        flat,
        discount,
        prepayment,
        delayInterval,
        delay,
      } = current(e);
      const c = monthlyPaymentPartDtos ? monthlyPaymentPartDtos.slice() : [];
      let u = 0;
      for (let h = 0; h < t.payload.number; h++) {
        c.push({
          amountString: t.payload.amount,
          amount: vt.parseFloatStringToNumber(t.payload.amount),
          date: be(t.payload.date, me).add(u, "month").format(me),
          type: "PREPAYMENT",
        });
        u += 1;
      }
      let d = 0;
      let f = W(
        (selectedType === "repaired" ? flat?.priceRepaired || 0 : flat?.priceNotRepaired || 0) -
          (discount || 0) -
          (prepayment || 0)
      );
      for (let h = 0; h < c.length; h++) {
        c[h] = {
          ...c[h],
          sum: f,
        };
        f = W(f - c[h].amount);
        d = W(d + c[h].amount);
      }
      if (f > 0 && (delay || 1) / (delayInterval || 1) === c.length) {
        const h = W(c[c.length - 1].amount + f);
        c[c.length - 1].amount = h;
        c[c.length - 1].amountString = h.toLocaleString("ru");
        d = W(d + f);
        f = 0;
      }
      e.firstPaymentDate = c[0].date;
      e.residueTablePayments = f;
      e.sumTablePayments = d;
      e.monthlyPaymentPartDtos = c;
    },
    deleteItemTable: (e, t) => {
      const { monthlyPaymentPartDtos, selectedType, flat, discount, prepayment } = current(e);
      const s = [];
      let l = 0;
      let c = W(
        (selectedType === "repaired" ? flat?.priceRepaired || 0 : flat?.priceNotRepaired || 0) -
          (discount || 0) -
          (prepayment || 0)
      );
      if (Array.isArray(monthlyPaymentPartDtos)) {
        for (let u = 0; u < monthlyPaymentPartDtos.length; u++) {
          if (u !== t.payload) {
            s.push({
              ...monthlyPaymentPartDtos[u],
              sum: c,
            });
            c = W(c - monthlyPaymentPartDtos[u].amount);
            l = W(l + monthlyPaymentPartDtos[u].amount);
          }
        }
      }
      e.firstPaymentDate = s.length > 0 ? s[0].date : "";
      e.residueTablePayments = c;
      e.sumTablePayments = l;
      e.monthlyPaymentPartDtos = s;
    },
    clear: (e) => {
      e.monthlyPaymentPartDtos = [];
      e.firstPaymentDate = "";
      e.delay = null;
      e.delayInterval = null;
      e.selectedType = "repaired";
      e.discount = null;
      e.discountDescription = "";
      e.prepayment = null;
      e.prepaymentDate = "";
      e.flatId = null;
      e.priceRepaired = null;
      e.priceNotRepaired = null;
      e.prePaymentPercent = null;
      e.isUsingDiscount = true;
      e.haveDiscount = false;
      e.discountNotRepaired = [];
      e.discountRepaired = [];
      e.number = "";
      e.repaired = gi.BOTH;
      e.residueTablePayments = 0;
      e.sumTablePayments = 0;
      e.brokerId = Number(Tt?.id);
      e.fields = [];
      e.prepaymentString = "";
      e.discountString = "";
    },
    setIsUsingDiscount: (e, t) => {
      e.isUsingDiscount = t.payload;
      if (!t.payload) {
        e.isUsingDiscount = false;
        e.discount = null;
        e.discountDescription = "";
      } else {
        const { discount, discountDescription } = Ys(current(e));
        e.discount = discount;
        e.discountDescription = discountDescription;
      }
    },
    setHaveDiscount: (e, t) => {
      if (t.payload.discountRepaired.length === 0) {
        e.isUsingDiscount = false;
        e.haveDiscount = false;
        e.discountRepaired = [];
        e.discountNotRepaired = [];
      } else {
        e.haveDiscount = true;
        e.discountRepaired = t.payload.discountRepaired;
        e.discountNotRepaired = t.payload.discountNotRepaired;
        if (current(e).isUsingDiscount) {
          const { discount, discountDescription } = Ys(current(e));
          e.discount = discount;
          e.discountDescription = discountDescription;
        } else {
          e.discount = null;
          e.discountDescription = "";
          e.isUsingDiscount = false;
        }
      }
    },
    setPrePaymentDelayAndIsUsingDiscount: (e, t) => {
      e.delay = t.payload.delay;
      e.prepayment = vt.parseFloatStringToNumber(t.payload.prePayment || "");
      e.prepaymentString = t.payload.prePayment;
      e.isUsingDiscount = t.payload.isUsingDiscount;
    },
    clearMonthlyPaymentsTable: (e) => {
      const { selectedType, flat, discount, prepayment } = current(e);
      e.monthlyPaymentPartDtos = undefined;
      e.residueTablePayments = W(
        (selectedType === "repaired" ? flat?.priceRepaired || 0 : flat?.priceNotRepaired || 0) -
          (discount || 0) -
          (prepayment || 0)
      );
      e.sumTablePayments = 0;
      e.firstPaymentDate = "";
    },
    setFirstContractNumber: (e, t) => {
      if (!e.number) {
        e.number = t.payload;
      }
    },
    setNumber: (e, t) => {
      e.number = t.payload;
    },
    setBroker: (e, t) => {
      e.brokerId = t.payload;
    },
    setChangeNumber: (e) => {
      if (!e.changeNumber) {
        e.changeNumber = true;
      }
    },
    setCustomField: (e, t) => {
      const r = [...e.fields];
      const n = r.findIndex((i) => i.fieldId === t.payload.fieldId);
      if (n !== -1) {
        r[n] = t.payload;
      } else {
        r.push(t.payload);
      }
      e.fields = r;
    },
    setClientData: (e, t) => {
      e.clientData = t.payload;
    },
  },
});
const {
  setFlat,
  setDelay,
  setDelayInterval,
  setSelectedType,
  setDiscount,
  setPrepaymentDate,
  setDiscountDescription,
  setPrepayment,
  setMonthlyPaymentPartDtos,
  setFirstPaymentDate,
  changeOnePaymentDate,
  changeOnePaymentAmount,
  setPrePaymentDelayAndIsUsingDiscount,
  clear,
  setHaveDiscount,
  setIsUsingDiscount,
  setNumber,
  setFirstContractNumber,
  deleteItemTable,
  clearMonthlyPaymentsTable,
  addItemsTable,
  setBroker,
  setChangeNumber,
  setCustomField,
  setClientData,
} = S1.actions;
export { S1 };
