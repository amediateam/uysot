import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";

// Top breadcrumb bar (recovered from the build).
export const Breadcrumb = ({ crumbs }: { crumbs: { name: string; url: string }[] }) => (
  <div className="h-[48px] bg-white w-[100%] border-0 border-b-[#EAECF0] border-b-[1px] border-solid flex items-center px-[16px] py-[14px]">
    <div className="flex gap-[8px] items-center">
      <Icon name="homeLine" className="h-[20px] w-[20px]" />
      {crumbs?.map((crumb) => (
        <div key={crumb.url} className="flex items-center">
          <Icon name="chevronRight" className="h-[20px] w-[20px]" />
          <Link
            to={crumb.url}
            className="px-[8px] py-[4px] bg-gray-50 rounded-[6px] text-gray-700 font-[600] text-[14px]"
          >
            {crumb.name}
          </Link>
        </div>
      ))}
    </div>
  </div>
);
