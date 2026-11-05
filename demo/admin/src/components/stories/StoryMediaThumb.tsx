import { CaretRightFilled } from "@ant-design/icons";
import { useInView } from "@/hooks/use-in-view";
import { useStoryImage } from "@/hooks/stories";
import type { StoryMediaType } from "@/services/stories/types";

// Small lazy-loaded story thumbnail used in the list (recovered from the build).
export const StoryMediaThumb = ({
  fileId,
  mediaType,
}: {
  fileId: number | null;
  mediaType: StoryMediaType;
}) => {
  const { ref, inView } = useInView();
  const { data } = useStoryImage(fileId, inView);
  return (
    <div
      ref={ref}
      className="relative flex h-15 w-8.5 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-[repeating-linear-gradient(135deg,var(--color-border)_0_5px,var(--color-surface-muted)_5px_10px)] text-[10px] text-content-muted"
    >
      {data && <img src={data} alt="" className="absolute inset-0 size-full object-cover" />}
      {mediaType === "VIDEO" && (
        <CaretRightFilled
          aria-label="Video"
          className={`relative ${data ? "rounded-full bg-overlay p-1 text-content-inverse dark:text-content" : ""}`}
        />
      )}
    </div>
  );
};
