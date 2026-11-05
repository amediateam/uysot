import { StatusChip } from "@/components/ui/StatusChip";
import { STATUS_META } from "@/services/stories/constants";
import type { StoryStatus } from "@/services/stories/types";

// Story status pill (recovered from the build). Active stories pulse.
export const StoryStatusChip = ({ status }: { status: StoryStatus }) => (
  <StatusChip tone={STATUS_META[status].tone} label={STATUS_META[status].label} live={status === "ACTIVE"} />
);
