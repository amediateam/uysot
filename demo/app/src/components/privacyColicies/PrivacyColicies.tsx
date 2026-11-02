// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: index-C9x7MnxX (1)
import { useTranslation } from "react-i18next";
import * as i from "react/jsx-runtime";
import s from "@/components/privacyColicies/PrivacyColicies.module.css";
export const l = () => {
  const { t } = useTranslation();
  return (
    <div className={s.container}>
      <h1>{t("privacy_policies.Maxfiylik_va_axborotni_himoya_qilish")}</h1>
      <li>{t("privacy_policies.MIJOZ_TOMONIDAN_MALUMOTLARNI_TAQDIM_ETISH")}</li>
      <p>{t("privacy_policies.Mijozning_shaxsiy_malumotlari_Ozbekiston_Respublikasining")}</p>
      <p>{t("privacy_policies.App_uysot_uz_saytida_royxatdan_otishda_Mijoz_quyidagi")}</p>
      <p>
        {t(
          "privacy_policies.Mijoz_oz_shaxsiy_malumotlarini_taqdim_etish_orqali_oz_majburiyatlarin_ibajarish_uchun"
        )}
      </p>
      <p>
        {t(
          "privacy_policies.Shaxsiy_malumotlarni_qayta_ishlash_deganda_shaxsiy_malumotlar_bilan_avtomatlashtirish"
        )}
      </p>
      <p>
        {t("privacy_policies.Agar_mijoz_ozining_shaxsiy_malumotlariga_aniqlik_kiritmoqchi_bolsa")}
      </p>
      <p>{t("privacy_policies.Sotuvchi_Mijoz_tomonidan_taqdim_etilgan_malumotlardan_Mijozni")}</p>
      <li>{t("privacy_policies.Saytda_mijozni_royxatdan_otkazish_avtorizatsiya_qilish")}</li>
      <li>{t("privacy_policies.mijozlarni_qollab_quvvatlash")}</li>
      <li>{t("privacy_policies.asosiy_malumotlarni_taqdim_etish")}</li>
      <li>{t("privacy_policies.mijoz_oldidagi_majburiyatlarini_bajarish")}</li>
      <li>{t("privacy_policies.xizmatlarni_ilgari_surish_boyicha_tadbirlarni_amalga_oshirish")}</li>
      <li>
        {t("privacy_policies.SOTUVCHI_TOMONIDAN_OLINGAN_MALUMOTLARNI_TAQDIM_ETISH_VA_UZATISH")}
      </li>
      <p>
        {t("privacy_policies.Sotuvchi_mijozdan_olingan_malumotlarni_uchinchi_shaxslarga_bermaslik")}
      </p>
      <p>{t("privacy_policies.Bu_Uzbekiston_Respublikasi_qonunchiligining_oqilona")}</p>
      <p>
        {t(
          "privacy_policies.Sotuvchi_cookie_texnologiyasidan_foydalanish_huquqiga_ega_Cookie_fayllari"
        )}
      </p>
      <p>{t("privacy_policies.Sotuvchi_app_uysot_uz_saytiga_tashrif_buyuruvchining")}</p>
      <p>{t("privacy_policies.Sotuvchi_Mijoz_tomonidan_Saytda_ochiq_shaklda")}</p>
      <p>
        {t("privacy_policies.Sotuvchi_shaxsiy_malumotlarni_qayta_ishlashda_shaxsiy_malumotlarni")}
      </p>
      <li>{t("privacy_policies.MIJOZ_TOMONIDAN_MALUMOTLARNI_SAQLASH_VA_ULARDAN_FOYDALANISH")}</li>
      <p>{t("privacy_policies.Mijoz_tizimiga_avtorizatsiya_qilish_uchun_foydalangan")}</p>
      <p>{t("privacy_policies.Mijoz_login_va_parolni_saqlash_va_undan_foydalanishda")}</p>
      <p>{t("privacy_policies.Agar_sotuvchida_uchinchi_shaxs_yoki_zararli_dasturiy_taminot")}</p>
      <p>{t("privacy_policies.Softex_XK_direktori_Akmal_Bakhronov")}</p>
    </div>
  );
};
