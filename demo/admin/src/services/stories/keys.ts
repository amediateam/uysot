import type { StoryListFilters } from "@/services/stories/types";

// Stories query keys (recovered from the build).
export const storyKeys = {
  all: ["stories"] as const,
  lists: () => [...storyKeys.all, "list"] as const,
  list: (filters: StoryListFilters) => [...storyKeys.lists(), filters] as const,
  activeCount: () => [...storyKeys.all, "active-count"] as const,
  detail: (id: number) => [...storyKeys.all, "detail", id] as const,
  navigationTargets: ["story-navigation-targets"] as const,
  upload: ["stories", "upload"] as const,
  file: (id: number) => ["story-files", id] as const,
};
