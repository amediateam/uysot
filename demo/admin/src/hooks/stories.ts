import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveStory,
  getActiveStoryCount,
  getNavigationTargets,
  getStory,
  getStoryFile,
  listStories,
  publishStory,
  saveStory,
  unpublishStory,
  uploadStoryFile,
} from "@/services/stories/api";
import { storyKeys } from "@/services/stories/keys";
import { isApiError } from "@/services/api-error";
import { readAsDataUrl } from "@/utils/read-as-data-url";
import type { Story, StoryListFilters } from "@/services/stories/types";

export const useStoriesQuery = (filters: StoryListFilters) =>
  useQuery({
    queryKey: storyKeys.list(filters),
    queryFn: () => listStories(filters),
    placeholderData: (prev) => prev,
  });

export const useStory = (id: number | null, { fresh = false }: { fresh?: boolean } = {}) =>
  useQuery({
    queryKey: storyKeys.detail(id ?? NaN),
    queryFn: () => getStory(id ?? NaN),
    enabled: id !== null && Number.isFinite(id),
    ...(fresh && { staleTime: 0, refetchOnMount: "always" as const }),
  });

// Cache helpers shared by the story mutations (recovered from the build).
export const useStoryCache = () => {
  const queryClient = useQueryClient();
  const refreshLists = () => {
    queryClient.invalidateQueries({ queryKey: storyKeys.lists() });
    queryClient.invalidateQueries({ queryKey: storyKeys.activeCount() });
  };
  return {
    refreshLists,
    refreshStory: (id: number) => {
      queryClient.invalidateQueries({ queryKey: storyKeys.detail(id) });
      refreshLists();
    },
    syncStory: (story: Story) => {
      queryClient.setQueryData(storyKeys.detail(story.id), story);
      refreshLists();
    },
  };
};

export const useSaveStory = () => {
  const { syncStory, refreshStory } = useStoryCache();
  return useMutation({
    mutationFn: saveStory,
    onSuccess: syncStory,
    onError: (error, { id }) => {
      if (id !== null && isApiError(error) && (error.code === 19002 || error.code === 19001)) {
        refreshStory(id);
      }
    },
  });
};

export const usePublishStory = () => {
  const { syncStory, refreshStory } = useStoryCache();
  return useMutation({
    mutationFn: publishStory,
    onSuccess: syncStory,
    onError: (error, id) => {
      if (isApiError(error) && error.code === 19002) refreshStory(id);
    },
  });
};

export const useUnpublishStory = () => {
  const { syncStory, refreshStory } = useStoryCache();
  return useMutation({
    mutationFn: unpublishStory,
    onSuccess: syncStory,
    onError: (error, id) => {
      if (isApiError(error) && error.code === 19002) refreshStory(id);
    },
  });
};

export const useArchiveStory = () => {
  const { refreshStory } = useStoryCache();
  return useMutation({
    mutationFn: archiveStory,
    onSettled: (_data, _error, id) => refreshStory(id),
  });
};

export const useActiveStoryCount = (enabled: boolean) =>
  useQuery({ queryKey: storyKeys.activeCount(), queryFn: getActiveStoryCount, enabled, staleTime: 0 });

export const useNavigationTargets = () =>
  useQuery({ queryKey: storyKeys.navigationTargets, queryFn: getNavigationTargets, staleTime: 1_800_000 });

// Fetches a story media file as a data URL, lazily (enable when in view).
export const useStoryImage = (fileId: number | null | undefined, enabled = true) =>
  useQuery({
    queryKey: storyKeys.file(typeof fileId === "number" ? fileId : NaN),
    queryFn: async () => {
      try {
        return await readAsDataUrl(await getStoryFile(fileId as number));
      } catch (error) {
        if (isApiError(error) && error.status === 404) return null;
        throw error;
      }
    },
    enabled: enabled && typeof fileId === "number" && Number.isFinite(fileId),
    staleTime: Infinity,
    retry: false,
  });

export const useUploadStoryFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: storyKeys.upload,
    mutationFn: uploadStoryFile,
    onSuccess: async (result, { file }) => {
      // Warm the cache with the just-uploaded image so the preview shows instantly.
      if (result.mediaType !== "IMAGE") return;
      const dataUrl = await readAsDataUrl(file).catch(() => null);
      if (dataUrl) queryClient.setQueryData(storyKeys.file(result.fileId), dataUrl);
    },
  });
};
