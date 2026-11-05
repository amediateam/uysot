import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  activateEskizAccount,
  createEskizAccount,
  deleteEskizAccount,
  getEskizBalance,
  listEskizAccounts,
  setEskizPassword,
  testSendSms,
  updateEskizAccount,
  verifyEskizAccount,
} from "@/services/eskiz/api";
import { eskizKeys } from "@/services/eskiz/keys";

// Invalidates account + balance caches after any Eskiz change.
const useRefreshEskiz = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: eskizKeys.accounts() });
    queryClient.invalidateQueries({ queryKey: eskizKeys.balance() });
  };
};

export const useEskizAccounts = () =>
  useQuery({ queryKey: eskizKeys.accounts(), queryFn: listEskizAccounts });

export const useEskizBalance = (enabled: boolean) =>
  useQuery({ queryKey: eskizKeys.balance(), queryFn: getEskizBalance, enabled, retry: false });

export const useCreateEskizAccount = () => {
  const refresh = useRefreshEskiz();
  return useMutation({ mutationFn: createEskizAccount, onSuccess: refresh });
};

export const useUpdateEskizAccount = () => {
  const refresh = useRefreshEskiz();
  return useMutation({ mutationFn: updateEskizAccount, onSuccess: refresh });
};

export const useSetEskizPassword = () => {
  const refresh = useRefreshEskiz();
  return useMutation({ mutationFn: setEskizPassword, onSuccess: refresh });
};

// Verify reports success or failure; refresh either way so the row's verify state updates.
export const useVerifyEskizAccount = () => {
  const refresh = useRefreshEskiz();
  return useMutation({ mutationFn: verifyEskizAccount, onSuccess: refresh, onError: refresh });
};

export const useActivateEskizAccount = () => {
  const refresh = useRefreshEskiz();
  return useMutation({ mutationFn: activateEskizAccount, onSuccess: refresh });
};

export const useTestSendSms = () => {
  const refresh = useRefreshEskiz();
  return useMutation({ mutationFn: testSendSms, onSuccess: refresh });
};

export const useDeleteEskizAccount = () => {
  const refresh = useRefreshEskiz();
  return useMutation({ mutationFn: deleteEskizAccount, onSuccess: refresh });
};
