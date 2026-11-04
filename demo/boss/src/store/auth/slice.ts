import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createTransform, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import type { User } from "@/services/auth/schemas";

interface AuthState {
  user: User | null;
  isFetched: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isFetched: true,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, { payload }: PayloadAction<{ user: User }>) {
      state.user = payload.user;
      state.isFetched = true;
    },
    logout(state) {
      state.user = null;
      state.isFetched = true;
      state.accessToken = null;
      state.refreshToken = null;
    },
    changeToken(
      state,
      { payload }: PayloadAction<{ accessToken: string | null; refreshToken: string | null }>,
    ) {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
    },
  },
});

// При восстановлении: если токен сохранён, isFetched = false, пока не загрузится пользователь.
const isFetchedTransform = createTransform(
  (inboundState) => inboundState,
  (_outboundState, _key, rawState) => !JSON.parse(rawState.accessToken),
  { whitelist: ["isFetched"] },
);

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken", "refreshToken", "isFetched"],
  transforms: [isFetchedTransform],
};

export const authReducer = persistReducer(authPersistConfig, authSlice.reducer);
export const { login, logout, changeToken } = authSlice.actions;
