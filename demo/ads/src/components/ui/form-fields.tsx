import { Input, Select, Switch } from "antd";
import type { SelectProps, SwitchProps } from "antd";
import type { InputProps } from "antd/es/input";
import type { PasswordProps } from "antd/es/input/Password";
import cn from "classnames";
import type { ReactNode } from "react";
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import { Icon } from "@/components/ui/Icon";
import { useUploadImage } from "@/services/banners/hooks";

// Labeled react-hook-form field wrapper (recovered from the build): renders a label and
// the control, plus an inline error message.
export const Field = <T extends FieldValues>({
  control,
  name,
  label = "",
  labelClassName,
  className,
  rules,
  children,
}: {
  control: Control<T>;
  name: Path<T>;
  label?: ReactNode;
  labelClassName?: string;
  className?: string;
  rules?: Omit<RegisterOptions<T, Path<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
  children: (field: ControllerRenderProps<T, Path<T>>, error: string) => ReactNode;
}) => (
  <Controller
    control={control}
    name={name}
    rules={rules}
    render={({ field, fieldState }) => {
      const error = fieldState.error?.message || "";
      return (
        <div className={cn("flex flex-col gap-1 w-full", className)}>
          {label && (
            <label htmlFor={name} className={cn("text-[14px] font-normal text-gray-700", labelClassName)}>
              {label} :
            </label>
          )}
          {children(field, error)}
          {error && <div className="text-[12px] !text-red-600">{error}</div>}
        </div>
      );
    }}
  />
);

type FieldBase<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: ReactNode;
  labelClassName?: string;
  disabled?: boolean;
  loading?: boolean;
  rules?: Omit<RegisterOptions<T, Path<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
};

export const TextField = <T extends FieldValues>({
  control,
  name,
  label,
  labelClassName,
  disabled,
  loading = false,
  rules,
  ...rest
}: FieldBase<T> & Omit<InputProps, "name">) => (
  <Field control={control} name={name} label={label} labelClassName={labelClassName} rules={rules}>
    {(field, error) => (
      <Input
        {...rest}
        {...field}
        value={field.value || undefined}
        id={name}
        className={cn("field", rest.className)}
        status={error ? "error" : undefined}
        disabled={disabled || field.disabled || loading}
      />
    )}
  </Field>
);

export const PasswordField = <T extends FieldValues>({
  control,
  name,
  label,
  labelClassName,
  disabled,
  loading = false,
  rules,
  ...rest
}: FieldBase<T> & Omit<PasswordProps, "name">) => (
  <Field control={control} name={name} label={label} labelClassName={labelClassName} rules={rules}>
    {(field, error) => (
      <Input.Password
        {...rest}
        {...field}
        id={name}
        status={error ? "error" : undefined}
        disabled={disabled || field.disabled || loading}
      />
    )}
  </Field>
);

export const SwitchField = <T extends FieldValues>({
  control,
  name,
  label,
  labelClassName,
  disabled,
  loading,
  className,
  rules,
  ...rest
}: FieldBase<T> & Omit<SwitchProps, "name"> & { className?: string }) => (
  <Field control={control} name={name} label={label} labelClassName={labelClassName} className={className} rules={rules}>
    {(field) => (
      <Switch
        {...rest}
        checked={!!field.value}
        onChange={field.onChange}
        disabled={disabled || field.disabled || loading}
      />
    )}
  </Field>
);

export const SelectField = <T extends FieldValues>({
  control,
  name,
  label,
  labelClassName,
  disabled,
  loading,
  children,
  rules,
  ...rest
}: FieldBase<T> & Omit<SelectProps, "name"> & { children?: ReactNode }) => (
  <Field control={control} name={name} label={label} labelClassName={labelClassName} rules={rules}>
    {(field, error) => (
      <Select
        {...rest}
        {...field}
        value={field.value || undefined}
        id={name}
        className={cn("field", rest.className)}
        status={error ? "error" : undefined}
        disabled={disabled || field.disabled || loading}
        suffixIcon={<Icon name="chevronLeft" />}
      >
        {children}
      </Select>
    )}
  </Field>
);

SelectField.Option = Select.Option;

// Image upload field (recovered from the build): uploads via /api/dev/image/upload and
// stores the returned file (optionally keeping the raw File for the logo).
export const ImageUploadField = <T extends FieldValues>({
  control,
  name,
  label,
  labelClassName,
  disabled,
  loading,
  children,
  fileListRender,
  isNotShouldBeUploaded,
  language_id,
  rules,
  className,
}: FieldBase<T> & {
  children?: ReactNode;
  fileListRender?: (value: unknown) => ReactNode;
  isNotShouldBeUploaded?: boolean;
  language_id?: number;
  className?: string;
}) => {
  const upload = useUploadImage();
  return (
    <Field control={control} name={name} label={label} labelClassName={labelClassName} rules={rules}>
      {(field) => (
        <div key={name} className="flex flex-col gap-4">
          <label htmlFor={name} className="rounded-xl cursor-pointer">
            <input
              type="file"
              id={name}
              className={cn("field h-auto hidden", className)}
              disabled={disabled || field.disabled || loading}
              onChange={(event) => {
                const file = event.target?.files?.[0];
                if (!file) return;
                if (isNotShouldBeUploaded) {
                  field.onChange(file);
                } else {
                  const body = new FormData();
                  body.append("file", file);
                  upload.mutateAsync(body).then((result) => field.onChange({ ...result, language_id }));
                }
              }}
            />
            {children}
          </label>
          {field.value && fileListRender && fileListRender(field.value)}
        </div>
      )}
    </Field>
  );
};
