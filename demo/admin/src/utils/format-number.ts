// Number formatting (recovered from the build): grouped with non-breaking spaces, em-dash
// for nullish/NaN.
export const formatNumber = (value: number | null | undefined): string => {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }
  return value.toLocaleString("ru-RU").replace(/\s/g, " ");
};
