// Reads a File/Blob as a data: URL (recovered from the build).
export const readAsDataUrl = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Faylni o‘qib bo‘lmadi."));
    reader.readAsDataURL(file);
  });
