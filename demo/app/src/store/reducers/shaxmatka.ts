// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice, current } from "@reduxjs/toolkit";
import { ce } from "@/utils/storage";
import { W } from "@/utils/round";
const initialState = {
  data: [],
  dataDelete: [],
  isLoading: false,
  priceCalculateType: "PER_AREA",
  tableMode: !!ce.get("shaxmatkaTableMode"),
  changeData: {},
  isChangeData: false,
  isChangeDataValidate: false,
  changeDataRequirets: {},
  isConfirmedSoldAndBookedChangedParameters: false,
};
const L1 = createSlice({
  name: "shaxmatka",
  initialState,
  reducers: {
    setShaxmatka: (e, t) => {
      e.data = t.payload;
    },
    setShaxmatkaDelete: (e, t) => {
      e.dataDelete = t.payload;
    },
    setShaxmatkaLoading: (e, t) => {
      e.isLoading = t.payload;
    },
    setPriceCalculateType: (e, t) => {
      e.priceCalculateType = t.payload || "PER_AREA";
      const { data } = current(e);
      const n = [];
      if (document.querySelectorAll(".selectableItems")) {
        document.querySelectorAll(".selectableItems").forEach((a) => {
          const o = JSON.parse(a.getAttribute("data"));
          n.push(o);
        });
      }
      const i = data.map((a) =>
        a.map((o) =>
          o.map((s) => {
            function l(c) {
              return (
                c && c.floor === s.floor && c.xaxis[0] === s.xaxis[0] && c.entrance === s.entrance
              );
            }
            if (n && n.some((c) => l(c))) {
              return {
                ...n.find((c) => l(c)),
                pricePerArea: t.payload ? s?.priceNotRepaired / s?.area : s?.pricePerArea,
                priceNotRepaired: t.payload ? s?.priceNotRepaired : s?.pricePerArea * s?.area,
                pricePerAreaRepaired: t.payload
                  ? s?.priceRepaired / s?.area
                  : s?.pricePerAreaRepaired,
                priceRepaired: t.payload ? s?.priceRepaired : s?.pricePerAreaRepaired * s?.area,
              };
            }
            return {
              ...s,
            };
          })
        )
      );
      e.data = i;
    },
    setTableMode: (e, t) => {
      e.tableMode = t.payload;
      ce.set("shaxmatkaTableMode", t.payload ? "true" : "");
    },
    setChangeData: (e, t) => {
      const { record, key, value } = t.payload;
      const a = {
        ...JSON.parse(JSON.stringify(record)),
        ...e?.changeData[record?.id],
      };
      const o = {
        "terrace.area": () => {
          a.terrace.area = value;
        },
        "terrace.pricePerAreaRepaired": () => {
          a.terrace.pricePerAreaRepaired = value;
        },
        "terrace.pricePerArea": () => {
          a.terrace.pricePerArea = value;
        },
      };
      if (key in a) {
        switch (key) {
          case "area":
            a.priceRepaired = W(value * a.pricePerAreaRepaired);
            a.priceNotRepaired = W(value * a.pricePerArea);
            a.area = value;
            break;
          case "pricePerArea":
            a.priceNotRepaired = W(value * a.area);
            a.pricePerArea = value;
            break;
          case "pricePerAreaRepaired":
            a.priceRepaired = W(value * a.area);
            a.pricePerAreaRepaired = value;
            break;
          case "priceNotRepaired":
            a.priceNotRepaired = value;
            a.pricePerArea = W(value / a.area);
            break;
          case "priceRepaired":
            a.priceRepaired = value;
            a.pricePerAreaRepaired = W(value / a.area);
            break;
          default:
            a[key] = value;
        }
      } else {
        if (!a?.terrace) {
          a.terrace = {
            area: undefined,
            pricePerAreaRepaired: undefined,
            pricePerArea: undefined,
          };
        }
        o[key]();
      }
      const s = (l) =>
        Object.values(l).reduce((acc, item) => {
          if (item) {
            if (typeof item === "object") {
              acc = `${acc}${s(item)}`;
            } else {
              acc = `${acc}${item}`;
            }
          }
          return acc;
        }, "");
      if (s(record || {}) === s(a || {})) {
        delete e.changeData[record?.id];
        delete e.changeDataRequirets[record?.id];
        if (Object.keys(e.changeData).length === 0) {
          e.isChangeData = false;
        }
        if (Object.keys(e.changeDataRequirets).length === 0) {
          e.isChangeDataValidate = false;
        }
      } else {
        const l =
          (a.terrace?.area && (a.terrace?.pricePerArea || a.terrace?.pricePerAreaRepaired)) ||
          (!a.terrace?.area && !a.terrace?.pricePerArea && !a.terrace?.pricePerAreaRepaired);
        const c = [
          ...(a?.terrace && !l
            ? ["terrace.area", "terrace.pricePerArea", "terrace.pricePerAreaRepaired"]
            : []),
          ...(a?.entrance ? [] : ["entrance"]),
        ];
        if (c.length > 0) {
          e.changeDataRequirets[record?.id] = c;
          e.isChangeDataValidate = true;
        } else {
          delete e.changeDataRequirets[record?.id];
          if (Object.keys(e.changeDataRequirets).length === 0) {
            e.isChangeDataValidate = false;
          }
        }
        e.isChangeData = true;
        e.changeData[record?.id] = a;
      }
    },
    setIsConfirmedSoldAndBookedChangedParameters: (e, t) => {
      e.isConfirmedSoldAndBookedChangedParameters = t.payload;
    },
    changeDataClear: (e) => {
      e.changeData = {};
      e.changeDataRequirets = {};
      e.isChangeData = false;
      e.isChangeDataValidate = false;
    },
  },
});
const {
  setShaxmatka: Yee,
  setShaxmatkaDelete: Kee,
  setShaxmatkaLoading: Xee,
  setPriceCalculateType: Jee,
  setTableMode: Qee,
  setChangeData: Zee,
  changeDataClear: ete,
  setIsConfirmedSoldAndBookedChangedParameters: tte,
} = L1.actions;
export { L1 };
