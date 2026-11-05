import { Input } from "antd";
import { forwardRef } from "react";
import type { InputProps, InputRef, TextAreaProps } from "antd/es/input";
import type { PasswordProps } from "antd/es/input/Password";

// App input primitives (recovered from the build): thin passthroughs over antd Input.
// They exist so the app imports a single input vocabulary; styling comes from the antd
// theme (see theme/antd-theme.ts).
export const TextInput = forwardRef<InputRef, InputProps>((props, ref) => <Input ref={ref} {...props} />);
TextInput.displayName = "TextInput";

export const PasswordInput = forwardRef<InputRef, PasswordProps>((props, ref) => (
  <Input.Password ref={ref} {...props} />
));
PasswordInput.displayName = "PasswordInput";

export const TextArea = (props: TextAreaProps) => <Input.TextArea {...props} />;

export { Input };
