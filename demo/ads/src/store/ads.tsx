import { createContext, useContext, useState, type ReactNode } from "react";
import { NumberParam, useQueryParams, withDefault } from "use-query-params";

// Which modal is open in the advertising section, and its payload.
export type AdsModal = "ADS_CREATE" | "ADS_UPDATE" | "ADS_STATS";
export type AdsPayload = Partial<Record<AdsModal, { id?: number } | undefined>>;

export interface AdsListQuery {
  page: number | null | undefined;
  size: number;
}

interface AdsContextValue {
  ads: AdsModal | undefined;
  getData: AdsPayload | undefined;
  setAds: (modal: AdsModal, payload?: { id?: number }) => void;
  closeAction: () => void;
  query: AdsListQuery;
  setQuery: (patch: Partial<AdsListQuery>) => void;
}

const AdsContext = createContext<AdsContextValue>({} as AdsContextValue);

// Advertising section state (recovered from the build): the pagination query lives in the
// URL (use-query-params), the open modal + its payload in local state.
export const AdsProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useQueryParams({
    size: withDefault(NumberParam, 10),
    page: NumberParam,
  });
  const [ads, setAdsState] = useState<AdsModal | undefined>(undefined);
  const [getData, setGetData] = useState<AdsPayload | undefined>(undefined);

  const setAds = (modal: AdsModal, payload?: { id?: number }) => {
    setAdsState(modal);
    setGetData((prev) => ({ ...prev, [modal]: payload }));
  };

  const closeAction = () => {
    setAdsState(undefined);
    setGetData(undefined);
  };

  return (
    <AdsContext.Provider
      value={{ ads, getData, setAds, closeAction, query: query as AdsListQuery, setQuery }}
    >
      {children}
    </AdsContext.Provider>
  );
};

export const useAds = () => useContext(AdsContext);
