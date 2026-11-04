// TODO: inferred from build
// Input в сборке подключён из CJS-варианта antd/lib/input, поэтому не получает тему от ConfigProvider из antd.
import Input, { type PasswordProps } from "antd/lib/input";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

interface PasswordFieldProps<T extends FieldValues> extends Omit<PasswordProps, "name"> {
  error?: string;
  name: Path<T>;
  control: Control<T>;
}

export const PasswordField = <T extends FieldValues>({
  error,
  name,
  control,
  ...props
}: PasswordFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <div className="flex flex-col gap-1">
        <label htmlFor={name}>{props.placeholder}</label>
        <Input.Password {...props} name={name} value={field.value} onChange={field.onChange} />
        {error && <div className="text-sm !text-red-600">{error}</div>}
      </div>
    )}
  />
);
