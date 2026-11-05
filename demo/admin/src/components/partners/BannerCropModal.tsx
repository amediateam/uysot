import { ExclamationOutlined } from "@ant-design/icons";
import { Button, Slider } from "antd";
import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { LIMITS } from "@/services/partners/constants";
import { AppModal } from "@/components/ui/AppModal";
import { getCroppedFile, loadImageSize } from "@/components/partners/crop-image";

// Banner crop dialog (recovered from the build): 2:1 crop at 1000px target width.
export const BannerCropModal = ({
  src,
  fileName,
  onCancel,
  onApply,
}: {
  src: string | null;
  fileName: string;
  onCancel: () => void;
  onApply: (file: File) => void;
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!src) return;
    let active = true;
    loadImageSize(src).then((s) => active && setSize(s));
    return () => {
      active = false;
    };
  }, [src]);

  const tooSmall = size !== null && size.width < LIMITS.bannerWidth;

  return (
    <AppModal
      open={src !== null}
      width={760}
      onCancel={onCancel}
      title={
        <span className="flex items-center justify-between gap-3 pr-8">
          Bannerni kesish
          <span className="font-mono text-xs font-normal text-content-muted">kadr eni {LIMITS.bannerWidth} px</span>
        </span>
      }
      footer={
        <>
          <Button onClick={onCancel}>Bekor qilish</Button>
          <Button
            type="primary"
            loading={loading}
            disabled={!area}
            onClick={async () => {
              if (!src || !area) return;
              setLoading(true);
              try {
                onApply(await getCroppedFile(src, area, fileName));
              } finally {
                setLoading(false);
              }
            }}
          >
            {tooSmall ? "Baribir qo‘llash" : "Qo‘llash"}
          </Button>
        </>
      }
    >
      <div className="relative h-72 overflow-hidden rounded-2xl bg-surface-muted sm:h-96">
        {src && (
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={LIMITS.bannerAspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_a, areaPixels) => setArea(areaPixels)}
          />
        )}
        {size && (
          <span className="absolute bottom-2.5 left-3 rounded-full bg-overlay px-2 py-0.5 font-mono text-[11px] text-content-inverse">
            tanlangan rasm · {size.width} × {size.height}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs text-content-muted">Masshtab</span>
        <Slider className="flex-1" min={1} max={3} step={0.05} value={zoom} onChange={setZoom} />
      </div>
      {tooSmall && (
        <div className="mt-2 flex items-start gap-2.5 rounded-xl bg-warning-soft px-3.5 py-3 text-[13px] text-warning-strong">
          <ExclamationOutlined className="mt-0.5" />
          Rasm kichik, bannerda xira ko‘rinishi mumkin
        </div>
      )}
      <p className="mt-3 text-xs text-content-muted">
        Standart holatda markazdan. Yuklanadigan narsa — faqat kesilgan qism.
      </p>
    </AppModal>
  );
};
