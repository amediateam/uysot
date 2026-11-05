import { useParams } from "react-router-dom";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BannersTable } from "@/components/advertising/BannersTable";
import { DetailHeader } from "@/components/advertising/DetailHeader";

// Advertising collection detail page (recovered from the build): header + banners table.
export const AdvertisingDetailPage = () => {
  const { name = "", id } = useParams();
  return (
    <>
      <Breadcrumb
        crumbs={[
          { name: "Reklama ", url: "/main/advetising" },
          { name, url: `/main/advetising/${id}/${name}` },
        ]}
      />
      <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
        <h1 className="font-[600] text-[20px] flex flex-col gap-4">
          <DetailHeader />
        </h1>
        <BannersTable />
      </div>
    </>
  );
};
