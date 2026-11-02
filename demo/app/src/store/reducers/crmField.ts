// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (3)
import { createSelector } from "@reduxjs/toolkit";
const b8 = (e) => !!e?.systemKey;
const S8 = (e) => (e ?? []).filter((t) => !b8(t));
createSelector(
  (e) => e.crmField.led,
  (e) => S8(e)
);
