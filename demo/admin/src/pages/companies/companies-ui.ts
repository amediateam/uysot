import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { injectReducer, useAppDispatch, useAppSelector, type RootState } from "@/store";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

// Companies list UI state (recovered from the build): a lazily-injected slice holding the
// search text, PRO filter and pagination.
interface CompaniesUiState {
  search: string;
  isPremium: boolean | null;
  page: number;
  size: number;
}

const initialState: CompaniesUiState = { search: "", isPremium: null, page: 0, size: 20 };

const companiesUiSlice = createSlice({
  name: "companiesUi",
  initialState,
  reducers: {
    searchChanged: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 0;
    },
    premiumFilterChanged: (state, action: PayloadAction<boolean | null>) => {
      state.isPremium = action.payload;
      state.page = 0;
    },
    pageChanged: (state, action: PayloadAction<{ page: number; size: number }>) => {
      state.page = action.payload.page;
      state.size = action.payload.size;
    },
    filtersCleared: () => initialState,
  },
});

const { searchChanged, premiumFilterChanged, pageChanged, filtersCleared } = companiesUiSlice.actions;
injectReducer(companiesUiSlice.name, companiesUiSlice.reducer);

const selectCompaniesUi = (state: RootState): CompaniesUiState =>
  (state as { companiesUi?: CompaniesUiState }).companiesUi ?? initialState;

export const useCompaniesUi = () => {
  const dispatch = useAppDispatch();
  const ui = useAppSelector(selectCompaniesUi);
  return {
    ui,
    filters: {
      search: useDebouncedValue(ui.search, 300) || undefined,
      isPremium: ui.isPremium ?? undefined,
      page: ui.page,
      size: ui.size,
    },
    setSearch: useCallback((value: string) => dispatch(searchChanged(value)), [dispatch]),
    setPremiumFilter: useCallback((value: boolean | null) => dispatch(premiumFilterChanged(value)), [dispatch]),
    setPage: useCallback((page: number, size: number) => dispatch(pageChanged({ page, size })), [dispatch]),
    clearFilters: useCallback(() => dispatch(filtersCleared()), [dispatch]),
  };
};
