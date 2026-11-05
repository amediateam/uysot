import { Dropdown, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useParams } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { useAds } from "@/store/ads";
import { useBanners } from "@/services/banners/hooks";
import type { BannerRow } from "@/services/banners/types";

// Banners table for one advertising collection (recovered from the build).
export const BannersTable = () => {
  const { setAds, query, setQuery } = useAds();
  const { id } = useParams();
  const { data, isPending } = useBanners({ banner_category_id: Number(id), ...query });

  const rowMenu = (row: BannerRow) => [
    {
      key: "1",
      icon: <Icon name="lineChartUp" className="text-gray-700 w-[20px] h-[20px]" />,
      label: <span className="text-gray-700">Statistika</span>,
      onClick: () => setAds("ADS_STATS", { id: row?.id }),
    },
    {
      key: "2",
      icon: <Icon name="edit" className="text-gray-700 w-[20px] h-[20px]" />,
      label: <span className="text-gray-700">Tahrirlash</span>,
      onClick: () => setAds("ADS_UPDATE", { id: row?.id }),
    },
  ];

  const columns: ColumnsType<BannerRow> = [
    { title: "ID", dataIndex: "id", width: 63 },
    { title: "Saxifa", dataIndex: "page_type" },
    { title: "Joylashuvi", dataIndex: "position" },
    { title: "Target link", dataIndex: "target_url" },
    {
      title: "Holati",
      dataIndex: "status",
      width: 89,
      render: (status: boolean) => (status ? <span>Faol</span> : "No faol"),
    },
    {
      title: (
        <div>
          <h3 className="text-gray-800 text-[12px]">Ko‘rish soni</h3>
          <p className="text-gray-500 text-[12px]">Ko‘rganlar | Kutilayotgan</p>
        </div>
      ),
      align: "center",
      render: (_value, row) => (
        <div className="flex items-center justify-center gap-3 text-[14px]">
          <p className="bg-primary-100 rounded-[8px] px-[6px] py-[3px]">
            {row?.views?.actual} <span>ta</span>
          </p>
          <Icon name="line" className="h-[35px] text-gray-200" />
          <p>
            {row?.views?.expected} <span>ta</span>
          </p>
        </div>
      ),
    },
    {
      title: (
        <div>
          <h3 className="text-gray-800 text-[12px]">Bosish soni</h3>
          <p className="text-gray-500 text-[12px]">Bosganlar | Kutilayotgan</p>
        </div>
      ),
      align: "center",
      render: (_value, row) => (
        <div className="flex items-center justify-center gap-3 text-[14px]">
          <p className="bg-primary-100 rounded-[8px] px-[6px] py-[3px]">
            {row?.clicks?.actual} <span>ta</span>
          </p>
          <Icon name="line" className="h-[35px] text-gray-200" />
          <p>
            {row?.clicks?.expected} <span>ta</span>
          </p>
        </div>
      ),
    },
    {
      width: 52,
      render: (_value, row) => (
        <Dropdown menu={{ items: rowMenu(row) }} trigger={["click"]} rootClassName="w-[240px]">
          <span>
            <Icon name="dotsVertical" className="w-6 h-6 cursor-pointer" />
          </span>
        </Dropdown>
      ),
    },
  ];

  return (
    <Table<BannerRow>
      columns={columns}
      dataSource={data?.data}
      rowKey="id"
      loading={isPending}
      scroll={{ y: "calc(100vh - 320px)" }}
      className="w-full"
      pagination={{
        current: data?.current_page,
        pageSize: query?.size,
        total: data?.total,
        onChange: (page, pageSize) => setQuery({ page, size: pageSize }),
      }}
    />
  );
};
