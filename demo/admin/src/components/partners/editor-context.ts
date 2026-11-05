import { createContext, useContext } from "react";
import type { Language } from "@/services/partners/types";

// Shared editor context (recovered from the build): the active content language and
// whether the whole form is read-only (VIEWER role or mid-save).
export interface PartnerEditorContextValue {
  lang: Language;
  readOnly: boolean;
}

export const PartnerEditorContext = createContext<PartnerEditorContextValue>({ lang: "uz", readOnly: false });
export const usePartnerEditor = () => useContext(PartnerEditorContext);
