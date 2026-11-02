// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (8)
const nF = [
  "#FFA12F",
  "#FFC682",
  "#0AB4FF",
  "#75D5FF",
  "#7B68EE",
  "#A799FF",
  "#1DB954",
  "#62FF99",
  "#F900EA",
  "#FF8BF8",
  "#F42C2C",
  "#FF7E7E",
  "#2C2DA0",
  "#8D8FFF",
  "#00A389",
  "#00DDBA",
  "#FF5722",
  "#FF9C7D",
];
const iF = (e, t) => {
  const r = parseInt(e.slice(1), 16);
  return `#${[(r >> 16) & 255, (r >> 8) & 255, r & 255]
    .map((i) =>
      Math.round(i + (255 - i) * t)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")
    .toUpperCase()}`;
};
nF.map((e) => iF(e, 0.72));
const aF = {
  orange: {
    500: "#FF4405",
  },
};
const me = "DD.MM.YYYY";
const Aa = "DD.MM.YYYY HH:mm";
const Cy = [
  2201, 1701, 1800, 2201, 1300, 1900, 1000, 1101, 1100, 1301, 1100, 1101, 1101, 1102, 1100, 1001,
  1001, 1200, 1201, 1201, 1201, 1201, 2000, 1401, 1301, 2900, 1800, 1800, 1800, 3300, 1001, 1800,
  3900, 1600, 1601, 1602, 1603, 1604, 1800, 1609, 1611, 1526,
];
const kn = {
  CODE_KEY: "VAQTI SOATING KELGANDA JAVOB BERASAN",
};
export { Aa, Cy, aF, kn, me };
