import { InputNumber } from "antd";
import type { InputNumberProps } from "antd";

// Currency input (recovered from the build): thousands-grouped, "so‘m" suffix.
const formatter = (value: string | number | undefined): string => {
  if (value === undefined || value === "") return "";
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const parser = (value: string | undefined): number => Number(value?.replace(/\s/g, "") ?? "");

export const SumInput = (props: InputNumberProps<number>) => (
  <InputNumber<number>
    formatter={formatter}
    parser={parser}
    suffix="so‘m"
    className="w-full"
    {...props}
  />
);
