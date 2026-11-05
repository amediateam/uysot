import { useMemo, useState } from "react";
import { newPartnerForm } from "@/services/partners/format";
import { validatePartner } from "@/services/partners/validation";
import type { ServerIssue } from "@/services/partners/server-errors";
import type { BlockType, FormBlock, Language, Ml, PartnerFormValues } from "@/services/partners/types";
import { createBlock } from "@/services/partners/format";

// Partner editor form state (recovered from the build): local values, client-side
// validation and a single server issue that clears on edit.
export const usePartnerForm = () => {
  const [values, setValues] = useState<PartnerFormValues>(newPartnerForm);
  const [snapshot, setSnapshot] = useState(() => JSON.stringify(values));
  const [serverIssue, setServerIssue] = useState<ServerIssue | null>(null);

  const validation = useMemo(() => validatePartner(values), [values]);

  const update = (updater: (prev: PartnerFormValues) => PartnerFormValues) => {
    setValues(updater);
    setServerIssue(null);
  };
  const updateBlocks = (updater: (blocks: FormBlock[]) => FormBlock[]) =>
    update((prev) => ({ ...prev, blocks: updater(prev.blocks) }));

  return {
    values,
    validation,
    serverIssue,
    setServerIssue,
    isDirty: JSON.stringify(values) !== snapshot,
    reset: (next: PartnerFormValues) => {
      setValues(next);
      setSnapshot(JSON.stringify(next));
      setServerIssue(null);
    },
    setField: <K extends keyof PartnerFormValues>(key: K, value: PartnerFormValues[K]) =>
      update((prev) => ({ ...prev, [key]: value })),
    setDraft: (key: "discountText" | "condition", lang: Language, value: string) =>
      update((prev) => ({ ...prev, [key]: { ...(prev[key] as Ml), [lang]: value } })),
    updateBlock: (key: string, updater: (block: FormBlock) => FormBlock) =>
      updateBlocks((blocks) => blocks.map((block) => (block.key === key ? updater(block) : block))),
    addBlock: (type: BlockType) => updateBlocks((blocks) => [...blocks, createBlock(type)]),
    removeBlock: (key: string) => updateBlocks((blocks) => blocks.filter((block) => block.key !== key)),
    moveBlock: (from: number, to: number) =>
      updateBlocks((blocks) => {
        if (to < 0 || to >= blocks.length) return blocks;
        const next = [...blocks];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
      }),
  };
};

export type PartnerForm = ReturnType<typeof usePartnerForm>;
