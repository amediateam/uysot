// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-CoeJIAaJ (3)
import "@/styles/chunks/payment-qr-code.css";
import * as d from "react";
import { useTranslation } from "react-i18next";
import * as s from "react/jsx-runtime";
import t from "@/pages/payment-qr-code/index.module.css";
import { w as X, E, R } from "@/pages/qr-code/constants";
import { Link, useParams } from "react-router-dom";
import { Dropdown } from "antd";
import { f as F } from "@/assets/icons/ArrowDownBottom";
import { useQuery } from "react-query";
import { Wa } from "@/services/api/client";
import { _s } from "@/with-error-boundary";
function _() {
  const o = useParams();
  const i = "/v1/contract/payment/qr/";
  return useQuery({
    queryKey: ["payment-qr-code", o.token],
    queryFn: async () => (await Wa.get(i + o.token))?.data?.data,
  });
}
const PaymentQrCode = () => {
  const [visible, setVisible] = d.useState(false);
  const { i18n, t: t_1 } = useTranslation();
  const { data } = _();
  return (
    <div className={t.container}>
      {data && (
        <div className={t.body}>
          <h1>
            <X status={data?.canceledDate !== null ? E.CANCELLED : E.ACTIVE} />{" "}
            {data?.canceledDate !== null ? t_1("home.CANCELLED") : t_1("home.ACTIVE")}
          </h1>
          <div>
            <h3>{t_1("create_payment.Tolov_raqami")}:</h3>
            <h2>{data?.paymentNumber}</h2>
          </div>
          <div>
            <h3>{t_1("global.Shartnoma raqami")}:</h3>
            <h2>{data?.contractNumber}</h2>
          </div>
          <div>
            <h3>{t_1("global.To'lov sanasi")}:</h3>
            <h2>{data?.paymentDate}</h2>
          </div>
          <div>
            <h3>{t_1("home.Quruvchi")}:</h3>
            <h2>{data?.builder}</h2>
          </div>
          <div>
            <h3>{t_1("home.Tolov_summasi")}:</h3>
            <h2>
              {data?.paymentAmount?.toLocaleString("ru")} {data?.paymentCcy}
            </h2>
          </div>
          <div>
            <h3>{t_1("create_payment.Mijoz")}:</h3>
            <h2>{data?.client}</h2>
          </div>
        </div>
      )}
      <div className={t.footer}>
        {data && (
          <p>
            {t_1("home.Quruvchi_telefon_raqami")}: <span> {data?.numberOfBuilder}</span>
          </p>
        )}
        <Link to="/">{t_1("home.Uysot_sahifasiga_otish")}</Link>
      </div>
      <Dropdown
        trigger={["click"]}
        visible={visible}
        onVisibleChange={setVisible}
        overlay=<div className={t.lang_drawer}>
          {R?.filter((a) => a?.lang !== i18n?.language)?.map((a) => (
            <div
              key={a?.lang}
              onClick={() => {
                i18n.changeLanguage(a?.lang);
                setVisible(false);
              }}
            >
              <img src={a?.img} alt="" /> {a?.text}
            </div>
          ))}
        </div>
      >
        <div className={t.lang}>
          <img
            src={R?.find((a) => a?.lang === i18n.language)?.img}
            className="h-[24px] w-[35px] rounded-[10px]"
            alt=""
          />{" "}
          {R?.find((a) => a?.lang === i18n.language)?.text} <F />
        </div>
      </Dropdown>
    </div>
  );
};
const k = _s(PaymentQrCode);
export default k;
