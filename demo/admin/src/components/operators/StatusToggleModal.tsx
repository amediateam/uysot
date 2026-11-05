import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useApiMessage } from "@/hooks/use-api-message";
import { useSetOperatorStatus } from "@/hooks/operators";
import type { Operator } from "@/services/operators/types";

// Block / unblock operator confirmation (recovered from the build).
export const StatusToggleModal = ({
  operator,
  onClose,
}: {
  operator: Operator | null;
  onClose: () => void;
}) => {
  const toast = useApiMessage();
  const { mutate, isPending } = useSetOperatorStatus();
  const isActive = operator?.status === "ACTIVE";

  return (
    <ConfirmModal
      open={operator !== null}
      tone={isActive ? "danger" : "neutral"}
      title={isActive ? `${operator?.fullName} bloklansinmi?` : `${operator?.fullName} blokdan chiqarilsinmi?`}
      description={
        isActive
          ? "Bloklangan operator panelga kira olmaydi va barcha sessiyalari darhol uziladi. Operator o‘chirilmaydi — audit yozuvlari joyida qoladi."
          : "Operator yana panelga kira oladi."
      }
      confirmLabel={isActive ? "Bloklash" : "Blokdan chiqarish"}
      loading={isPending}
      auditNote
      onCancel={onClose}
      onConfirm={() => {
        if (!operator) return;
        mutate(
          { id: operator.id, status: isActive ? "BLOCKED" : "ACTIVE" },
          {
            onSuccess: (updated) => {
              onClose();
              toast.success(
                updated.status === "BLOCKED" ? "Operator bloklandi" : "Operator blokdan chiqarildi",
              );
            },
            onError: (error) => toast.error(error),
          },
        );
      }}
    />
  );
};
