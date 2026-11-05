import { useRef, useState } from "react";
import { LIMITS } from "@/services/partners/constants";
import { uploadErrorMessage } from "@/services/partners/server-errors";
import { useUploadPartnerFile } from "@/hooks/partners";
import type { PartnerFile, UploadKind } from "@/services/partners/types";

const MB = 1_048_576;

// Client-side pre-check (recovered from the build): type + size before hitting the server.
const clientError = (file: File, kind: UploadKind): string | null => {
  if (kind === "PDF") {
    if (file.type && file.type !== "application/pdf") return "Fayl turi mos emas — PDF kerak";
    if (file.size > LIMITS.pdfMaxMb * MB) return `PDF ${LIMITS.pdfMaxMb} MB dan katta`;
    return null;
  }
  if (file.type && !file.type.startsWith("image/")) return "Fayl turi mos emas — rasm kerak";
  if (file.size > LIMITS.imageMaxMb * MB) return `Rasm ${LIMITS.imageMaxMb} MB dan katta`;
  return null;
};

// Sequential upload manager for a single block/field (recovered from the build): uploads
// run one at a time, exposing progress + the last error.
export const usePartnerUpload = (kind: UploadKind) => {
  const { mutateAsync } = useUploadPartnerFile();
  const chain = useRef<Promise<unknown>>(Promise.resolve());
  const [inFlight, setInFlight] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const run = async (file: File): Promise<PartnerFile | null> => {
    setProgress(0);
    try {
      return await mutateAsync({ file, kind, onProgress: setProgress });
    } catch (err) {
      setError(uploadErrorMessage(err, kind));
      return null;
    } finally {
      setInFlight((n) => n - 1);
    }
  };

  return {
    progress,
    error,
    isUploading: inFlight > 0,
    clearError: () => setError(null),
    upload: (file: File): Promise<PartnerFile | null> => {
      const invalid = clientError(file, kind);
      if (invalid) {
        setError(invalid);
        return Promise.resolve(null);
      }
      setError(null);
      setInFlight((n) => n + 1);
      const next = chain.current.then(() => run(file));
      chain.current = next;
      return next;
    },
  };
};
