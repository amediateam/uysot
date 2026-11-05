import { PhoneInput as IntlPhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

// International phone field (recovered from the build — the bundle inlined
// react-international-phone; this uses the package directly). Defaults to Uzbekistan.
// TODO: inferred from build — exact mask set matches the library's own country data.
export const PhoneInput = ({
  value,
  onChange,
  placeholder,
  readOnly,
  id,
}: {
  value: string;
  onChange: (phone: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  id?: string;
}) => (
  <IntlPhoneInput
    defaultCountry="uz"
    value={value}
    onChange={(phone) => onChange(phone)}
    disabled={readOnly}
    inputProps={{ id, placeholder, readOnly }}
    className="uyim-phone-input"
  />
);
