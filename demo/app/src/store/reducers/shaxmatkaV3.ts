// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  data: [],
  maxEntrance: 0,
  maxFloor: 0,
  minFloor: 0,
  maxXaxis: 0,
  floors: [],
};
const F1 = createSlice({
  name: "shaxmatkaV3",
  initialState,
  reducers: {
    setShaxmatkaV3: (e, t) => {
      e.data = t.payload;
    },
    setShaxmatkaV3Options: (e, t) => {
      e.maxEntrance = t.payload.maxEntrance;
      e.maxFloor = t.payload.maxFloor;
      e.minFloor = t.payload.minFloor;
      e.maxXaxis = t.payload.maxXaxis;
      e.floors = t.payload.floors;
    },
  },
});
const { setShaxmatkaV3: rte, setShaxmatkaV3Options: nte } = F1.actions;
export { F1 };
