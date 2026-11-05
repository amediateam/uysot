import { DatePicker, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { ResponsiveLine, type Datum, type Serie } from "@nivo/line";
import dayjs from "dayjs";
import "dayjs/locale/uz-latn";
import { useState } from "react";
import { useAds } from "@/store/ads";
import { useStatistics } from "@/services/banners/hooks";
import type { StatPoint } from "@/services/banners/types";

dayjs.locale("uz-latn");

const DATE_FORMAT = "DD.MM.YYYY";

// Banner statistics chart (recovered from the build): weekly views vs. clicks.
export const StatisticsModal = () => {
  const [week, setWeek] = useState(dayjs().add(-1, "week").startOf("week"));
  const { getData } = useAds();
  const { data, isLoading } = useStatistics({
    min_date: week?.format(DATE_FORMAT),
    max_date: week?.endOf("week").format(DATE_FORMAT),
    banner_id: getData?.ADS_STATS?.id,
  });

  const viewData: Datum[] = [];
  const clickData: Datum[] = [];
  (data || []).forEach((point: StatPoint) => {
    viewData.push({ x: point.date, y: point.view_count, data: point });
    clickData.push({ x: point.date, y: point.click_count, data: point });
  });
  const series: Serie[] = [
    { id: "view", color: "#12B76A", data: viewData },
    { id: "click", color: "#875BF7", data: clickData },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-end">
        <DatePicker
          picker="week"
          value={week}
          onChange={(value) => value && setWeek(value.startOf("week"))}
          format={DATE_FORMAT}
          allowClear={false}
        />
      </div>
      <Spin spinning={isLoading} indicator={<LoadingOutlined />}>
        <div className="h-[250px]">
          <ResponsiveLine
            data={data && data.length > 0 ? series : [{ id: "1", data: [{ x: "1", y: 0 }] }]}
            margin={{ top: 16, right: 40, bottom: 50, left: 40 }}
            colors={(serie) => (serie as { color?: string }).color ?? "#875BF7"}
            axisTop={null}
            axisRight={null}
            axisBottom={{ format: (value) => dayjs(value as string, DATE_FORMAT).format("dddd") }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            useMesh
            animate={false}
            tooltip={({ point }) => {
              const stat = (point.data as { data?: StatPoint }).data;
              return (
                <div className="bg-gray-200 px-[12px] py-[8px] rounded-[8px] flex flex-col gap-2">
                  <p>{dayjs(point.data.x as string, DATE_FORMAT).format("MMMM DD YYYY")}</p>
                  <p className="text-gray-600 text-[10px] font-[500]">Ko‘rishlar soni </p>
                  <p className="text-gray-800 text-[14px] font-[600] border-[0] border-l-[2px] border-solid border-[#12B76A] pl-[8px] leading-[18px]">
                    {stat?.view_count} ta
                  </p>
                  <p className="text-gray-600 text-[10px] font-[500]">Bosishlar soni</p>
                  <p className="text-gray-800 text-[14px] font-[600] border-[0] border-l-[2px] border-solid border-[#875BF7] pl-[8px] leading-[18px]">
                    {stat?.click_count} ta
                  </p>
                </div>
              );
            }}
          />
        </div>
      </Spin>
    </div>
  );
};
