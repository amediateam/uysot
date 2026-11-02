// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (5)
import { createSlice, current } from "@reduxjs/toolkit";
import { Tt } from "@/utils/current-user";
import Mn from "crypto-js/aes";
import { kn } from "@/constants/index";
import { ce } from "@/utils/storage";
import { Zr, Ar, bb } from "@/constants/storage-keys";
import { zt } from "@/constants/permissions";
const TF = Object.entries({
  ...zt,
});
const wl = (e) =>
  TF?.reduce((t, [r, n]) => {
    if (!Number(r)) {
      t[r] = e?.includes(n) || false;
    }
    return t;
  }, {});
const initialState = {
  user: Tt || null,
  widgets: ce.get("widgets")
    ? ce.get("widgets")
    : [
        {
          icon: "",
          id: "files",
          status: true,
          type: "FILES",
        },
      ],
  firebaseToken: ce.get("firebaseToken") || null,
  isPermissions: wl(Tt?.role?.permissions),
  version: "1.260.0",
  stompConnected: false,
  collapse: !!ce.get(bb),
};
const SC = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (e, t) => {
      const { refresh, ...rest } = t.payload;
      if (rest.roleTokens?.length > 0) {
        const i = refresh
          ? {
              ...rest,
              role: rest?.role,
              branch: {
                id: rest?.branchId,
              },
            }
          : Tt?.branchId
          ? rest.roleTokens?.find((o) => o?.branch?.id === Tt?.branchId)
          : rest.roleTokens?.[0];
        const a = Mn.encrypt(
          JSON.stringify({
            ...rest,
            role: i?.role,
            branchId: i?.branch?.id,
          }),
          kn.CODE_KEY
        ).toString();
        e.user = {
          ...rest,
          role: i?.role,
          branchId: i?.branch?.id,
        };
        if (!rest.sessionLimitReached) {
          ce.set(Zr, a);
          ce.set(Ar, i?.accessToken);
        }
        e.isPermissions = wl(i?.role?.permissions);
      } else {
        const i = Mn.encrypt(JSON.stringify(t.payload), kn.CODE_KEY).toString();
        e.user = t.payload;
        if (!t.payload.sessionLimitReached) {
          ce.set(Zr, i);
          ce.set(Ar, t.payload.accessToken);
        }
        e.isPermissions = wl(t.payload?.role?.permissions);
      }
    },
    setUserPayload: (e, t) => {
      e.user = {
        ...e.user,
        ...t.payload,
      };
      const r = Mn.encrypt(
        JSON.stringify({
          ...e.user,
          ...t.payload,
        }),
        kn.CODE_KEY
      ).toString();
      ce.set(Zr, r);
    },
    setFirebaseToken: (e, t) => {
      e.firebaseToken = t.payload;
      ce.set("firebaseToken", t.payload || "");
    },
    clearAvatar: (e) => {
      const t = {
        ...current(e.user),
      };
      if (t) {
        t.avatar = null;
        const r = Mn.encrypt(JSON.stringify(t), kn.CODE_KEY).toString();
        ce.set(Zr, r);
        e.user = t;
      }
    },
    addAvatar: (e, t) => {
      const r = {
        ...current(e.user),
      };
      if (r) {
        r.avatar = t.payload;
        const n = Mn.encrypt(JSON.stringify(r), kn.CODE_KEY).toString();
        ce.set(Zr, n);
        e.user = r;
      }
    },
    setNewBranch: (e, t) => {
      const r = e.user?.roleTokens?.find((n) => (n?.branch?.id || n?.branch) === t.payload);
      if (r) {
        const n = Mn.encrypt(
          JSON.stringify({
            ...e.user,
            role: r.role,
            branchId: t.payload,
          }),
          kn.CODE_KEY
        ).toString();
        ce.set(Zr, n);
        ce.set(Ar, r.accessToken);
        e.user = {
          ...e.user,
          role: r.role,
          branchId: t.payload,
        };
        e.isPermissions = wl(r.role?.permissions);
      }
    },
    setWidget: (e, t) => {
      const { widgets } = current(e);
      const n = [...(widgets || [])].map((i) => {
        if (i.id === t.payload.id) {
          return {
            ...i,
            ...t.payload,
          };
        }
        return i;
      });
      e.widgets = n;
      ce.set("widgets", JSON.stringify(n));
    },
    setVersion: (e, t) => {
      e.version = t.payload;
    },
    setStompClient: (e, t) => {
      e.stompClient = t.payload;
      e.stompConnected = false;
    },
    setStompConnected: (e, t) => {
      e.stompConnected = t.payload;
    },
    setCollapse: (e, t) => {
      ce.set(bb, String(t.payload));
      e.collapse = t.payload;
    },
  },
});
const {
  setUser,
  clearAvatar,
  addAvatar,
  setNewBranch,
  setWidget,
  setFirebaseToken,
  setUserPayload,
  setVersion,
  setStompClient,
  setStompConnected,
  setCollapse,
} = SC.actions;
export { setFirebaseToken as Cz, setUser as EC, SC };
