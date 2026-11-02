// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (7)
import { createSlice, current } from "@reduxjs/toolkit";
import { Hn } from "@/constants/client-type";
import { W } from "@/utils/round";
import be from "dayjs";
import { me } from "@/constants/index";
import { vt } from "@/utils/helpers";
import { Tt } from "@/utils/current-user";
import { ce } from "@/utils/storage";
import { MI } from "@/constants/storage-keys";
const Z4 = {
  "asia/tashkent": "uz",
  "asia/samarkand": "uz",
  "asia/almaty": "kz",
  "asia/aqtau": "kz",
  "asia/aqtobe": "kz",
  "asia/atyrau": "kz",
  "asia/oral": "kz",
  "asia/qostanay": "kz",
  "asia/qyzylorda": "kz",
  "asia/bishkek": "kg",
  "asia/dushanbe": "tj",
  "asia/ashgabat": "tm",
  "europe/istanbul": "tr",
  "asia/istanbul": "tr",
  turkey: "tr",
  "asia/baku": "az",
  "europe/kaliningrad": "ru",
  "europe/moscow": "ru",
  "europe/kirov": "ru",
  "europe/volgograd": "ru",
  "europe/astrakhan": "ru",
  "europe/saratov": "ru",
  "europe/ulyanovsk": "ru",
  "europe/samara": "ru",
  "asia/yekaterinburg": "ru",
  "asia/omsk": "ru",
  "asia/novosibirsk": "ru",
  "asia/barnaul": "ru",
  "asia/tomsk": "ru",
  "asia/novokuznetsk": "ru",
  "asia/krasnoyarsk": "ru",
  "asia/irkutsk": "ru",
  "asia/chita": "ru",
  "asia/yakutsk": "ru",
  "asia/khandyga": "ru",
  "asia/vladivostok": "ru",
  "asia/ust-nera": "ru",
  "asia/magadan": "ru",
  "asia/sakhalin": "ru",
  "asia/srednekolymsk": "ru",
  "asia/kamchatka": "ru",
  "asia/anadyr": "ru",
};
const e8 = (e) => {
  if (e) {
    return Z4[e.trim().toLowerCase()];
  }
};
const t8 = "uz";
const Oh = () => e8(Tt?.companyTimeZone) || ce.get(MI)?.toLowerCase() || t8;
const initialState = {
  searchClient: "",
  clientType: Hn.NATURAL,
  clientPhones: [
    {
      phone: "",
      active: true,
      code: Oh().toUpperCase(),
    },
  ],
  selectedClient: null,
  sumTablePayments: 0,
  residueTablePayments: 0,
  residue: 0,
  selectedContract: null,
  currentPage: 1,
  total: 0,
};
const n1 = createSlice({
  name: "changes",
  initialState,
  reducers: {
    setClientType: (e, t) => {
      e.clientPhones = [
        {
          phone: "",
          active: true,
          code: Oh().toUpperCase(),
        },
      ];
      e.selectedClient = null;
      e.clientType = t.payload;
    },
    setSelectedClient: (e, t) => {
      e.selectedClient = t.payload.data;
      e.clientPhones = t.payload.phones;
      e.clientType = t.payload.data?.type || Hn.NATURAL;
    },
    checkClientPhone: (e, t) => {
      const r = e.clientPhones.slice();
      for (let n = 0; n < r.length; n++) {
        r[n].active = n === t.payload;
      }
      e.clientPhones = r;
    },
    deleteClientPhones: (e, t) => {
      const { clientPhones } = current(e);
      const n = e.clientPhones.filter((i, a) => a !== t.payload);
      if (clientPhones[t.payload].active) {
        n[0].active = true;
      }
      e.clientPhones = n;
    },
    addClientPhone: (e) => {
      e.clientPhones.push({
        phone: "",
        active: false,
        code: Oh().toUpperCase(),
      });
    },
    setMonthlyPaymentParts: (e, t) => {
      if (current(e).monthlyPaymentParts) {
        return;
      }
      let r = 0;
      const n = [...t.payload.monthlyPaymentParts];
      for (let i = 0; i < n.length; i++) {
        r = W(r + n[i]?.amount);
        n[i] = {
          ...n[i],
          amountString: n[i].amount.toLocaleString("ru"),
        };
      }
      e.monthlyPaymentParts = n;
      e.sumTablePayments = r;
      e.residueTablePayments = W(r - t.payload?.residue);
      e.residue = t.payload?.residue;
      e.currency = t.payload.currency;
    },
    clearTableMonthlyPayments: (e) => {
      e.monthlyPaymentParts = undefined;
    },
    deleteItemMonthlyPaymentParts: (e, t) => {
      e.monthlyPaymentParts = e.monthlyPaymentParts?.filter((r, n) => n !== t.payload.index);
      e.sumTablePayments = W(e.sumTablePayments - t.payload.amount);
      e.residueTablePayments = W(e.residue - e.sumTablePayments);
    },
    clearTablePayments: (e) => {
      e.monthlyPaymentParts = undefined;
      e.sumTablePayments = 0;
      e.residueTablePayments = e.residue;
    },
    changeAllDateMonthlyPaymentsTable: (e, t) => {
      const r = e.monthlyPaymentParts?.slice();
      let n = 0;
      if (Array.isArray(r)) {
        for (let i = 0; i < r.length; i++) {
          r[i].date = be(t.payload, me).add(n, "month").format(me);
          n += 1;
        }
      }
      e.monthlyPaymentParts = r;
    },
    changeDateMonthlyPaymentsTable: (e, t) => {
      const r = e.monthlyPaymentParts?.slice();
      if (Array.isArray(r)) {
        r[t.payload.index].date = t.payload.date;
      }
      e.monthlyPaymentParts = r;
    },
    addItemsTable: (e, t) => {
      const r = e.monthlyPaymentParts ? e.monthlyPaymentParts?.slice() : [];
      const r_length = r.length;
      let i = 0;
      for (let l = 0; l < t.payload.number; l++) {
        r?.push({
          amount: vt.parseFloatStringToNumber(t.payload.amount),
          date: be(t.payload.date, me).add(i, "month").format(me),
          amountString: t.payload.amount,
        });
        i += 1;
      }
      let a = W(
        e.residueTablePayments - vt.parseFloatStringToNumber(t.payload.amount) * t.payload.number
      );
      let o = W(
        e.sumTablePayments + vt.parseFloatStringToNumber(t.payload.amount) * t.payload.number
      );
      if (
        W(e.residueTablePayments / t.payload.number) ===
          vt.parseFloatStringToNumber(t.payload.amount) &&
        a > 0 &&
        t?.payload?.number + r_length === r.length
      ) {
        r[r.length - 1].amountString = W(r[r.length - 1].amount + a).toLocaleString("ru");
        r[r.length - 1].amount = W(r[r.length - 1].amount + a);
        o = W(o + a);
        a = 0;
      }
      e.residueTablePayments = a;
      e.sumTablePayments = o;
      e.monthlyPaymentParts = r;
    },
    changeOneItemAmountTable: (e, t) => {
      const r = e.monthlyPaymentParts?.slice();
      let n = 0;
      if (Array.isArray(r)) {
        n = W(r[t.payload.index].amount - vt.parseFloatStringToNumber(t.payload.amount));
        r[t.payload.index].amount = vt.parseFloatStringToNumber(t.payload.amount);
        r[t.payload.index].amountString = t.payload.amount;
      }
      e.residueTablePayments = W(e.residueTablePayments + n);
      e.sumTablePayments = W(e.sumTablePayments - n);
      e.monthlyPaymentParts = r;
    },
    setSelectedContract: (e, t) => {
      e.selectedContract = t.payload;
      if (!t.payload) {
        e.residue = 0;
        e.residueTablePayments = 0;
        e.sumTablePayments = 0;
        e.monthlyPaymentParts = undefined;
      }
      e.remainingAmount = t.payload?.remainingAmount || 0;
    },
    setSearchClient: (e, t) => {
      e.searchClient = t.payload;
    },
    setCurrency: (e, t) => {
      e.currency = t.payload;
    },
    setClearChanges: (e) => {
      e.clientType = Hn.NATURAL;
      e.clientPhones = [
        {
          phone: "",
          active: true,
          code: "",
        },
      ];
      e.selectedClient = null;
      e.monthlyPaymentParts = undefined;
      e.sumTablePayments = 0;
      e.residueTablePayments = 0;
      e.residue = 0;
      e.selectedContract = null;
      e.searchClient = "";
      e.currency = undefined;
      e.remainingAmount = undefined;
      e.remainingDate = undefined;
      e.total = 0;
    },
    setClientChangesPhone: (e, t) => {
      e.clientPhones = e.clientPhones.map((r, n) => {
        if (n === t.payload.index) {
          return {
            ...r,
            phone: `${t.payload.phone}`,
          };
        }
        return r;
      });
    },
    setCurrentPage: (e, t) => {
      e.currentPage = t.payload;
    },
    changeRemainingAmount: (e, t) => {
      e.remainingAmount = t.payload;
    },
    changeRemainingDate: (e, t) => {
      e.remainingDate = t.payload;
    },
  },
});
const {
  setClientType,
  setSelectedClient,
  checkClientPhone,
  deleteClientPhones,
  addClientPhone,
  setMonthlyPaymentParts,
  deleteItemMonthlyPaymentParts,
  clearTablePayments,
  changeAllDateMonthlyPaymentsTable,
  changeDateMonthlyPaymentsTable,
  addItemsTable,
  changeOneItemAmountTable,
  setSelectedContract,
  setClearChanges,
  setSearchClient,
  clearTableMonthlyPayments,
  setCurrency,
  setClientChangesPhone,
  setCurrentPage,
  changeRemainingAmount,
  changeRemainingDate,
} = n1.actions;
export { n1 };
