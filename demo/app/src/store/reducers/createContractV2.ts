// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (8)
import { createSlice, current } from "@reduxjs/toolkit";
import { W } from "@/utils/round";
import { Yc, Hr, ha } from "@/utils/payment-schedule";
import xt from "i18next";
import { Ti } from "@/components/toaster/state";
import be from "dayjs";
import { me } from "@/constants/index";
import { Oe, oe, c1 } from "@/utils/contract-calc";
import { vt } from "@/utils/helpers";
import { Tt } from "@/utils/current-user";
import { ce } from "@/utils/storage";
const p8 = ({ constTotalAmount, discountSum, calculatePrePayment }) => {
  const n = constTotalAmount || 0;
  const i = Yc(n, discountSum);
  return (calculatePrePayment === "BEFORE_DISCOUNT" ? n : i) || 1;
};
const u1 = (e) => W((e.prePayment / p8(e)) * 100);
const d1 = (e) => {
  if (e.fullPrepayment) {
    return true;
  }
  return u1(e) === 100;
};
const Ui = (e) => {
  if (d1(e)) {
    return 100;
  }
  return u1(e);
};
const v8 = ({
  prePayment,
  constTotalAmount,
  discountSum,
  calculatePrePayment,
  currentFullPrepayment,
  explicitFullPrepayment,
}) => {
  if (explicitFullPrepayment === true) {
    return true;
  }
  if (explicitFullPrepayment === false) {
    return false;
  }
  if (
    d1({
      constTotalAmount,
      discountSum,
      calculatePrePayment,
      prePayment,
    })
  ) {
    return true;
  }
  const o = Yc(constTotalAmount, discountSum);
  return !!(currentFullPrepayment && W(prePayment) >= W(o));
};
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
  fullPrepayment: false,
  referralCode: "",
  sourceLeadId: null,
  v2: ce.get("create-contract-v2") ?? false,
};
const cv = createSlice({
  name: "createContractV2",
  initialState,
  reducers: {
    setCurrencyCompany: (e, t) => {
      e.currencyCompany = t.payload;
    },
    setFlats: (e, t) => {
      const r = t.payload.map((l) => l.flat.id).join(",");
      const n = e.flats.map((l) => l.flat.id).join(",");
      if (e.flats.length !== 0 && r === n) {
        return;
      }
      let i = 0;
      let a = 0;
      let o = 0;
      const s = [];
      t.payload.forEach((l) => {
        const { repaired } = l.flat;
        const isCanChangeRepaired = !!(l.flat.priceRepaired && l.flat.priceNotRepaired);
        const pricePerAreaTerrace = repaired
          ? l.flat.terrace?.pricePerAreaRepaired || null
          : l.flat.terrace?.pricePerArea || null;
        const pricePerArea = repaired ? l.flat.pricePerAreaRepaired : l.flat.pricePerArea;
        o = W(o + l.flat.prepayment);
        if (a < l.flat.delay) {
          a = l.flat.delay;
        }
        const h = repaired ? l.flat.priceRepaired : l.flat.priceNotRepaired;
        i = W(i + h);
        let g = 0;
        if (repaired && l.discountRepaired) {
          g = l.discountRepaired.discount;
        } else if (l.discountNotRepaired) {
          g = l.discountNotRepaired.discount;
        }
        s.push({
          ...l,
          firstPayment: l.flat.prepayment,
          repaired,
          totalAmount: h,
          isChangePricePerArea: false,
          isCanChangeRepaired,
          discountAmount: 0,
          discountPercent: g,
          pricePerAreaTerrace,
          pricePerArea,
        });
      });
      e.flats = s;
      e.currency = s[0]?.flat?.currency;
      e.prePayment = o;
      e.delay = a;
      e.totalAmount = i;
      e.constTotalAmount = i;
      e.delayInterval = 1;
      e.discountText = "";
      e.useDiscount = false;
      e.fullPrepayment = W((o / (i || 1)) * 100) === 100;
      e.dealPrice = i - e.discountSum;
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
      const constTotalAmount = e.constTotalAmount || e.totalAmount;
      const n = v8({
        prePayment: t.payload.prePayment,
        constTotalAmount,
        discountSum: e.discountSum,
        calculatePrePayment: e.calculatePrePayment,
        currentFullPrepayment: e.fullPrepayment,
        explicitFullPrepayment: t.payload.fullPrepayment,
      });
      e.delay = t.payload.delay;
      e.fullPrepayment = n;
      e.prePayment = n ? Yc(constTotalAmount, e.discountSum) : t.payload.prePayment;
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
      const i = Ui({
        constTotalAmount: e.constTotalAmount,
        discountSum: e.discountSum,
        calculatePrePayment: e.calculatePrePayment,
        prePayment: e.prePayment,
        fullPrepayment: e.fullPrepayment,
      });
      e.flats.forEach((a) => {
        if (a.flat.id === t.payload.id) {
          a.discountAmount !== 0 &&
            (a.repaired
              ? (a.pricePerArea !== a.flat.pricePerAreaRepaired &&
                  (a.flat.pricePerAreaRepaired - a.pricePerArea) * a.flat.area,
                a.flat.terrace &&
                  ((a.flat.terrace.pricePerAreaRepaired || 0) - (a.pricePerAreaTerrace || 0)) *
                    (a?.flat?.terrace?.area || 0))
              : (a.pricePerArea !== a.flat.pricePerArea &&
                  (a.flat.pricePerArea - a.pricePerArea) * a.flat.area,
                a.flat.terrace &&
                  ((a.flat.terrace.pricePerArea || 0) - (a.pricePerAreaTerrace || 0)) *
                    (a?.flat?.terrace?.area || 0)));
          if (a.repaired) {
            n = W(n + (a.flat.pricePerAreaRepaired - t.payload.amount) * a.flat.area);
            r.push({
              ...a,
              discountAmount: W((a.flat.pricePerAreaRepaired - t.payload.amount) * a.flat.area),
              discountPercent: 0,
              pricePerArea: t.payload.amount,
            });
          } else {
            n = W(n + (a.flat.pricePerArea - t.payload.amount) * a.flat.area);
            r.push({
              ...a,
              discountAmount: W((a.flat.pricePerArea - t.payload.amount) * a.flat.area),
              discountPercent: 0,
              pricePerArea: t.payload.amount,
            });
          }
        } else {
          n = W(n + (a.discountAmount || 0));
          r.push(a);
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
        prepaymentPercent: i,
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
      const i = Ui({
        constTotalAmount: e.constTotalAmount,
        discountSum: e.discountSum,
        calculatePrePayment: e.calculatePrePayment,
        prePayment: e.prePayment,
        fullPrepayment: e.fullPrepayment,
      });
      e.flats.forEach((a) => {
        if (a.flat.id === t.payload.id && a.flat.terrace) {
          let o = 0;
          if (a.discountAmount !== 0) {
            if (a.repaired) {
              if (a.pricePerAreaTerrace !== a.flat?.terrace?.pricePerAreaRepaired) {
                const l =
                  ((a.flat.terrace?.pricePerAreaRepaired || 0) - (a?.pricePerAreaTerrace || 0)) *
                  (a?.flat?.terrace?.area || 0);
                o = W(l);
              }
              const s = (a.flat.pricePerAreaRepaired - a.pricePerArea) * a.flat.area;
              o = W(s + o);
            } else {
              if (a.pricePerAreaTerrace !== a.flat.terrace.pricePerArea) {
                const l =
                  ((a.flat.terrace?.pricePerArea || 0) - (a?.pricePerAreaTerrace || 0)) *
                  (a?.flat?.terrace?.area || 0);
                o = W(l);
              }
              const s = (a.flat.pricePerArea - a.pricePerArea) * a.flat.area;
              o = W(s + o);
            }
          }
          if (a.repaired) {
            n = W(
              n +
                o +
                ((a.flat.terrace?.pricePerAreaRepaired || 0) - t.payload.amount) *
                  (a.flat.terrace?.area || 0)
            );
            r.push({
              ...a,
              discountAmount: W(
                o +
                  ((a.flat.terrace?.pricePerAreaRepaired || 0) - t.payload.amount) *
                    (a.flat.terrace?.area || 0)
              ),
              discountPercent: 0,
              pricePerAreaTerrace: t.payload.amount,
            });
          } else {
            n = W(
              n +
                o +
                ((a.flat.terrace?.pricePerArea || 0) - t.payload.amount) *
                  (a.flat.terrace?.area || 0)
            );
            r.push({
              ...a,
              discountAmount: W(
                o +
                  ((a.flat.terrace?.pricePerArea || 0) - t.payload.amount) *
                    (a.flat.terrace?.area || 0)
              ),
              discountPercent: 0,
              pricePerAreaTerrace: t.payload.amount,
            });
          }
        } else {
          n = W(n + (a.discountAmount || 0));
          r.push(a);
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
        prepaymentPercent: i,
      });
      e.flats = r;
      e.discountSum = n;
      e.dealPrice = (e.constTotalAmount || e.totalAmount) - n;
      e.remainingAmount = undefined;
    },
    changePercentDiscount: (e, t) => {
      const r = [];
      let { discountSum } = e;
      let i = Ui({
        constTotalAmount: e.constTotalAmount,
        discountSum,
        calculatePrePayment: e.calculatePrePayment,
        prePayment: e.prePayment,
        fullPrepayment: e.fullPrepayment,
      });
      e.flats.forEach((a) => {
        if (a.flat.id === t.payload) {
          const s = (a?.repaired ? a?.discountRepairedList : a?.discountNotRepairedList)?.find(
            (l) => l?.discount === a?.discountPercent
          );
          i = s?.percent || i;
          if (a.discountAmount === 0) {
            const l = s?.discountAmount || 0;
            discountSum = W(discountSum + l);
            r.push({
              ...a,
              discountAmount: l,
            });
          } else {
            discountSum = W(discountSum - (a.discountAmount || 0));
            r.push({
              ...a,
              discountAmount: 0,
            });
          }
        } else {
          r.push(a);
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
        prepaymentPercent: i,
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
      const i = Ui({
        constTotalAmount: e.constTotalAmount,
        discountSum: e.discountSum,
        calculatePrePayment: e.calculatePrePayment,
        prePayment: e.prePayment,
        fullPrepayment: e.fullPrepayment,
      });
      e.flats.forEach((a) => {
        if (a.flat.id === t.payload.id) {
          const o = a.firstPayment;
          const s = a.repaired ? a.discountRepairedList : a.discountNotRepairedList;
          const l = W(a.totalAmount - t.payload.amount);
          e_discountSum = W(e_discountSum + l - (a.discountAmount || 0));
          let c = 0;
          if (s.length > 0) {
            for (let u = 0; u < s.length; u++) {
              if (u + 1 === s.length && o >= s[u].firstPayment) {
                c = W(s[u].discount);
              } else if (s[u].firstPayment <= o && s[u + 1].firstPayment > o) {
                c = W(s[u].discount);
                break;
              }
            }
          }
          r.push({
            ...a,
            discountAmount: l,
            discountPercent: l === 0 ? c : 0,
            totalAmount: a.repaired ? a.flat.priceRepaired : a.flat.priceNotRepaired,
            pricePerArea: a.repaired ? a.flat.pricePerAreaRepaired : a.flat.pricePerArea,
            firstPayment: a.flat.prepayment,
            isChangePricePerArea: false,
            pricePerAreaTerrace: a.repaired
              ? a.flat.terrace?.pricePerAreaRepaired || null
              : a.flat.terrace?.pricePerArea || null,
          });
        } else {
          r.push(a);
        }
      });
      e.prePayment = Hr({
        constTotalAmount: e.constTotalAmount,
        totalAmount: e.totalAmount,
        discountSum: e_discountSum,
        calculatePrePayment: e.calculatePrePayment,
        prepaymentPercent: i,
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
      const i = Ui({
        constTotalAmount: e.constTotalAmount,
        discountSum: e.discountSum,
        calculatePrePayment: e.calculatePrePayment,
        prePayment: e.prePayment,
        fullPrepayment: e.fullPrepayment,
      });
      e.flats.forEach((o) => {
        if (o.flat.id === t.payload) {
          const s = o.firstPayment;
          const l = o.repaired ? o.discountRepairedList : o.discountNotRepairedList;
          let c = 0;
          if (l.length > 0) {
            for (let u = 0; u < l.length; u++) {
              if (
                (u + 1 === l.length && l[u]?.month === e.delay && s >= l[u].firstPayment) ||
                (l[u].firstPayment <= s && l[u]?.month === e.delay && l[u + 1].firstPayment > s) ||
                (l[u].firstPayment <= s &&
                  l[u]?.month === e.delay &&
                  l[u + 1].firstPayment === l[u]?.firstPayment)
              ) {
                c = W(l[u].discount);
              }
            }
          }
          n = o.discountAmount || 0;
          r.push({
            ...o,
            discountAmount: 0,
            discountPercent: c,
            totalAmount: o.repaired ? o.flat.priceRepaired : o.flat.priceNotRepaired,
            pricePerArea: o.repaired ? o.flat.pricePerAreaRepaired : o.flat.pricePerArea,
            isChangePricePerArea: false,
            pricePerAreaTerrace: o.repaired
              ? o.flat.terrace?.pricePerAreaRepaired || null
              : o.flat.terrace?.pricePerArea || null,
          });
        } else {
          r.push(o);
        }
      });
      e.discountText = W(e.discountSum - n)
        ? `${W(e.discountSum - n)?.toLocaleString("ru")} ${e?.currency?.ccy} ${xt.t(
            "contract.chegirma_qollanildi"
          )}`
        : "";
      e.flats = r;
      const a = W(e.discountSum - n);
      e.prePayment = Hr({
        constTotalAmount: e.constTotalAmount,
        totalAmount: e.totalAmount,
        discountSum: a,
        calculatePrePayment: e.calculatePrePayment,
        prepaymentPercent: i,
      });
      e.discountSum = a;
      e.dealPrice = (e.constTotalAmount || e.totalAmount) - a;
      e.remainingAmount = undefined;
    },
    changeDiscount: (e, t) => {
      const r = [];
      const amount = t.payload.amount;
      const i = Ui({
        constTotalAmount: e.constTotalAmount || e.totalAmount,
        discountSum: e.discountSum,
        calculatePrePayment: e.calculatePrePayment,
        prePayment: e.prePayment,
        fullPrepayment: e.fullPrepayment,
      });
      const a = () => {
        let o = 0;
        const s = e.flats?.map((l) => {
          const c = parseFloat(
            ((l?.totalAmount / (e.constTotalAmount || e.totalAmount)) * amount).toFixed(2)
          );
          o += c;
          return c;
        });
        if (o !== amount) {
          s[s.length - 1] += parseFloat((amount - o).toFixed(2));
        }
        return s;
      };
      e.flats.forEach((o, s) => {
        const discountPercent = W((a()[s] * 100) / o?.totalAmount);
        if (o.repaired) {
          r.push({
            ...o,
            repaired: !t.payload.changeRepairedStatus,
            discountAmount: a()[s],
            discountPercent,
            totalAmount: o.flat?.priceRepaired,
            pricePerArea: o.flat?.pricePerAreaRepaired,
            pricePerAreaTerrace: o.flat?.terrace?.pricePerAreaRepaired || null,
            isChangePricePerArea: false,
            firstPayment: o.flat.prepayment,
          });
        } else {
          r.push({
            ...o,
            repaired: t.payload.changeRepairedStatus,
            discountAmount: a()[s],
            discountPercent,
            totalAmount: o.flat?.priceNotRepaired,
            pricePerArea: o.flat?.pricePerArea,
            pricePerAreaTerrace: o.flat?.terrace?.pricePerArea || null,
            isChangePricePerArea: false,
            firstPayment: o.flat.prepayment,
          });
        }
      });
      e.flats = r;
      e.useDiscount = false;
      e.discountSum = t.payload.amount || 0;
      e.dealPrice = (e.constTotalAmount || e.totalAmount) - (t.payload.amount || 0);
      e.prePayment = Hr({
        constTotalAmount: e.constTotalAmount,
        totalAmount: e.totalAmount,
        discountSum: e.discountSum,
        calculatePrePayment: e.calculatePrePayment,
        prepaymentPercent: i,
      });
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
      e.referralCode = "";
      e.fullPrepayment = false;
      e.referralCode = "";
      e.sourceLeadId = null;
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
    setHomeIdV2: (e, t) => {
      e.v2 = t.payload;
      ce.set("create-contract-v2", String(t.payload));
    },
    setPrepaymentDisabledDate: (e, t) => {
      e.prepaymentDisabledDate = t.payload;
    },
    applyDiscountCalculator: (e, t) => {
      c1(e, t.payload);
      e.fullPrepayment = W(e.prePayment) >= W(e.dealPrice);
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
  setHomeIdV2,
  setPrepaymentDisabledDate,
  setSourceLeadId,
} = cv.actions;
export { cv };
