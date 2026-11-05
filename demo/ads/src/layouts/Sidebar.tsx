import cn from "classnames";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/layouts/nav-config";

// Left navigation (recovered from the build).
export const Sidebar = () => (
  <div className="w-[217px] bg-white border-0 border-r-[rgb(234,236,240)] border-r-[1px] border-solid p-[12px] flex flex-col gap-[4px] ">
    {NAV_ITEMS.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          cn(
            "flex py-[8px] px-[16px] gap-[10px] rounded-[12px] text-gray-500 transition bg-transparent",
            isActive && "bg-primary-100 text-primary-400",
          )
        }
      >
        {item.icon} {item.name}{" "}
      </NavLink>
    ))}
  </div>
);
