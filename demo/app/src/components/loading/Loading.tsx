// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (2)
import * as A from "react/jsx-runtime";
import xn from "@/components/loading/Loading.module.css";
import { Wl } from "@/utils/cn";
import { _s } from "@/with-error-boundary";
const Loading = ({ cubeClassName }) => (
  <div className={xn.cont}>
    <div className={Wl(xn.cubeWrapper, cubeClassName)}>
      <div className={xn.cubeFolding}>
        <span className={xn.leaf1} />
        <span className={xn.leaf2} />
        <span className={xn.leaf3} />
        <span className={xn.leaf4} />
      </div>
      <span className={xn.loading} data-name="Loading">
        Uysot
      </span>
    </div>
  </div>
);
export const Lo = _s(Loading);
