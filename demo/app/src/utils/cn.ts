// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (2)
import ne from "classnames";
import { extendTailwindMerge } from "tailwind-merge";
const wA = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-heading-xxlarge",
        "text-heading-xlarge",
        "text-heading-large",
        "text-heading-medium",
        "text-heading-small",
        "text-heading-xsmall",
        "text-heading-xxsmall",
        "text-paragraph-large",
        "text-paragraph",
        "text-paragraph-small",
        "text-metric-large",
        "text-metric-medium",
        "text-metric-small",
      ],
    },
  },
});
export const Wl = (...e) => wA(ne(...e));
