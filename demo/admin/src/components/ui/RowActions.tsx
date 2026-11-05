import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Tooltip } from "antd";
import type { ReactNode } from "react";

// Overflow (⋯) action menu for table rows (recovered from the build).
export interface RowAction {
  key: string;
  label: ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  dividerBefore?: boolean;
}

export const RowActions = ({ actions, label }: { actions: RowAction[]; label?: string }) => {
  const items = actions.flatMap((action) => [
    ...(action.dividerBefore ? [{ type: "divider" as const, key: `${action.key}-divider` }] : []),
    {
      key: action.key,
      danger: action.danger,
      disabled: action.disabled,
      label:
        action.disabled && action.disabledReason ? (
          <Tooltip title={action.disabledReason}>{action.label}</Tooltip>
        ) : (
          action.label
        ),
    },
  ]);

  return (
    <Dropdown
      menu={{
        items,
        onClick: ({ key }) => {
          const action = actions.find((a) => a.key === key);
          if (action && !action.disabled) action.onClick();
        },
      }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Button type="text" icon={<MoreOutlined />} aria-label={label} className="!h-11 !w-11" />
    </Dropdown>
  );
};
