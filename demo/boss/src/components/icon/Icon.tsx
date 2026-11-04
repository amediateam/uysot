import * as icons from "./icons";
import { cn } from "@/utils/cn";
import styles from "./Icon.module.css";

interface IconProps {
  name: keyof typeof icons;
  className?: string;
  onClick?: () => void;
}

export const Icon = ({ name, className, onClick }: IconProps) => {
  const Component = icons[name];

  if (!Component) {
    console.log("Icon component not found");
    return null;
  }

  return (
    <div className={cn(styles.wrapper, "h-4 w-4", className)} onClick={onClick}>
      <Component />
    </div>
  );
};
