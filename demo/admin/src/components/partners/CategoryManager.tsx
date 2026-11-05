import { HolderOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Input, Skeleton } from "antd";
import { useState } from "react";
import { ApiErrorCode } from "@/constants/api-error-codes";
import { isApiError } from "@/services/api-error";
import { useApiMessage } from "@/hooks/use-api-message";
import {
  useCategories,
  useDeleteCategory,
  usePartnersQuery,
  useReorderCategories,
  useSaveCategory,
} from "@/hooks/partners";
import { LANGUAGES, LIMITS, REQUIRED_LANGUAGES } from "@/services/partners/constants";
import { emptyMl, toMl, trimMl, upper } from "@/services/partners/format";
import { useReorder } from "@/components/partners/useReorder";
import { AppModal } from "@/components/ui/AppModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { StatusChip } from "@/components/ui/StatusChip";
import { RowActions } from "@/components/ui/RowActions";
import { LabeledField } from "@/components/partners/fields";
import type { Ml, PartnerCategory } from "@/services/partners/types";

// Optimistic reorder: locally reorder, persist changed rows, revert via refetch on error.
const useCategoryReorder = (categories: PartnerCategory[]) => {
  const toast = useApiMessage();
  const { mutate } = useReorderCategories();
  const [override, setOverride] = useState<PartnerCategory[] | null>(null);
  const list = override ?? categories;
  const drag = useReorder((from, to) => {
    const next = [...list];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const resorted = next.map((category, sortOrder) => ({ ...category, sortOrder }));
    const changed = resorted.filter((c) => list.find((o) => o.id === c.id)?.sortOrder !== c.sortOrder);
    if (changed.length === 0) return;
    setOverride(resorted);
    mutate(changed, { onError: (error) => toast.error(error), onSettled: () => setOverride(null) });
  });
  return { list, drag };
};

const CategoryForm = ({
  category,
  nextSortOrder,
  onClose,
}: {
  category: PartnerCategory | null | undefined;
  nextSortOrder: number;
  onClose: () => void;
}) => {
  const toast = useApiMessage();
  const { mutate, isPending, error, reset } = useSaveCategory();
  const [name, setName] = useState<Ml>(() => toMl(category?.name));
  const [seen, setSeen] = useState(category);
  if (category !== seen) {
    setSeen(category);
    setName(toMl(category?.name));
    reset();
  }
  const valid =
    REQUIRED_LANGUAGES.every((lang) => name[lang].trim()) &&
    LANGUAGES.every((lang) => name[lang].trim().length <= LIMITS.categoryName);
  return (
    <AppModal
      open={category !== undefined}
      width={440}
      title={category ? "Kategoriyani tahrirlash" : "Kategoriya qo‘shish"}
      onCancel={onClose}
      footer={
        <>
          <Button onClick={onClose}>Bekor qilish</Button>
          <Button
            type="primary"
            disabled={!valid}
            loading={isPending}
            onClick={() =>
              mutate(
                { id: category?.id ?? null, name: trimMl(name), sortOrder: category?.sortOrder ?? nextSortOrder },
                {
                  onSuccess: (saved) => {
                    toast.success(`«${saved.name.uz}» saqlandi`);
                    onClose();
                  },
                },
              )
            }
          >
            Saqlash
          </Button>
        </>
      }
    >
      {isApiError(error) && <Alert type="error" showIcon className="!mb-3" message={error.message} />}
      <div className="flex flex-col gap-3">
        {LANGUAGES.map((lang) => (
          <LabeledField
            key={lang}
            label={`Nomi · ${upper(lang)}`}
            required={REQUIRED_LANGUAGES.includes(lang)}
            count={{ value: name[lang].trim().length, limit: LIMITS.categoryName }}
            hint={lang === "tg" ? "Bo‘sh bo‘lsa ilovada ruscha ko‘rsatiladi" : undefined}
          >
            <Input
              value={name[lang]}
              maxLength={LIMITS.categoryName}
              onChange={(e) => setName({ ...name, [lang]: e.target.value })}
              placeholder={lang === "uz" ? "Mebel" : lang === "ru" ? "Мебель" : "Мебел"}
            />
          </LabeledField>
        ))}
      </div>
    </AppModal>
  );
};

