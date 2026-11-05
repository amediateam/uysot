import { Select } from "antd";
import type { SelectProps } from "antd";

// Select with clear enabled by default (recovered from the build).
export const AppSelect = <ValueType = unknown,>(props: SelectProps<ValueType>) => (
  <Select<ValueType> allowClear {...props} />
);
