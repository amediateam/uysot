// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (3)
import * as A from "react/jsx-runtime";
import { Wl } from "@/utils/cn";
import P$ from "@/components/icon/icon-lite.module.css";
import { g$ as arrowDawn } from "@/assets/icons/ArrowDawnIcon";
import { m$ as close } from "@/assets/icons/close-icon";
import { y$ as emptyCard } from "@/assets/icons/empty-icon";
import { _$ as info } from "@/assets/icons/info-icon";
import { b$ as laptop } from "@/assets/icons/laptop-icon";
import { S$ as LinkExternalIcon } from "@/assets/icons/link-external-icon";
import { E$ as macos } from "@/assets/icons/macos-icon";
import { C$ as search } from "@/assets/icons/SearchIcon";
import { x$ as windows } from "@/assets/icons/windows-icon";
import { _s } from "@/with-error-boundary";
const I$ = {
  arrowDawn,
  close,
  emptyCard,
  info,
  laptop,
  LinkExternalIcon,
  macos,
  search,
  windows,
};
const IconLite = ({ name, className, onClick, ...rest }) => {
  const i = I$[name](rest || {});
  if (i) {
    return (
      <div className={Wl(P$.wrapper, "flex h-4 w-4 items-center", className)} onClick={onClick}>
        {i}
      </div>
    );
  }
  return null;
};
export const vi = _s(IconLite);
