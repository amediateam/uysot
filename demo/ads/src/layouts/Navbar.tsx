import { Avatar, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/store/auth";

const Logo = () => (
  <div className="flex items-center gap-2">
    <Icon name="logo" className="h-[25px]" /> <Icon name="logoText" />
  </div>
);

// Top bar with logo and user menu (recovered from the build).
export const Navbar = () => {
  const { user, setUser } = useAuth();
  return (
    <div className="bg-primary-800 py-[8px] px-[16px] h-[44px] flex justify-between items-center">
      <Logo />
      <Dropdown menu={{ items: [{ key: "1", label: "Log out", onClick: () => setUser(undefined) }] }} trigger={["click"]}>
        <div className="bg-primary-500 rounded-[43px] w-[54px] p-[2px] flex justify-between items-center cursor-pointer">
          <Avatar src={user?.image} icon={<UserOutlined />} size={28} />
          <Icon name="chevronLeft" className="w-[16px] h-[16px] text-white mr-[2px]" />
        </div>
      </Dropdown>
    </div>
  );
};
