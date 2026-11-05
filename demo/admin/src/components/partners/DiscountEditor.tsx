import { Input, Segmented } from "antd";
import { formatNumber } from "@/utils/format-number";
import { DISCOUNT_TYPES, LIMITS } from "@/services/partners/constants";
import { discountLabel, upper } from "@/services/partners/format";
import { findIssue } from "@/services/partners/validation";
import { usePartnerEditor } from "@/components/partners/editor-context";
import { LabeledField } from "@/components/partners/fields";
import { PartnerFileImage } from "@/components/partners/fields";
import type { DiscountType, Issue, PartnerFormValues } from "@/services/partners/types";

const digitsOnly = (value: string) => value.replace(/\D/g, "");
const groupedAmount = (value: string) => (value ? formatNumber(Number(value)) : "");

// Discount editor (recovered from the build): percent / amount / free-text.
export const DiscountEditor = ({
  values,
  issues,
  serverError,
  onTypeChange,
  onValueChange,
  onTextChange,
}: {
  values: PartnerFormValues;
  issues: Issue[];
  serverError: string | null;
  onTypeChange: (type: DiscountType) => void;
  onValueChange: (value: string) => void;
  onTextChange: (value: string) => void;
}) => {
  const { lang, readOnly } = usePartnerEditor();
  const isText = values.discountType === "TEXT";
  const text = values.discountText[lang];
  const error = isText ? findIssue(issues, "discountText", lang) : findIssue(issues, "discountValue", lang);
  return (
    <LabeledField
      label="Chegirma"
      required
      note={isText ? `· ${upper(lang)}` : undefined}
      count={isText ? { value: text.trim().length, limit: LIMITS.discountText } : undefined}
      error={serverError ?? error}
    >
      <div className="flex flex-wrap gap-2">
        <Segmented value={values.discountType} options={DISCOUNT_TYPES} onChange={(v) => onTypeChange(v as DiscountType)} disabled={readOnly} />
        {isText ? (
          <Input
            className="min-w-40 flex-1"
            value={text}
            maxLength={LIMITS.discountText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={lang === "ru" ? "Бесплатно" : "Bepul"}
            readOnly={readOnly}
            aria-label={`Chegirma matni · ${upper(lang)}`}
          />
        ) : (
          <Input
            className="min-w-40 flex-1"
            inputMode="numeric"
            value={values.discountType === "AMOUNT" ? groupedAmount(values.discountValue) : values.discountValue}
            onChange={(e) => onValueChange(digitsOnly(e.target.value))}
            suffix={values.discountType === "PERCENT" ? "%" : "so‘m"}
            placeholder={values.discountType === "PERCENT" ? "15" : "1 000 000"}
            readOnly={readOnly}
            aria-label="Chegirma qiymati"
          />
        )}
      </div>
    </LabeledField>
  );
};

// In-app appearance preview (recovered from the build).
export const DiscountPreview = ({ values }: { values: PartnerFormValues }) => {
  const { lang } = usePartnerEditor();
  const pick = (ml: PartnerFormValues["condition"]) => ml[lang].trim() || (lang === "tg" ? ml.ru.trim() : "");
  const label = discountLabel({
    type: values.discountType,
    value: values.discountValue ? Number(values.discountValue) : null,
    text: { uz: pick(values.discountText), ru: "", tg: "" },
  });
  const condition = pick(values.condition);
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-surface-muted p-3">
      <p className="text-[11px] font-semibold text-content-muted">Ilovadagi ko‘rinish</p>
      <div className="flex items-center gap-2.5 rounded-xl bg-surface px-3 py-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-accent-soft text-[13px] font-semibold text-accent">
          <PartnerFileImage
            file={values.logo?.file ?? null}
            className="size-9"
            preview={false}
            fallback={<span>{values.name.trim().slice(0, 1).toUpperCase() || "Y"}</span>}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-[13px] font-semibold text-content">{values.name.trim() || "Hamkor nomi"}</p>
          {condition && <p className="truncate text-xs text-content-muted">{condition}</p>}
        </div>
        {label !== "—" && (
          <span className="inline-flex shrink-0 items-center rounded-full bg-primary px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-content-inverse tabular-nums">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
