import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOperator,
  getOperator,
  getOperatorSessions,
  listOperators,
  revokeAllSessions,
  revokeSession,
  setOperatorPassword,
  setOperatorStatus,
  updateOperator,
} from "@/services/operators/api";
import { operatorKeys } from "@/services/operators/keys";
import { authKeys } from "@/services/auth/keys";
import type { Operator, OperatorListFilters } from "@/services/operators/types";

const useOperatorSync = () => {
  const queryClient = useQueryClient();
  return {
    queryClient,
    syncOperator: (operator: Operator) => {
      queryClient.setQueryData(operatorKeys.detail(Number(operator.id)), operator);
      queryClient.invalidateQueries({ queryKey: operatorKeys.all });
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  };
};

export const useOperatorsQuery = (filters: OperatorListFilters) =>
  useQuery({
    queryKey: operatorKeys.list(filters),
    queryFn: () => listOperators(filters),
    placeholderData: keepPreviousData,
  });

export const useOperatorQuery = (id: number) =>
  useQuery({ queryKey: operatorKeys.detail(id), queryFn: () => getOperator(id), enabled: Number.isFinite(id) });

export const useOperatorSessionsQuery = (id: number) =>
  useQuery({
    queryKey: operatorKeys.sessions(id),
    queryFn: () => getOperatorSessions(id),
    enabled: Number.isFinite(id),
  });

export const useCreateOperator = () => {
  const { syncOperator } = useOperatorSync();
  return useMutation({ mutationFn: createOperator, onSuccess: syncOperator });
};

export const useUpdateOperator = () => {
  const { syncOperator } = useOperatorSync();
  return useMutation({ mutationFn: updateOperator, onSuccess: syncOperator });
};

export const useSetOperatorStatus = () => {
  const { queryClient, syncOperator } = useOperatorSync();
  return useMutation({
    mutationFn: setOperatorStatus,
    onSuccess: (operator) => {
      syncOperator(operator);
      queryClient.invalidateQueries({ queryKey: operatorKeys.sessions(Number(operator.id)) });
    },
  });
};

export const useSetOperatorPassword = () => {
  const { queryClient } = useOperatorSync();
  return useMutation({
    mutationFn: setOperatorPassword,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: operatorKeys.all });
      queryClient.invalidateQueries({ queryKey: operatorKeys.sessions(Number(id)) });
    },
  });
};

export const useRevokeSession = (operatorId: number) => {
  const { queryClient } = useOperatorSync();
  return useMutation({
    mutationFn: (sessionId: string) => revokeSession(operatorId, sessionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: operatorKeys.sessions(operatorId) }),
  });
};

export const useRevokeAllSessions = (operatorId: number) => {
  const { queryClient } = useOperatorSync();
  return useMutation({
    mutationFn: () => revokeAllSessions(operatorId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: operatorKeys.sessions(operatorId) }),
  });
};
