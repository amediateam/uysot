// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { W } from "@/utils/round";
function Oe(e, t) {
  const r = 10 ** (t || 0);
  return Math.round(e * r) / r;
}
const c1 = (e, t) => {
  const r = new Map(t.flats.map((o) => [o.flatId, o]));
  let n = 0;
  let i = 0;
  const a = e.flats.map((o) => {
    const s = r.get(o.flat.id);
    const repaired = s?.repaired ?? o.repaired;
    const totalAmount = repaired ? o.flat.priceRepaired : o.flat.priceNotRepaired;
    const discountAmount = W(s?.discountAmount || 0);
    n = W(n + totalAmount);
    i = W(i + discountAmount);
    return {
      ...o,
      repaired,
      totalAmount,
      discountAmount,
      discountPercent: 0,
      isChangePricePerArea: false,
      pricePerArea: repaired ? o.flat.pricePerAreaRepaired : o.flat.pricePerArea,
      pricePerAreaTerrace: repaired
        ? o.flat.terrace?.pricePerAreaRepaired || null
        : o.flat.terrace?.pricePerArea || null,
    };
  });
  e.flats = a.map((o) => ({
    ...o,
    firstPayment: W((o.totalAmount / (n || 1)) * t.prePayment),
  }));
  e.totalAmount = n;
  e.constTotalAmount = n;
  e.discountSum = i;
  e.dealPrice = n - i;
  e.prePayment = t.prePayment;
  e.delay = t.delay;
  e.delayInterval = 1;
  e.discountText = t.discountText;
  e.useDiscount = false;
  e.remainingAmount = undefined;
  e.termDiscount = undefined;
};
const oe = (e, t, r) => Oe(((e?.value || 1) * r) / (t?.value || 1), 16);
export { Oe, c1, oe };
