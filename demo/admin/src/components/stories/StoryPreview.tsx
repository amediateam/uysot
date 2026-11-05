import { CaretRightFilled } from "@ant-design/icons";
import { useStoryImage } from "@/hooks/stories";
import type { StoryContent, StoryMediaType } from "@/services/stories/types";

// Phone-frame live preview of a story (recovered from the build).
interface PreviewMedia {
  type: StoryMediaType;
  imageFileId: number | null;
}

const SIZES = {
  md: { frame: "h-140 w-75 rounded-[34px] p-2", screen: "rounded-[27px]", title: "text-[21px]" },
  sm: { frame: "h-118 w-63 rounded-[30px] p-1.75", screen: "rounded-3xl", title: "text-lg" },
} as const;

const INVERSE = "text-content-inverse dark:text-content";

const PreviewMediaLayer = ({ media }: { media?: PreviewMedia }) => {
  const { data } = useStoryImage(media?.imageFileId ?? undefined);
  return (
    <>
      {data ? (
        <img src={data} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <p className="absolute inset-x-0 top-1/2 text-center font-mono text-[10px] text-content-inverse/40 dark:text-content/40">
          media · 1080×1920
        </p>
      )}
      {media?.type === "VIDEO" && (
        <span className="absolute inset-0 flex items-center justify-center">
          <CaretRightFilled aria-label="Video" className="rounded-full bg-overlay p-3 text-xl text-content-inverse dark:text-content" />
        </span>
      )}
    </>
  );
};

export const StoryPreview = ({
  content,
  showButton,
  media,
  size = "md",
}: {
  content: StoryContent;
  showButton: boolean;
  media?: PreviewMedia;
  size?: "md" | "sm";
}) => {
  const sz = SIZES[size];
  const label = content.label.trim();
  const body = content.body.trim();
  return (
    <div className={`shrink-0 bg-content ring-1 ring-border dark:bg-canvas ${sz.frame}`}>
      <div
        className={`relative flex size-full flex-col justify-between overflow-hidden bg-content-secondary dark:bg-border-strong ${sz.screen} ${INVERSE}`}
      >
        <PreviewMediaLayer media={media} />
        <div className="relative flex flex-col gap-2.5 px-3 pt-3">
          <div className="flex gap-1">
            <span className="h-0.75 flex-1 rounded-full bg-content-inverse/90 dark:bg-content/90" />
            <span className="h-0.75 flex-1 rounded-full bg-content-inverse/35 dark:bg-content/35" />
            <span className="h-0.75 flex-1 rounded-full bg-content-inverse/35 dark:bg-content/35" />
          </div>
          <div className="flex items-center gap-2">
            <span className="flex size-6.5 items-center justify-center rounded-full bg-content-inverse text-[11px] font-bold text-content dark:bg-content dark:text-canvas">
              U
            </span>
            <span className="text-xs font-semibold">UYIM</span>
            <span aria-hidden className="ml-auto text-sm opacity-80">
              ✕
            </span>
          </div>
        </div>
        <div className="relative flex flex-col gap-2 bg-linear-to-t from-content/75 to-transparent px-4 pt-15 pb-4.5 dark:from-canvas/80">
          {label && (
            <span className="self-start rounded-full bg-content-inverse/20 px-2.5 py-1 text-[11px] font-semibold dark:bg-content/20">
              {label}
            </span>
          )}
          <p
            className={`leading-tight font-bold tracking-tight text-pretty break-words ${sz.title} ${
              content.signature.trim() ? "" : "opacity-50"
            }`}
          >
            {content.signature.trim() || "Sarlavha"}
          </p>
          {body && <p className="text-[13px] leading-normal break-words opacity-85">{body}</p>}
          {showButton && (
            <span className="mt-1.5 flex h-11 items-center justify-center rounded-md bg-content-inverse px-3 text-sm font-semibold text-content dark:bg-content dark:text-canvas">
              {content.buttonText.trim() || "Tugma matni"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
