// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice, current } from "@reduxjs/toolkit";
import { W } from "@/utils/round";
import { Hr, ha } from "@/utils/payment-schedule";
import xt from "i18next";
import { Ti } from "@/components/toaster/state";
import be from "dayjs";
import { me } from "@/constants/index";
import { Oe, oe, c1 } from "@/utils/contract-calc";
import { vt } from "@/utils/helpers";
import { ce } from "@/utils/storage";
import { cv } from "@/store/reducers/createContractV2";
import { Tt } from "@/utils/current-user";
const initialState = {
  constTotalAmount: 0,
  delay: 0,
  prePayment: 0,
  totalAmount: 0,
  flats: [],
  discountSum: 0,
  brokerId: Number(Tt?.id),
  employeeId: Number(Tt?.id),
  changeContractNumber: false,
  contractNumber: "",
  delayInterval: 1,
  fields: [],
  discountText: "",
  prepaymentDate: be(new Date()).format(me),
  prepaymentDisabledDate: undefined,
  firstPaymentDate: be(new Date()).add(1, "month").format(me),
  monthlyPaymentPartDtos: [],
  sumTablePayments: 0,
  residueTablePayments: 0,
  currency: undefined,
  useDiscount: false,
  currencyCompany: undefined,
  dealPrice: 0,
  discountId: 0,
  variation: undefined,
  termDiscount: undefined,
  remainingAmount: undefined,
  remainingPaymentDate: be(new Date()).format(me),
  calculatePrePayment: "BEFORE_DISCOUNT",
  referralCode: "",
  sourceLeadId: null,
  realtorId: undefined,
  bookingDiscount: {
    amount: 0,
    flatId: 0,
  },
};
const f1 = createSlice({
  name: "createContract",
  initialState,
  reducers: {
    setCurrencyCompany: (e, t) => {
      e.currencyCompany = t.payload;
    },
    setFlats: (e, t) => {
      if (e.flats.length !== 0) {
        return;
      }
      let r = 0;
      let n = 0;
      let i = 0;
      const a = [];
      t.payload.forEach((o) => {
        const { repaired } = o.flat;
        const isCanChangeRepaired = !!(o.flat.priceRepaired && o.flat.priceNotRepaired);
        const pricePerAreaTerrace = repaired
          ? o.flat.terrace?.pricePerAreaRepaired || null
          : o.flat.terrace?.pricePerArea || null;
        const pricePerArea = repaired ? o.flat.pricePerAreaRepaired : o.flat.pricePerArea;
        i = W(i + o.flat.prepayment);
        if (n < o.flat.delay) {
          n = o.flat.delay;
        }
        const d = repaired ? o.flat.priceRepaired : o.flat.priceNotRepaired;
        r = W(r + d);
        let f = 0;
        if (repaired && o.discountRepaired) {
          f = o.discountRepaired.discount;
        } else if (o.discountNotRepaired) {
          f = o.discountNotRepaired.discount;
        }
        a.push({
          ...o,
          firstPayment: o.flat.prepayment,
          repaired,
          totalAmount: d,
          isChangePricePerArea: false,
          isCanChangeRepaired,
          discountAmount: 0,
          discountPercent: f,
          pricePerAreaTerrace,
          pricePerArea,
        });
      });
      e.flats = a;
      e.currency = a[0]?.flat?.currency;
      e.prePayment = i;
      e.delay = n;
      e.totalAmount = r;
      e.constTotalAmount = r;
      e.delayInterval = 1;
      e.discountText = "";
      e.useDiscount = false;
      e.dealPrice = r - e.discountSum;
    },
    setOptionsContract: (e, t) => {
      let r = 0;
      let n = 0;
      let i = 0;
      t.payload.delay;
      if (
        !t?.payload?.notDiscount &&
        (e.prePayment !== t.payload.prePayment || e.flats.length === 1)
      ) {
        const a = [];
        e.flats.forEach((o) => {
          const s = o.repaired ? o.flat.priceRepaired : o.flat.priceNotRepaired;
          const l = W(s / (e.constTotalAmount || e.totalAmount));
          const c = W(l * t.payload.prePayment);
          const u = o.repaired ? o.discountRepairedList : o.discountNotRepairedList;
          let d = 0;
          if (u.length > 0) {
            for (let f = 0; f < u.length; f++) {
              if (
                (f + 1 === u.length && u[f].month === t.payload.delay && c >= u[f].firstPayment) ||
                (u[f].firstPayment <= c &&
                  u[f].month === t.payload.delay &&
                  u[f + 1].firstPayment > c) ||
                (u[f].firstPayment <= c &&
                  u[f].month === t.payload.delay &&
                  u[f + 1].firstPayment === u[f].firstPayment)
              ) {
                if (o.discountDTO?.discountType === "PREPAYMENT_PERCENT" && u[f].percent !== 100) {
                  n = W((c / 100) * (u[f].prepaymentDiscountPercent || 0));
                  i = W(n / (s / 100));
                  d = i;
                } else {
                  d = W(u[f].discount);
                  i = W(u[f].discount);
                  n = u[f].discountAmount;
                }
                u[f].month;
              }
            }
          }
          if (
            (o.discountAmount !== 0 && o.discountPercent === 0) ||
            (o.discountAmount !== 0 && o.discountPercent === d)
          ) {
            a.push({
              ...o,
              firstPayment: c,
            });
            r = W(r + (o.discountAmount || 0));
          } else {
            a.push({
              ...o,
              discountAmount: 0,
              discountPercent: d,
              totalAmount: s,
              pricePerArea: o.repaired ? o.flat.pricePerAreaRepaired : o.flat.pricePerArea,
              firstPayment: c,
              isChangePricePerArea: false,
              pricePerAreaTerrace: o.repaired
                ? o.flat.terrace?.pricePerAreaRepaired || null
                : o.flat.terrace?.pricePerArea || null,
            });
          }
        });
        if (t.payload.useDiscount) {
          e.flats = [
            {
              ...a[0],
              discountPercent: i,
              discountAmount: n,
            },
          ];
          e.discountSum = n;
        } else {
          e.flats = a;
          e.discountSum = r;
        }
      }
      e.delay = t.payload.delay;
      e.prePayment = t.payload.prePayment;
      e.useDiscount = t.payload.useDiscount;
      e.remainingAmount = undefined;
    },
    setOptionsContractV2: (e, t) => {
      e.delay = t.payload.delay;
      e.prePayment = t.payload.prePayment;
      e.remainingAmount = undefined;
    },
    changeRepairedStatus: (e, t) => {
      const r = [];
      let { prePayment } = e;
      let { totalAmount } = e;
      e.flats.forEach((s) => {
        if (s.flat.id === t.payload) {
          prePayment = W(prePayment - s.firstPayment);
          totalAmount = W(totalAmount - s.totalAmount);
          if (s.repaired) {
            prePayment = W(prePayment + (s.flat.priceNotRepaired * s.flat.prepaymentPercent) / 100);
            totalAmount = W(totalAmount + s.flat.priceNotRepaired);
            r.push({
              ...s,
              repaired: false,
              discountAmount: 0,
              discountPercent: s?.discountNotRepaired?.discount || 0,
              totalAmount: s.flat.priceNotRepaired,
              firstPayment: W((s.flat.priceNotRepaired * s.flat.prepaymentPercent) / 100),
              pricePerArea: s.flat.pricePerArea,
              pricePerAreaTerrace: s.flat?.terrace?.pricePerArea || null,
            });
          } else {
            prePayment = W(prePayment + (s.flat.priceRepaired * s.flat.prepaymentPercent) / 100);
            totalAmount = W(totalAmount + s.flat.priceRepaired);
            r.push({
              ...s,
              repaired: true,
              discountAmount: 0,
              discountPercent: s?.discountRepaired?.discount || 0,
              totalAmount: s.flat.priceRepaired,
              firstPayment: W((s.flat.priceRepaired * s.flat.prepaymentPercent) / 100),
              pricePerArea: s.flat.pricePerAreaRepaired,
              pricePerAreaTerrace: s.flat?.terrace?.pricePerAreaRepaired || null,
            });
          }
        } else {
          r.push(s);
        }
      });
      let a = 0;
      const o = [];
      r.forEach((s) => {
        const l = s.repaired ? s.flat.priceRepaired : s.flat.priceNotRepaired;
        const c = W(l / totalAmount);
        const u = W(c * prePayment);
        const d = s.repaired ? s.discountRepairedList : s.discountNotRepairedList;
        let f = 0;
        if (d.length > 0) {
          for (let h = 0; h < d.length; h++) {
            if (h + 1 === d.length && u >= d[h].firstPayment) {
              f = W(d[h].discount);
            } else if (d[h].firstPayment <= u && d[h + 1].firstPayment > u) {
              f = W(d[h].discount);
              break;
            }
          }
        }
        if (
          (s.discountAmount !== 0 && s.discountPercent === 0) ||
          (s.discountAmount !== 0 && s.discountPercent === f)
        ) {
          o.push({
            ...s,
            firstPayment: u,
          });
          a = W(a + (s.discountAmount || 0));
        } else {
          o.push({
            ...s,
            discountAmount: 0,
            discountPercent: f,
            firstPayment: u,
          });
        }
      });
      e.discountSum = a;
      e.flats = o;
      e.prePayment = prePayment;
      e.totalAmount = totalAmount;
      e.constTotalAmount = totalAmount;
      e.dealPrice = totalAmount - a;
      e.remainingAmount = undefined;
    },
    changePricePerArea: (e, t) => {
      const r = [];
      let n = 0;
      const i =
        e?.constTotalAmount - (e?.calculatePrePayment === "BEFORE_DISCOUNT" ? 0 : e.discountSum);
      const a = W((e.prePayment / i) * 100);
      e.flats.forEach((o) => {
        if (o.flat.id === t.payload.id) {
          o.discountAmount !== 0 &&
            (o.repaired
              ? (o.pricePerArea !== o.flat.pricePerAreaRepaired &&
                  (o.flat.pricePerAreaRepaired - o.pricePerArea) * o.flat.area,
                o.flat.terrace &&
                  ((o.flat.terrace.pricePerAreaRepaired || 0) - (o.pricePerAreaTerrace || 0)) *
                    (o?.flat?.terrace?.area || 0))
              : (o.pricePerArea !== o.flat.pricePerArea &&
                  (o.flat.pricePerArea - o.pricePerArea) * o.flat.area,
                o.flat.terrace &&
                  ((o.flat.terrace.pricePerArea || 0) - (o.pricePerAreaTerrace || 0)) *
                    (o?.flat?.terrace?.area || 0)));
          if (o.repaired) {
            n = W(n + (o.flat.pricePerAreaRepaired - t.payload.amount) * o.flat.area);
            r.push({
              ...o,
              discountAmount: W((o.flat.pricePerAreaRepaired - t.payload.amount) * o.flat.area),
              discountPercent: 0,
              pricePerArea: t.payload.amount,
            });
          } else {
            n = W(n + (o.flat.pricePerArea - t.payload.amount) * o.flat.area);
            r.push({
              ...o,
              discountAmount: W((o.flat.pricePerArea - t.payload.amount) * o.flat.area),
              discountPercent: 0,
              pricePerArea: t.payload.amount,
            });
          }
        } else {
          n = W(n + (o.discountAmount || 0));
          r.push(o);
        }
      });
      if (n > 0 && !e.discountText) {
        e.discountText = "";
      }
      e.prePayment = Hr({
        constTotalAmount: e.constTotalAmount,
        totalAmount: e.totalAmount,
        discountSum: n,
        calculatePrePayment: e.calculatePrePayment,
        prepaymentPercent: a,
      });
      e.useDiscount = false;
      e.flats = r;
      e.discountSum = n;
      e.dealPrice = (e.constTotalAmount || e.totalAmount) - n;
      e.remainingAmount = undefined;
    },
    changePricePerAreaTerrace: (e, t) => {
      const r = [];
      let n = 0;
      const i =
        e?.constTotalAmount - (e?.calculatePrePayment === "BEFORE_DISCOUNT" ? 0 : e.discountSum);
      const a = W((e.prePayment / i) * 100);
      e.flats.forEach((o) => {
        if (o.flat.id === t.payload.id && o.flat.terrace) {
          let s = 0;
          if (o.discountAmount !== 0) {
            if (o.repaired) {
              if (o.pricePerAreaTerrace !== o.flat?.terrace?.pricePerAreaRepaired) {
                const c =
                  ((o.flat.terrace?.pricePerAreaRepaired || 0) - (o?.pricePerAreaTerrace || 0)) *
                  (o?.flat?.terrace?.area || 0);
                s = W(c);
              }
              const l = (o.flat.pricePerAreaRepaired - o.pricePerArea) * o.flat.area;
              s = W(l + s);
            } else {
              if (o.pricePerAreaTerrace !== o.flat.terrace.pricePerArea) {
                const c =
                  ((o.flat.terrace?.pricePerArea || 0) - (o?.pricePerAreaTerrace || 0)) *
                  (o?.flat?.terrace?.area || 0);
                s = W(c);
              }
              const l = (o.flat.pricePerArea - o.pricePerArea) * o.flat.area;
              s = W(l + s);
            }
          }
          if (o.repaired) {
            n = W(
              n +
                s +
                ((o.flat.terrace?.pricePerAreaRepaired || 0) - t.payload.amount) *
                  (o.flat.terrace?.area || 0)
            );
            r.push({
              ...o,
              discountAmount: W(
                s +
                  ((o.flat.terrace?.pricePerAreaRepaired || 0) - t.payload.amount) *
                    (o.flat.terrace?.area || 0)
              ),
              discountPercent: 0,
              pricePerAreaTerrace: t.payload.amount,
            });
          } else {
            n = W(
              n +
                s +
                ((o.flat.terrace?.pricePerArea || 0) - t.payload.amount) *
                  (o.flat.terrace?.area || 0)
            );
            r.push({
              ...o,
              discountAmount: W(
                s +
                  ((o.flat.terrace?.pricePerArea || 0) - t.payload.amount) *
                    (o.flat.terrace?.area || 0)
              ),
              discountPercent: 0,
              pricePerAreaTerrace: t.payload.amount,
            });
          }
        } else {
          n = W(n + (o.discountAmount || 0));
          r.push(o);
        }
      });
      if (n > 0 && !e.discountText) {
        e.discountText = "";
      }
      e.prePayment = Hr({
        constTotalAmount: e.constTotalAmount,
        totalAmount: e.totalAmount,
        discountSum: n,
        calculatePrePayment: e.calculatePrePayment,
        prepaymentPercent: a,
      });
      e.flats = r;
      e.discountSum = n;
      e.dealPrice = (e.constTotalAmount || e.totalAmount) - n;
      e.remainingAmount = undefined;
    },
    changePercentDiscount: (e, t) => {
      const r = [];
      let { discountSum } = e;
      const i =
        e?.constTotalAmount - (e.calculatePrePayment === "BEFORE_DISCOUNT" ? 0 : discountSum);
      let a = W((e.prePayment / i) * 100);
      e.flats.forEach((o) => {
        if (o.flat.id === t.payload) {
          const l = (o?.repaired ? o?.discountRepairedList : o?.discountNotRepairedList)?.find(
            (c) => c?.discount === o?.discountPercent
          );
          a = l?.percent || a;
          if (o.discountAmount === 0) {
            const c = l?.discountAmount || 0;
            discountSum = W(discountSum + c);
            r.push({
              ...o,
              discountAmount: c,
            });
          } else {
            discountSum = W(discountSum - (o.discountAmount || 0));
            r.push({
              ...o,
              discountAmount: 0,
            });
          }
        } else {
          r.push(o);
        }
      });
      if (e.flats.length === 1 && !e.useDiscount) {
        e.useDiscount = true;
      }
      if (discountSum > 0 && !e.discountText) {
        e.discountText = "";
      }
      e.prePayment = Hr({
        constTotalAmount: e.constTotalAmount,
        totalAmount: e.totalAmount,
        discountSum,
        calculatePrePayment: e.calculatePrePayment,
        prepaymentPercent: a,
      });
      e.discountText = discountSum
        ? `${discountSum?.toLocaleString("ru")} ${e?.currency?.ccy} ${xt.t(
            "contract.chegirma_qollanildi"
          )}`
        : "";
      e.flats = r;
      e.discountSum = discountSum;
      e.dealPrice = (e.constTotalAmount || e.totalAmount) - discountSum;
      e.remainingAmount = undefined;
    },
    setContractNumber: (e, t) => {
      e.contractNumber = t.payload.number;
      e.changeContractNumber = t.payload.isChange;
    },
    setBroker: (e, t) => {
      e.brokerId = t.payload;
    },
    setEmployee: (e, t) => {
      e.employeeId = t.payload;
    },
    setDelay: (e, t) => {
      e.delayInterval = 1;
      e.delay = t.payload;
    },
    setDelayInterval: (e, t) => {
      if (e.delay % (t.payload || 1) === 0) {
        e.delayInterval = t.payload;
        return;
      }
      const r = t.payload - (e.delay % t.payload);
      Ti.warning(
        `Interval kiritishda xatolikni oldini olish maqsadida vaqt oralig'i ${e.delay} dan ${
          e.delay + r
        } ga o'zgartirildi!`
      );
      e.delay += r;
      e.delayInterval = t.payload;
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
    setPrePayment: (e, t) => {
      const r = [];
      let n = 0;
      e.flats.forEach((i) => {
        const a = i.repaired ? i.flat.priceRepaired : i.flat.priceNotRepaired;
        const o = W(a / e.totalAmount);
        const s = W(o * t.payload);
        const l = i.repaired ? i.discountRepairedList : i.discountNotRepairedList;
        let c = 0;
        if (l.length > 0) {
          for (let u = 0; u < l.length; u++) {
            if (u + 1 === l.length && s >= l[u].firstPayment) {
              c = W(l[u].discount);
            } else if (l[u].firstPayment <= s && l[u + 1].firstPayment > s) {
              c = W(l[u].discount);
              break;
            }
          }
        }
        if (
          (i.discountAmount !== 0 && i.discountPercent === 0) ||
          (i.discountAmount !== 0 && i.discountPercent === c)
        ) {
          r.push({
            ...i,
            firstPayment: s,
          });
          n = W(n + (i.discountAmount || 0));
        } else {
          r.push({
            ...i,
            discountAmount: 0,
            discountPercent: c,
            totalAmount: a,
            pricePerArea: i.repaired ? i.flat.pricePerAreaRepaired : i.flat.pricePerArea,
            firstPayment: s,
            isChangePricePerArea: false,
            pricePerAreaTerrace: i.repaired
              ? i.flat.terrace?.pricePerAreaRepaired || null
              : i.flat.terrace?.pricePerArea || null,
          });
        }
      });
      e.prePayment = t.payload;
      e.discountSum = n;
      e.flats = r;
      e.dealPrice = (e.constTotalAmount || e.totalAmount) - n;
      e.remainingAmount = undefined;
    },
    changeOneFlatAmount: (e, t) => {
      const r = [];
      let e_discountSum = e.discountSum;
      const i =
        e?.constTotalAmount - (e?.calculatePrePayment === "BEFORE_DISCOUNT" ? 0 : e.discountSum);
      const a = W((e.prePayment / i) * 100);
      e.flats.forEach((o) => {
        if (o.flat.id === t.payload.id) {
          const s = o.firstPayment;
          const l = o.repaired ? o.discountRepairedList : o.discountNotRepairedList;
          const c = W(o.totalAmount - t.payload.amount);
          e_discountSum = W(e_discountSum + c - (o.discountAmount || 0));
          let u = 0;
          if (l.length > 0) {
            for (let d = 0; d < l.length; d++) {
              if (d + 1 === l.length && s >= l[d].firstPayment) {
                u = W(l[d].discount);
              } else if (l[d].firstPayment <= s && l[d + 1].firstPayment > s) {
                u = W(l[d].discount);
                break;
              }
            }
          }
          r.push({
            ...o,
            discountAmount: c,
            discountPercent: c === 0 ? u : 0,
            totalAmount: o.repaired ? o.flat.priceRepaired : o.flat.priceNotRepaired,
            pricePerArea: o.repaired ? o.flat.pricePerAreaRepaired : o.flat.pricePerArea,
            firstPayment: o.flat.prepayment,
            isChangePricePerArea: false,
            pricePerAreaTerrace: o.repaired
              ? o.flat.terrace?.pricePerAreaRepaired || null
              : o.flat.terrace?.pricePerArea || null,
          });
        } else {
          r.push(o);
        }
      });
      e.prePayment = Hr({
        constTotalAmount: e.constTotalAmount,
        totalAmount: e.totalAmount,
        discountSum: e_discountSum,
        calculatePrePayment: e.calculatePrePayment,
        prepaymentPercent: a,
      });
      e.discountText = e_discountSum
        ? `${e_discountSum?.toLocaleString("ru")} ${e?.currency?.ccy} ${xt.t(
            "contract.chegirma_qollanildi"
          )}`
        : "";
      e.flats = r;
      e.useDiscount = false;
      e.discountSum = e_discountSum;
      e.dealPrice = (e.constTotalAmount || e.totalAmount) - e_discountSum;
      e.remainingAmount = undefined;
    },
    setClearOneFlatDiscount: (e, t) => {
      const r = [];
      let n = 0;
      const i =
        e?.constTotalAmount - (e?.calculatePrePayment === "BEFORE_DISCOUNT" ? 0 : e.discountSum);
      const a = W((e.prePayment / i) * 100);
      e.flats.forEach((s) => {
        if (s.flat.id === t.payload) {
          const l = s.firstPayment;
          const c = s.repaired ? s.discountRepairedList : s.discountNotRepairedList;
          let u = 0;
          if (c.length > 0) {
            for (let d = 0; d < c.length; d++) {
              if (
                (d + 1 === c.length && c[d]?.month === e.delay && l >= c[d].firstPayment) ||
                (c[d].firstPayment <= l && c[d]?.month === e.delay && c[d + 1].firstPayment > l) ||
                (c[d].firstPayment <= l &&
                  c[d]?.month === e.delay &&
                  c[d + 1].firstPayment === c[d]?.firstPayment)
              ) {
                u = W(c[d].discount);
              }
            }
          }
          n = s.discountAmount || 0;
          r.push({
            ...s,
            discountAmount: 0,
            discountPercent: u,
            totalAmount: s.repaired ? s.flat.priceRepaired : s.flat.priceNotRepaired,
            pricePerArea: s.repaired ? s.flat.pricePerAreaRepaired : s.flat.pricePerArea,
            isChangePricePerArea: false,
            pricePerAreaTerrace: s.repaired
              ? s.flat.terrace?.pricePerAreaRepaired || null
              : s.flat.terrace?.pricePerArea || null,
          });
        } else {
          r.push(s);
        }
      });
      e.discountText = W(e.discountSum - n)
        ? `${W(e.discountSum - n)?.toLocaleString("ru")} ${e?.currency?.ccy} ${xt.t(
            "contract.chegirma_qollanildi"
          )}`
        : "";
      e.flats = r;
      const o = W(e.discountSum - n);
      e.prePayment = Hr({
        constTotalAmount: e.constTotalAmount,
        totalAmount: e.totalAmount,
        discountSum: o,
        calculatePrePayment: e.calculatePrePayment,
        prepaymentPercent: a,
      });
      e.discountSum = o;
      e.dealPrice = (e.constTotalAmount || e.totalAmount) - o;
      e.remainingAmount = undefined;
    },
    changeDiscount: (e, t) => {
      const r = [];
      const amount = t.payload.amount;
      const i = () => {
        let a = 0;
        const o = e.flats?.map((s) => {
          const l = parseFloat(
            ((s?.totalAmount / (e.constTotalAmount || e.totalAmount)) * amount).toFixed(2)
          );
          a += l;
          return l;
        });
        if (a !== amount) {
          o[o.length - 1] += parseFloat((amount - a).toFixed(2));
        }
        return o;
      };
      e.flats.forEach((a, o) => {
        const discountPercent = W((i()[o] * 100) / a?.totalAmount);
        if (a.repaired) {
          r.push({
            ...a,
            repaired: !t.payload.changeRepairedStatus,
            discountAmount: i()[o],
            discountPercent,
            totalAmount: a.flat?.priceRepaired,
            pricePerArea: a.flat?.pricePerAreaRepaired,
            pricePerAreaTerrace: a.flat?.terrace?.pricePerAreaRepaired || null,
            isChangePricePerArea: false,
            firstPayment: a.flat.prepayment,
          });
        } else {
          r.push({
            ...a,
            repaired: t.payload.changeRepairedStatus,
            discountAmount: i()[o],
            discountPercent,
            totalAmount: a.flat?.priceNotRepaired,
            pricePerArea: a.flat?.pricePerArea,
            pricePerAreaTerrace: a.flat?.terrace?.pricePerArea || null,
            isChangePricePerArea: false,
            firstPayment: a.flat.prepayment,
          });
        }
      });
      e.flats = r;
      e.useDiscount = false;
      e.discountSum = t.payload.amount || 0;
      e.dealPrice = (e.constTotalAmount || e.totalAmount) - (t.payload.amount || 0);
      e.remainingAmount = undefined;
    },
    setDiscountText: (e, t) => {
      e.discountText = t.payload;
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
    setMonthlyPaymentPartDtos: (e, t) => {
      const { isMultiPayment } = t.payload;
      const n = Oe(e.constTotalAmount || e.totalAmount, 2);
      e.monthlyPaymentPartDtos = ha(
        W(
          n -
            (isMultiPayment ? 0 : e.discountSum) -
            e.prePayment -
            (e?.variation?.mortgagePrice || 0) -
            (e.remainingAmount || 0)
        ),
        e.firstPaymentDate,
        e.delay || 0,
        e.delayInterval || 1
      );
      e.sumTablePayments = Oe(
        n -
          (isMultiPayment ? 0 : e.discountSum) -
          e.prePayment -
          (e?.variation?.mortgagePrice || 0) -
          (e.remainingAmount || 0),
        2
      );
      e.residueTablePayments = 0;
    },
    changeOnePaymentAmount: (e, t) => {
      const {
        monthlyPaymentPartDtos,
        discountSum,
        prePayment,
        totalAmount,
        constTotalAmount,
        variation,
      } = current(e);
      const l = Oe(constTotalAmount || totalAmount, 2);
      let c = 0;
      let u = Oe(
        l -
          (t?.payload?.isMultiPayment ? 0 : discountSum) -
          prePayment -
          (variation?.mortgagePrice || 0) -
          (e.remainingAmount || 0),
        2
      );
      const d = [];
      if (Array.isArray(monthlyPaymentPartDtos)) {
        for (let f = 0; f < monthlyPaymentPartDtos.length; f++) {
          const amount = vt.parseFloatStringToNumber(t.payload.amount);
          if (f === t.payload.index) {
            d.push({
              ...monthlyPaymentPartDtos[f],
              amount,
              amountString: t.payload.amount,
              sum: u,
            });
            u = Oe(u - amount, 2);
            c = Oe(c + amount, 2);
          } else {
            d.push({
              ...monthlyPaymentPartDtos[f],
              sum: u,
            });
            u = Oe(u - d[f].amount, 2);
            c = Oe(c + d[f].amount, 2);
          }
        }
      }
      e.monthlyPaymentPartDtos = d;
      e.sumTablePayments = c;
      e.residueTablePayments = u;
    },
    addItemsTable: (e, t) => {
      const {
        monthlyPaymentPartDtos,
        totalAmount,
        constTotalAmount,
        discountSum,
        prePayment,
        delayInterval,
        delay,
        variation,
      } = current(e);
      const u = Oe(constTotalAmount || totalAmount, 2);
      const d = monthlyPaymentPartDtos ? monthlyPaymentPartDtos.slice() : [];
      let f = 0;
      for (let y = 0; y < t.payload.number; y++) {
        d.push({
          amountString: t.payload.amount,
          amount: vt.parseFloatStringToNumber(t.payload.amount),
          date: be(t.payload.date, me).add(f, "month").format(me),
        });
        f += 1;
      }
      let h = 0;
      let g = Oe(
        u -
          (t?.payload?.isMultiPayment ? 0 : discountSum) -
          prePayment -
          (variation?.mortgagePrice || 0) -
          (e?.remainingAmount || 0),
        2
      );
      for (let y = 0; y < d.length; y++) {
        d[y] = {
          ...d[y],
          sum: g,
        };
        g = Oe(g - d[y].amount, 2);
        h = Oe(h + d[y].amount, 2);
      }
      if (g > 0 && (delay || 1) / (delayInterval || 1) === d.length) {
        const y = Oe(d[d.length - 1].amount + g, 2);
        d[d.length - 1].amount = y;
        d[d.length - 1].amountString = y.toLocaleString("ru");
        h = Oe(h + g, 2);
        g = 0;
      }
      e.firstPaymentDate = d[0].date;
      e.residueTablePayments = g;
      e.sumTablePayments = h;
      e.monthlyPaymentPartDtos = d;
    },
    deleteItemTable: (e, t) => {
      const {
        monthlyPaymentPartDtos,
        totalAmount,
        constTotalAmount,
        discountSum,
        prePayment,
        variation,
      } = current(e);
      const l = Oe(constTotalAmount || totalAmount, 2);
      const c = [];
      let u = 0;
      let d = Oe(
        l -
          (t?.payload?.isMultiPayment ? 0 : discountSum) -
          prePayment -
          (variation?.mortgagePrice || 0) -
          (e.remainingAmount || 0),
        2
      );
      if (Array.isArray(monthlyPaymentPartDtos)) {
        for (let f = 0; f < monthlyPaymentPartDtos.length; f++) {
          if (f !== t?.payload?.index) {
            c.push({
              ...monthlyPaymentPartDtos[f],
              sum: d,
            });
            d = Oe(d - monthlyPaymentPartDtos[f].amount, 2);
            u = Oe(u + monthlyPaymentPartDtos[f].amount, 2);
          }
        }
      }
      e.firstPaymentDate = c.length > 0 ? c[0].date : "";
      e.residueTablePayments = d;
      e.sumTablePayments = u;
      e.monthlyPaymentPartDtos = c;
    },
    clearMonthlyPaymentsTable: (e, t) => {
      const { totalAmount, constTotalAmount, discountSum, prePayment, variation } = current(e);
      const s = Oe(constTotalAmount || totalAmount, 2);
      e.monthlyPaymentPartDtos = [];
      e.residueTablePayments = Oe(
        s -
          (t?.payload?.isMultiPayment ? 0 : discountSum) -
          prePayment -
          (variation?.mortgagePrice || 0) -
          (e.remainingAmount || 0),
        2
      );
      e.sumTablePayments = 0;
      e.firstPaymentDate = "";
    },
    setCurrency: (e, t) => {
      const {
        currency,
        totalAmount,
        discountSum,
        prePayment,
        flats,
        constTotalAmount,
        remainingAmount,
      } = current(e);
      const c = [];
      flats.forEach((u) => {
        const terrace = u.flat.terrace
          ? {
              ...u.flat.terrace,
              pricePerArea: oe(currency, t.payload, u.flat.terrace?.pricePerArea || 0),
              pricePerAreaRepaired: oe(
                currency,
                t.payload,
                u.flat.terrace?.pricePerAreaRepaired || 0
              ),
            }
          : null;
        const discountNotRepairedList = [];
        const discountRepairedList = [];
        let discountNotRepaired = null;
        let discountRepaired = null;
        if (u.discountRepairedList.length > 0) {
          u.discountRepairedList.forEach((m) => {
            discountRepairedList.push({
              ...m,
              discountAmount: oe(currency, t.payload, m.discountAmount),
              firstPayment: oe(currency, t.payload, m.firstPayment),
              monthlyPayment: oe(currency, t.payload, m.monthlyPayment),
              total: oe(currency, t.payload, m.total),
            });
          });
        }
        if (u.discountNotRepairedList.length > 0) {
          u.discountNotRepairedList.forEach((m) => {
            discountNotRepairedList.push({
              ...m,
              discountAmount: oe(currency, t.payload, m.discountAmount),
              firstPayment: oe(currency, t.payload, m.firstPayment),
              monthlyPayment: oe(currency, t.payload, m.monthlyPayment),
              total: oe(currency, t.payload, m.total),
            });
          });
        }
        if (u.discountRepaired) {
          discountRepaired = {
            ...u.discountRepaired,
            discountAmount: oe(currency, t.payload, u.discountRepaired.discountAmount),
            firstPayment: oe(currency, t.payload, u.discountRepaired.firstPayment),
            monthlyPayment: oe(currency, t.payload, u.discountRepaired.monthlyPayment),
            total: oe(currency, t.payload, u.discountRepaired.total),
          };
        }
        if (u.discountNotRepaired) {
          discountNotRepaired = {
            ...u.discountNotRepaired,
            discountAmount: oe(currency, t.payload, u.discountNotRepaired.discountAmount),
            firstPayment: oe(currency, t.payload, u.discountNotRepaired.firstPayment),
            monthlyPayment: oe(currency, t.payload, u.discountNotRepaired.monthlyPayment),
            total: oe(currency, t.payload, u.discountNotRepaired.total),
          };
        }
        c.push({
          ...u,
          discountNotRepaired,
          discountRepaired,
          discountRepairedList,
          discountNotRepairedList,
          discountAmount: oe(currency, t.payload, u.discountAmount || 0),
          totalAmount: oe(currency, t.payload, u.totalAmount),
          pricePerAreaTerrace: oe(currency, t.payload, u.pricePerAreaTerrace || 0) || null,
          pricePerArea: oe(currency, t.payload, u.pricePerArea),
          firstPayment: oe(currency, t.payload, u.firstPayment),
          predictPrice: oe(currency, t.payload, u.predictPrice || 0),
          flat: {
            ...u.flat,
            pricePerArea: oe(currency, t.payload, u.flat.pricePerArea),
            terrace,
            prepayment: oe(currency, t.payload, u.flat.prepayment),
            price: oe(currency, t.payload, u.flat.price),
            priceRepaired: oe(currency, t.payload, u.flat.priceRepaired),
            pricePerAreaRepaired: oe(currency, t.payload, u.flat.pricePerAreaRepaired),
            priceNotRepaired: oe(currency, t.payload, u.flat.priceNotRepaired),
          },
        });
      });
      e.discountText = oe(currency, t.payload, discountSum)
        ? `${oe(currency, t.payload, discountSum)?.toLocaleString("ru")} ${t.payload?.ccy} ${xt.t(
            "contract.chegirma_qollanildi"
          )}`
        : "";
      e.flats = c;
      e.totalAmount = oe(currency, t.payload, totalAmount);
      e.constTotalAmount = oe(currency, t.payload, constTotalAmount);
      e.discountSum = oe(currency, t.payload, discountSum);
      e.prePayment = oe(currency, t.payload, prePayment);
      e.remainingAmount = oe(currency, t.payload, remainingAmount || 0);
      e.currency = t.payload;
      e.dealPrice = oe(currency, t.payload, totalAmount) - oe(currency, t.payload, discountSum);
    },
    setDealPrice: (e, t) => {
      e.dealPrice = t.payload;
    },
    setChangePartId: (e, t) => {
      e.discountId = t.payload;
    },
    clear: (e) => {
      if (ce.get("create-contract-v2")) {
        cv.actions.clear();
      } else {
        e.delay = 0;
        e.prePayment = 0;
        e.totalAmount = 0;
        e.constTotalAmount = 0;
        e.variation = undefined;
        e.flats = [];
        e.discountSum = 0;
        e.brokerId = Number(Tt?.id);
        e.employeeId = Number(Tt?.id);
        e.changeContractNumber = false;
        e.contractNumber = "";
        e.delayInterval = 1;
        e.fields = [];
        e.discountText = "";
        e.prepaymentDate = be(new Date()).format(me);
        e.prepaymentDisabledDate = undefined;
        e.firstPaymentDate = be(new Date()).add(1, "month").format(me);
        e.monthlyPaymentPartDtos = [];
        e.sumTablePayments = 0;
        e.residueTablePayments = 0;
        e.currency = undefined;
        e.useDiscount = false;
        e.termDiscount = undefined;
        e.remainingAmount = undefined;
        e.remainingPaymentDate = be(new Date()).format(me);
        e.calculatePrePayment = "BEFORE_DISCOUNT";
        e.realtorId = undefined;
        e.referralCode = "";
        e.sourceLeadId = null;
      }
    },
    setVariation: (e, t) => {
      e.variation = t.payload;
    },
    setTotalAmount: (e, t) => {
      e.constTotalAmount = t.payload.constAmount;
      e.totalAmount = t.payload.amount;
      e.dealPrice = t.payload.amount;
    },
    setTermDIscount: (e, t) => {
      e.termDiscount = t.payload;
    },
    setComment: (e, t) => {
      e.comment = t.payload;
    },
    setReferralCode: (e, t) => {
      e.referralCode = t.payload;
    },
    setRemainingAmount: (e, t) => {
      e.remainingAmount = t.payload;
    },
    setRemainingPaymentDate: (e, t) => {
      e.remainingPaymentDate = t.payload;
    },
    setCalculatePrepayment: (e, t) => {
      e.calculatePrePayment = t.payload;
    },
    setRealtorId: (e, t) => {
      e.realtorId = t.payload;
    },
    setBookingDiscount: (e, t) => {
      e.bookingDiscount.amount = t.payload.amount;
      e.bookingDiscount.flatId = t.payload.flatId;
    },
    setBookingPrepayment: (e, t) => {
      e.bookingPrepayment = t.payload;
    },
    setPrepaymentDisabledDate: (e, t) => {
      e.prepaymentDisabledDate = t.payload;
    },
    applyDiscountCalculator: (e, t) => {
      c1(e, t.payload);
    },
    setSourceLeadId: (e, t) => {
      e.sourceLeadId = t.payload;
    },
  },
});
const {
  applyDiscountCalculator,
  setOptionsContract,
  setFlats,
  changeRepairedStatus,
  changePricePerArea,
  changePricePerAreaTerrace,
  changePercentDiscount,
  setBroker,
  setDelay,
  setDelayInterval,
  setContractNumber,
  setCustomField,
  setPrePayment,
  changeDiscount,
  setDiscountText,
  setPrepaymentDate,
  setFirstPaymentDate,
  changeOnePaymentDate,
  setMonthlyPaymentPartDtos,
  changeOnePaymentAmount,
  addItemsTable,
  deleteItemTable,
  clearMonthlyPaymentsTable,
  setEmployee,
  clear,
  setClearOneFlatDiscount,
  changeOneFlatAmount,
  setCurrency,
  setCurrencyCompany,
  setChangePartId,
  setVariation,
  setTotalAmount,
  setTermDIscount,
  setComment,
  setReferralCode,
  setRemainingAmount,
  setRemainingPaymentDate,
  setOptionsContractV2,
  setCalculatePrepayment,
  setRealtorId,
  setBookingDiscount,
  setBookingPrepayment,
  setPrepaymentDisabledDate,
  setSourceLeadId,
} = f1.actions;
export { f1 };
