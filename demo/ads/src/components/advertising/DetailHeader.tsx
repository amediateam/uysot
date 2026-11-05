import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { useAds } from "@/store/ads";

// Advertising collection detail header (recovered from the build): back button, collection
// name, and the "create banner" action.
export const DetailHeader = () => {
  const { setAds } = useAds();
  const navigate = useNavigate();
  const { name = "" } = useParams();
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-[16px] items-center">
        <Button
          className="rounded-[7px!important] w-[38px] h-max py-[5px] px-[9px]"
          onClick={() => navigate("/main/advetising")}
        >
          <Icon name="arrowNarrowLeft" />
        </Button>
        <h1 className="text-gray-900 font-[600] text-[20px]"> {name}</h1>
      </div>
      <Button type="primary" size="large" onClick={() => setAds("ADS_CREATE")}>
        <Icon name="plus" />
        Reklama yaratish
      </Button>
    </div>
  );
};
