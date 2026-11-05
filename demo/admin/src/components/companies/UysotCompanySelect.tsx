import { Spin } from "antd";
import { useMemo } from "react";
import { AppSelect } from "@/components/ui/AppSelect";
import { useUysotCompaniesInfinite } from "@/hooks/companies";
import type { UysotCompany } from "@/services/companies/types";

// Searchable, infinitely-scrolling Uysot company picker (recovered from the build).
const SCROLL_THRESHOLD = 48;

export const UysotCompanySelect = ({
  value,
  onChange,
  disabled,
  onPick,
}: {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  onPick?: (company: UysotCompany | undefined) => void;
}) => {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useUysotCompaniesInfinite(!disabled);

  const companies = useMemo(() => data?.pages.flatMap((page) => page.elements) ?? [], [data?.pages]);

  const options = useMemo(
    () =>
      companies.map((company) => ({
        value: company.companyId,
        label: `${company.name} · ${company.companyId}${company.linked ? " — qo‘shilgan" : ""}`,
        disabled: company.linked,
      })),
    [companies],
  );

  return (
    <AppSelect<number>
      showSearch
      value={value}
      disabled={disabled}
      loading={isLoading || isFetchingNextPage}
      options={options}
      optionFilterProp="label"
      placeholder="Kompaniyani tanlang"
      notFoundContent={isLoading ? <Spin size="small" /> : "Kompaniya topilmadi"}
      onChange={(next) => {
        onChange?.(next);
        onPick?.(companies.find((company) => company.companyId === next));
      }}
      onPopupScroll={(event) => {
        if (!hasNextPage || isFetchingNextPage) return;
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD) {
          fetchNextPage();
        }
      }}
    />
  );
};