const CategoryRow = ({
  category,
  isDragging,
  isDropTarget,
  handleProps,
  itemProps,
  onEdit,
  onDelete,
}: {
  category: PartnerCategory;
  isDragging: boolean;
  isDropTarget: boolean;
  handleProps: Record<string, unknown>;
  itemProps: Record<string, unknown>;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <li
    {...itemProps}
    className={`flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2 ${isDragging ? "opacity-40" : ""} ${
      isDropTarget ? "ring-2 ring-accent" : ""
    }`}
  >
    <button
      type="button"
      {...handleProps}
      aria-label={`${category.name.uz} — sudrab ko‘chirish`}
      className="flex h-8 w-5 shrink-0 cursor-grab items-center justify-center text-content-muted hover:text-content active:cursor-grabbing"
    >
      <HolderOutlined />
    </button>
    <div className="min-w-0 flex-1">
      <p className="truncate text-[13px] font-medium text-content">{category.name.uz}</p>
      <p className="truncate text-xs text-content-muted">
        {category.name.ru} · {category.name.tg || "—"}
      </p>
    </div>
    <span className="shrink-0 text-xs text-content-muted tabular-nums">{category.partnerCount} ta hamkor</span>
    <RowActions
      label={`${category.name.uz} amallari`}
      actions={[
        { key: "edit", label: "Tahrirlash", onClick: onEdit },
        { key: "delete", label: "O‘chirish", danger: true, dividerBefore: true, onClick: onDelete },
      ]}
    />
  </li>
);

const NonEmptyPreview = ({ categoryId }: { categoryId: number }) => {
  const { data } = usePartnersQuery({ categoryId, page: 0, size: 12, oldestFirst: false });
  if (!data || data.elements.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {data.elements.map((partner) => (
        <StatusChip key={partner.id} tone="neutral" label={partner.name} />
      ))}
      {data.totalElements > 12 && <StatusChip tone="neutral" label={`+${data.totalElements - 12}`} />}
    </div>
  );
};

const NonEmptyModal = ({
  category,
  partnerCount,
  onClose,
}: {
  category: PartnerCategory | null;
  partnerCount: number;
  onClose: () => void;
}) => (
  <AppModal
    open={category !== null}
    width={440}
    title={`«${category?.name.uz ?? ""}» o‘chirilmadi`}
    onCancel={onClose}
    footer={
      <Button type="primary" onClick={onClose}>
        Tushunarli
      </Button>
    }
  >
    <p className="text-[13px] leading-relaxed text-content-secondary">
      Kategoriyada {partnerCount} ta hamkor bor — avval ularni boshqa kategoriyaga o‘tkazing yoki o‘chiring.
    </p>
    {category && <NonEmptyPreview categoryId={category.id} />}
  </AppModal>
);

export const CategoryManager = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const toast = useApiMessage();
  const { data: categories, isPending } = useCategories();
  const { list, drag } = useCategoryReorder(categories ?? []);
  const { mutate: remove, isPending: isDeleting } = useDeleteCategory();
  const [editing, setEditing] = useState<PartnerCategory | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<PartnerCategory | null>(null);
  const [nonEmpty, setNonEmpty] = useState<{ category: PartnerCategory; count: number } | null>(null);
  const nextSortOrder = list.reduce((max, category) => Math.max(max, category.sortOrder + 1), 0);

  const requestDelete = (category: PartnerCategory) => {
    if (category.partnerCount > 0) setNonEmpty({ category, count: category.partnerCount });
    else setDeleteTarget(category);
  };

  return (
    <>
      <AppModal
        open={open}
        width={560}
        onCancel={onClose}
        title={
          <span className="flex flex-col gap-0.5">
            Kategoriyalar
            <span className="text-xs font-normal text-content-muted">Tartib — ilovadagi tablar tartibi. Sudrab o‘zgartiring.</span>
          </span>
        }
        footer={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setEditing(null)}>
            Kategoriya qo‘shish
          </Button>
        }
      >
        {isPending ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : list.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-content-muted">Kategoriya hali yo‘q</p>
        ) : (
          <ul className="flex max-h-[60dvh] flex-col gap-1.5 overflow-y-auto">
            {list.map((category, index) => (
              <CategoryRow
                key={category.id}
                category={category}
                isDragging={drag.dragging === index}
                isDropTarget={drag.over === index && drag.dragging !== index}
                handleProps={drag.handleProps(index)}
                itemProps={drag.itemProps(index)}
                onEdit={() => setEditing(category)}
                onDelete={() => requestDelete(category)}
              />
            ))}
          </ul>
        )}
      </AppModal>
      <CategoryForm category={editing} nextSortOrder={nextSortOrder} onClose={() => setEditing(undefined)} />
      <ConfirmModal
        open={deleteTarget !== null}
        tone="danger"
        title={`«${deleteTarget?.name.uz ?? ""}» kategoriyasini o‘chirasizmi?`}
        description="Kategoriya ilovadagi tablardan ham yo‘qoladi."
        confirmLabel="O‘chirish"
        loading={isDeleting}
        onConfirm={() => {
          if (!deleteTarget) return;
          remove(deleteTarget.id, {
            onSuccess: () => toast.success(`«${deleteTarget.name.uz}» o‘chirildi`),
            onError: (error) => {
              if (isApiError(error) && error.code === ApiErrorCode.PARTNER_CATEGORY_NOT_EMPTY) {
                const count = error.details?.partnerCount;
                setNonEmpty({ category: deleteTarget, count: typeof count === "number" ? count : 0 });
                return;
              }
              toast.error(error);
            },
            onSettled: () => setDeleteTarget(null),
          });
        }}
        onCancel={() => setDeleteTarget(null)}
      />
      <NonEmptyModal category={nonEmpty?.category ?? null} partnerCount={nonEmpty?.count ?? 0} onClose={() => setNonEmpty(null)} />
    </>
  );
};
