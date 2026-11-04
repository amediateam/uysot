import { useEffect } from "react";
import { useQuery, type QueryKey, type UseQueryOptions } from "@tanstack/react-query";

type UseQueryWithCallbacksOptions<TData> = UseQueryOptions<TData, unknown, TData, QueryKey> & {
  onError?: (error: unknown) => void;
  onSuccess?: (data: TData) => void;
};

// В @tanstack/react-query v5 у useQuery нет onSuccess/onError, поэтому они сделаны через эффекты.
export const useQueryWithCallbacks = <TData,>({
  onError,
  onSuccess,
  ...options
}: UseQueryWithCallbacksOptions<TData>) => {
  const query = useQuery({ ...options });

  useEffect(() => {
    if (query.data && onSuccess) onSuccess(query.data);
  }, [query.data]);

  useEffect(() => {
    if (query.error && onError) onError(query.error);
  }, [query.error]);

  return query;
};
