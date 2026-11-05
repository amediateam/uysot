import { Input } from "antd";

// Debounce-friendly search box (recovered from the build): antd Input.Search with clear.
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder,
  label,
  className = "w-full sm:w-80",
}: SearchInputProps) => (
  <Input.Search
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    aria-label={label ?? placeholder}
    allowClear
    className={className}
  />
);
