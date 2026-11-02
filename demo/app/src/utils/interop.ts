// Аналог rollup-хелпера getDefaultExportFromCjs
export const getDefaultExportFromCjs = (x: any) =>
  x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x.default : x;
