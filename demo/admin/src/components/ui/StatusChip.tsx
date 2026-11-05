// Small colored status pill (recovered from the build).
export type ChipTone = "neutral" | "success" | "warning" | "danger" | "accent" | "progress";

const TONE_CLASS: Record<ChipTone, string> = {
  neutral: "bg-surface-muted text-content-secondary",
  success: "bg-success-soft text-success-strong",
  warning: "bg-warning-soft text-warning-strong",
  danger: "bg-danger-soft text-danger-strong",
  accent: "bg-accent-soft text-accent",
  progress: "bg-progress-soft text-progress-strong",
};

export const StatusChip = ({
  tone,
  label,
  live = false,
}: {
  tone: ChipTone;
  label: string;
  live?: boolean;
}) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${TONE_CLASS[tone]}`}
  >
    {live && <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-current" />}
    {label}
  </span>
);
