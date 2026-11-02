// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: QrCode-CXeqeBv0 (8)
import { useTranslation } from "react-i18next";
import * as r from "react/jsx-runtime";
import { Skeleton } from "antd";
import { w as T, E } from "@/pages/qr-code/constants";
import { Link, useParams } from "react-router-dom";
import { _s } from "@/with-error-boundary";
import { je } from "@/pages/qr-code/components/language-switcher";
import { Ie } from "@/pages/qr-code/components/uyim-app-banner";
import { useQuery } from "react-query";
import ne from "axios";
import { Bv } from "@/services/api/client";
const Ke = _s(je);
const Re = _s(Ie);
const qe = {
  CONTRACT_QR: "/v1/contract/qr/",
};
const Te = {
  CONTRACT_QR: "CONTRACT_QR",
};
function De() {
  const a = useParams();
  return useQuery(
    [Te.CONTRACT_QR, a.token],
    async () => (await ne.get(Bv + qe.CONTRACT_QR + a.token))?.data?.data,
    {
      enabled: !!a.token,
      retry: (e, t) => !t?.response && e < 3,
    }
  );
}
const Be = {
  [E.STARTED]: E.STARTED,
  [E.REGISTERED]: E.STARTED,
  [E.ACTIVE]: E.ACTIVE,
  [E.FINISHED]: E.ACTIVE,
  [E.DELIVERED]: E.ACTIVE,
  [E.CLOSED]: E.ACTIVE,
  [E.CANCELLED]: E.CANCELLED,
  [E.DELETED]: E.CANCELLED,
};
const QrCode = () => {
  const { t: t_1 } = useTranslation();
  const { data, isLoading } = De();
  const s = data
    ? [
        {
          label: t_1("contract_table_update.Shartnoma_raqami"),
          value: data.contractNumber,
        },
        {
          label: t_1("titles.builder-config"),
          value: data.builder,
        },
        {
          label: t_1("home.Tuzilgan"),
          value: data.createdDate,
        },
        {
          label: t_1("create_payment.uy"),
          value: data.house,
        },
        {
          label: t_1("create_payment.Mijoz"),
          value: data.client,
        },
      ]
    : [];
  const CComponent = () => {
    if (isLoading) {
      return (
        <Skeleton
          active
          paragraph={{
            rows: 5,
          }}
        />
      );
    }
    if (data) {
      return (
        <>
          <h1 className="m-0 mb-8 flex items-center justify-center gap-4 text-center text-3xl font-semibold text-fg sm:text-4xl">
            <span className="flex shrink-0 [&>svg]:h-10 [&>svg]:w-auto sm:[&>svg]:h-12">
              <T status={Be[data.contractStatus]} />
            </span>
            {t_1(`home.${data.contractStatus}`, {
              defaultValue: data.contractStatus,
            })}
          </h1>
          <dl className="m-0 grid grid-cols-1 gap-x-12 gap-y-5 sm:grid-cols-2">
            {s.map((n) => (
              <div key={n.label} className="min-w-0">
                <dt className="mb-1 text-sm font-semibold text-fg-muted">{n.label}</dt>
                <dd className="m-0 break-words text-lg text-fg sm:text-xl">{n.value || "—"}</dd>
              </div>
            ))}
          </dl>
        </>
      );
    }
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <T status={E.CANCELLED} />
        <h1 className="m-0 text-2xl font-semibold text-fg">
          {t_1("home.Shartnoma_topilmadi", {
            defaultValue: "Shartnoma topilmadi",
          })}
        </h1>
      </div>
    );
  };
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-canvas px-4 py-10">
      <main className="w-full max-w-[600px] rounded-2xl border border-solid border-line bg-surface p-6 sm:p-10">
        {CComponent()}
      </main>
      {data && <Re />}
      <footer className="flex flex-col items-center gap-4 text-center text-base font-semibold text-fg-muted">
        {data?.numberOfBuilder && (
          <p className="m-0">
            {t_1("home.Quruvchi_telefon_raqami")}:{" "}
            <a
              href={`tel:${data.numberOfBuilder.replace(/[^\d+]/g, "")}`}
              className="whitespace-nowrap text-fg"
            >
              {data.numberOfBuilder}
            </a>
          </p>
        )}
        <Link to="/" className="text-fg-muted underline hover:text-fg">
          {t_1("home.Uysot_sahifasiga_otish")}
        </Link>
        <Ke />
      </footer>
    </div>
  );
};
const Ge = _s(QrCode);
export default Ge;
