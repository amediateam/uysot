import { combineReducers, configureStore, type Reducer } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

// Root store (recovered from the build). Feature reducers are injected lazily and the
// root reducer is rebuilt via replaceReducer, so code-split features can register their
// own slices on demand. A no-op `_app` reducer keeps the store non-empty at startup.
const staticReducers = {
  _app: (state: unknown = null) => state,
};

const injectedReducers = new Map<string, Reducer>();

const buildRootReducer = () =>
  combineReducers({ ...staticReducers, ...Object.fromEntries(injectedReducers) });

export const store = configureStore({ reducer: buildRootReducer() });

export const injectReducer = (key: string, reducer: Reducer): void => {
  if (!injectedReducers.has(key)) {
    injectedReducers.set(key, reducer);
    store.replaceReducer(buildRootReducer());
  }
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
