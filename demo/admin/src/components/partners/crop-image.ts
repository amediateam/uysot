import type { Area } from "react-easy-crop";

// Banner crop helpers (recovered from the build): load image dimensions and produce a
// cropped JPEG File from the selected pixel area.
export const loadImageSize = (src: string): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve({ width: image.naturalWidth, height: image.naturalHeight }));
    image.addEventListener("error", () => reject(new Error("image")));
    image.src = src;
  });

export const getCroppedFile = (src: string, crop: Area, fileName: string): Promise<File> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("error", () => reject(new Error("image")));
    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("canvas"));
      ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
      canvas.toBlob(
        (blob) => (blob ? resolve(new File([blob], fileName, { type: "image/jpeg" })) : reject(new Error("blob"))),
        "image/jpeg",
        0.92,
      );
    });
    image.src = src;
  });
