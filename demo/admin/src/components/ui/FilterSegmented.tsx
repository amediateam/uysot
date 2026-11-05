import { Segmented } from "antd";
import type { SegmentedProps } from "antd";

// Thin wrapper over antd Segmented used for list filters (recovered from the build).
interface FilterSegmentedProps<T extends string | number> {
  value: T;
  options: SegmentedProps<T>["options"];
  onChange: (value: T) => void;
  label?: string;
}

export const FilterSegmented = <T extends string | number>({
  value,
  options,
  onChange,
  label,
}: FilterSegmentedProps<T>) => (
  <div role="group" aria-label={label}>
    <Segmented<T> value={value} options={[...(options ?? [])]} onChange={onChange} />
  </div>
);
