// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import be from "dayjs";
import { me } from "@/constants/index";
import { W } from "@/utils/round";
import { Oe } from "@/utils/contract-calc";
const ha = (e, t, r, n) => {
  const i = be(t, me);
  const a = r / n;
  let o = 0;
  let s = 0;
  const l = [];
  for (let c = 0; c < a; c++) {
    if (c === (a || 0) - 1) {
      l.push({
        date: be(i).add(o, "month").format(me),
        amount: W(e - s),
        sum: W(e - s),
        amountString: Oe(e - s, 0).toLocaleString("ru"),
      });
    } else {
      const amount = Oe(e / a, 0);
      l.push({
        amount,
        sum: W(e - s),
        date: be(i).add(o, "month").format(me),
        amountString: amount.toLocaleString("ru"),
      });
      s += amount;
    }
    o += n || 1;
  }
  return l;
};
const Yc = (e, t) => W((e || 0) - (t || 0));
const Hr = ({
  constTotalAmount,
  totalAmount,
  discountSum,
  calculatePrePayment,
  prepaymentPercent,
}) => {
  const o = Yc(constTotalAmount || totalAmount, discountSum);
  if (prepaymentPercent === 100) {
    return o;
  }
  return W(
    calculatePrePayment === "BEFORE_DISCOUNT"
      ? (totalAmount / 100) * prepaymentPercent
      : (o / 100) * prepaymentPercent
  );
};
export { Hr, Yc, ha };
