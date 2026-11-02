// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-B0UwuSD7 (1)
import { useTranslation } from "react-i18next";
import * as A from "react/jsx-runtime";
function SessionWarning() {
  const { t } = useTranslation();
  return (
    <div className="flex gap-3 p-3 mb-4 bg-[#fffaeb] border-solid border border-[#fedf89] rounded-[10px]">
      <div className="shrink-0 w-[18px] h-[18px]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.2975 13.4987L10.2975 2.9987C10.1667 2.76786 9.97696 2.57584 9.7477 2.44226C9.51844 2.30867 9.25785 2.23828 8.99251 2.23828C8.72717 2.23828 8.46657 2.30867 8.23732 2.44226C8.00806 2.57584 7.81834 2.76786 7.68751 2.9987L1.68751 13.4987C1.55527 13.7277 1.48593 13.9876 1.48651 14.2521C1.4871 14.5165 1.55759 14.7761 1.69084 15.0046C1.82409 15.233 2.01537 15.4221 2.24528 15.5528C2.47519 15.6835 2.73556 15.7511 3.00001 15.7487H15C15.2632 15.7484 15.5217 15.6789 15.7495 15.5472C15.9773 15.4154 16.1664 15.226 16.2979 14.998C16.4294 14.7701 16.4985 14.5115 16.4985 14.2483C16.4984 13.9851 16.4291 13.7266 16.2975 13.4987Z"
            stroke="#F79009"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9 6.75V9.75"
            stroke="#F79009"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9 12.75H9.0075"
            stroke="#F79009"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <p className="m-0 font-medium text-[13px] text-[#b54708]">
          {t("login.Sessiyalar_limiti_tolgan")}
        </p>
        <p className="m-0 text-xs text-[#b54708]">
          {t("login.Tizimga_kirish_uchun_sessiyani_uzing")}
        </p>
        <p className="m-0 text-xs text-[#b54708]">
          {t("login.Qo_shimcha_{{count}}_ta_seansga_ruhsat_berilgan", {
            count: 1,
          })}
        </p>
      </div>
    </div>
  );
}
export { SessionWarning as UU };
