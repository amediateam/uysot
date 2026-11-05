import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CategoryCard } from "@/components/advertising/CategoryCard";
import { useBannerCategories } from "@/services/banners/hooks";

// Advertising collections grid (recovered from the build).
export const AdvertisingListPage = () => {
  const { data, isLoading } = useBannerCategories();
  return (
    <>
      <Breadcrumb crumbs={[{ name: "Reklama", url: "/main/advetising" }]} />
      <div className="flex flex-col gap-[16px] p-[16px] flex-1 overflow-y-auto">
        <h1 className="font-[600] text-[20px]">Reklama tuplamlari</h1>
        <Spin spinning={isLoading} indicator={<LoadingOutlined />}>
          <div className="grid grid-cols-[repeat(auto-fill,400px)] gap-[12px]">
            {data?.map((item) => (
              <CategoryCard key={item.id} item={item} />
            ))}
            <CategoryCard create />
          </div>
        </Spin>
      </div>
    </>
  );
};
