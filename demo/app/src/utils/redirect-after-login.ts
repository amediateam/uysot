// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (7)
import { zt } from "@/constants/permissions";
import { Ot, jr } from "@/constants/routes";
import { ce } from "@/utils/storage";
import { sa } from "@/constants/storage-keys";
const NF = [
  {
    permission: zt.PERMISSION_READ_FLATS,
    url: Ot.MAIN + jr.INDEX,
  },
  {
    permission: zt.PERMISSION_READ_BOOKINGS,
    url: Ot.MAIN + jr.ORDER,
  },
  {
    permission: zt.PERMISSION_READ_CONTRACTS,
    url: Ot.MAIN + jr.CONTRACT,
  },
  {
    permission: zt.PERMISSION_READ_PAYMENTS,
    url: Ot.MAIN + jr.PAYMENT,
  },
  {
    permission: zt.PERMISSION_READ_CLIENTS,
    url: Ot.MAIN + jr.CLIENT,
  },
  {
    permission: zt.PERMISSION_READ_DEBTS,
    url: Ot.MAIN + jr.ARREARAGE,
  },
  {
    permission: zt.PERMISSION_READ_MESSAGES,
    url: Ot.MAIN + jr.MESSAGE,
  },
  {
    permission: zt.PERMISSION_CHANGES,
    url: Ot.MAIN + jr.CHANGES,
  },
  {
    permission: zt.PERMISSION_READ_STAFF,
    url: Ot.MAIN + jr.BROKER,
  },
  {
    permission: zt.PERMISSION_PAGE_CRM,
    url: Ot.MAIN + jr.CRM,
  },
  {
    permission: zt.PERMISSION_CHANGE_PASSWORD_EMPLOYEE,
    url: Ot.CHANGE_PASSWORD,
  },
];
const kF = ["", "/", "/main", "/main/home"];
const MF = (e) => {
  try {
    return new URL(e, window.location.origin).pathname;
  } catch {
    return e.split("?")[0];
  }
};
const wh = (e) => {
  let t = "";
  if (e?.includes(zt.PERMISSION_REALTOR_PAGE)) {
    t = "/realtor/search";
  } else {
    NF.forEach((r) => {
      if (!t && e?.includes(r.permission)) {
        t = r?.url;
      }
    });
  }
  return t;
};
const DF = (e) => {
  const t = e?.role ? e?.role?.permissions : e?.roleTokens && e?.roleTokens?.[0]?.role?.permissions;
  const r = () => {
    const n = ce.get(sa) ? String(ce.get(sa)) : "";
    if (MF(n) === Ot.OAUTH_AUTHORIZE) {
      return n;
    }
    if (t?.includes(zt.PERMISSION_REALTOR_PAGE)) {
      return "/realtor/search";
    }
    return n || wh(t);
  };
  window.location.replace(kF.includes(String(ce.get(sa))) ? wh(t) : r());
};
const LF = 15000;
const CC = "recaptcha_execute_timeout";
export { CC, DF, LF, wh };
