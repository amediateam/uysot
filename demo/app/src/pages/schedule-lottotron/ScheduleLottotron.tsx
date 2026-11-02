// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: ScheduleLottotron-BRWX7mEZ (5)
import "@/styles/chunks/schedule-lottotron.css";
import { useQueryStates, parseAsInteger } from "nuqs";
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v6";
import { useTranslation } from "react-i18next";
import * as At from "react/jsx-runtime";
import { Xs } from "@/global/table/Table";
import Pn from "@/pages/schedule-lottotron/ScheduleLottotron.module.css";
import { vH as Dc } from "@/assets/icons/contract/ArrowLeftIcon";
import { Yp } from "@/assets/icons/contract/ArrowRightIcon";
import { useQuery } from "react-query";
import { Wa, Bv } from "@/services/api/client";
import { _s } from "@/with-error-boundary";
const Jp = {
  EXPO_ALL: "/v1/expo/all",
};
const Qp = {
  EXPO_ALL: "EXPO_ALL",
};
function Zp(e) {
  return useQuery([Qp.EXPO_ALL, e], async () => (await Wa.get(Bv + Jp.EXPO_ALL + e))?.data?.data);
}
const ScheduleLottotron = () => {
  const [e, n] = useQueryStates(
    {
      page: parseAsInteger,
      size: parseAsInteger,
    },
    {
      history: "push",
    }
  );
  const a = useOptimisticSearchParams().toString();
  const t = a ? `?${a}` : "";
  const { t: t_1 } = useTranslation();
  const { data, isLoading } = Zp(t);
  const columns = [
    {
      title: "Kompany",
      dataIndex: "companyName",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Sana",
      dataIndex: "createdDate",
    },
  ];
  const onChange = (page) => {
    n({
      page,
    });
  };
  return (
    <div>
      <Xs
        dataSource={data?.data || []}
        columns={columns}
        loading={isLoading}
        pagination={{
          total: data?.totalElements,
          current: data?.currentPage ? data.currentPage : 1,
          pageSize: e.size ?? undefined,
          className: Pn.pagination,
          prevIcon: (
            <div className={Pn.pagination_prev}>
              <Dc /> {t_1("my_calls.Ortga")}
            </div>
          ),
          nextIcon: (
            <div className={Pn.pagination_next}>
              {t_1("profile.Keyingi")} <Yp />
            </div>
          ),
          onChange,
        }}
        className={Pn.container_table}
      />
    </div>
  );
};
const dh = _s(ScheduleLottotron);
export default dh;
