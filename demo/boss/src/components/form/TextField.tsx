// TODO: inferred from build
// Input в сборке подключён из CJS-варианта antd/lib/input, поэтому не получает тему от ConfigProvider из antd.
import Input, { type InputProps } from "antd/lib/input";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

interface TextFieldProps<T extends FieldValues> extends Omit<InputProps, "name"> {
  error?: string;
  name: Path<T>;
  control: Control<T>;
  loading?: boolean;
}

export const TextField = <T extends FieldValues>({
  error,
  name,
  control,
  loading = false,
  ...props
}: TextFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <div className="flex flex-col gap-1">
        <label htmlFor={name}>{props.placeholder}</label>
        <Input {...field} {...props} disabled={props.disabled || loading} id={name} />
        {error && <div className="text-sm !text-red-600">{error}</div>}
      </div>
    )}
  />
);
