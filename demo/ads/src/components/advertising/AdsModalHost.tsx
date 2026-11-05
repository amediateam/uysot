import { Modal } from "antd";
import type { ReactNode } from "react";
import { useAds, type AdsModal } from "@/store/ads";
import { BannerFormModal } from "@/components/advertising/BannerFormModal";
import { StatisticsModal } from "@/components/advertising/StatisticsModal";

// Modal registry for the advertising section (recovered from the build).
const modalConfig = (open: boolean): Record<AdsModal, { component: ReactNode; title: string; width: number }> => ({
  ADS_CREATE: { component: <BannerFormModal open={open} />, title: "Reklama yaratish", width: 758 },
  ADS_UPDATE: { component: <BannerFormModal open={open} />, title: "Reklamani tahrirlash", width: 758 },
  ADS_STATS: { component: <StatisticsModal />, title: "Statistika", width: 867 },
});

export const AdsModalHost = () => {
  const { ads, closeAction } = useAds();
  const config = ads ? modalConfig(!!ads)[ads] : undefined;
  return (
    <Modal
      title={config?.title}
      open={!!ads}
      onCancel={closeAction}
      footer={false}
      width={config?.width}
      className="transition-[width]"
    >
      {config?.component}
    </Modal>
  );
};
