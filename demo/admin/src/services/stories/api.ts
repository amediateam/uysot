import { http } from "@/services/http";
import type {
  NavigationTarget,
  Story,
  StoryFileUpload,
  StoryList,
  StoryListFilters,
  StoryRequest,
} from "@/services/stories/types";

const cleanParams = <T extends object>(params: T): Partial<T> =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined)) as Partial<T>;

// Stories API (recovered from the build).
export const listStories = async (filters: StoryListFilters): Promise<StoryList> => {
  const { data } = await http.get<StoryList>("/stories", { params: cleanParams(filters) });
  return data;
};

export const getStory = async (id: number): Promise<Story> => {
  const { data } = await http.get<Story>(`/stories/${id}`);
  return data;
};

export const saveStory = async ({ id, request }: { id: number | null; request: StoryRequest }): Promise<Story> => {
  const { data } = id === null
    ? await http.post<Story>("/stories", request)
    : await http.put<Story>(`/stories/${id}`, request);
  return data;
};

export const publishStory = async (id: number): Promise<Story> => {
  const { data } = await http.post<Story>(`/stories/${id}/publish`);
  return data;
};

export const unpublishStory = async (id: number): Promise<Story> => {
  const { data } = await http.post<Story>(`/stories/${id}/unpublish`);
  return data;
};

export const archiveStory = async (id: number): Promise<void> => {
  await http.delete(`/stories/${id}`);
};

export const getActiveStoryCount = async (): Promise<number> => {
  const { data } = await http.get<StoryList>("/stories", { params: { status: "ACTIVE", size: 1 } });
  return data.totalElements;
};

export const getNavigationTargets = async (): Promise<NavigationTarget[]> => {
  const { data } = await http.get<NavigationTarget[]>("/stories/navigation-targets");
  return data;
};

export const getStoryFile = async (fileId: number): Promise<Blob> => {
  const { data } = await http.get<Blob>(`/stories/files/${fileId}`, { responseType: "blob" });
  return data;
};

export const uploadStoryFile = async ({
  file,
  name,
  onProgress,
}: {
  file: Blob;
  name: string;
  onProgress?: (percent: number) => void;
}): Promise<StoryFileUpload> => {
  const body = new FormData();
  body.append("file", file, name);
  const { data } = await http.post<StoryFileUpload>("/stories/files", body, {
    headers: { "Content-Type": null },
    onUploadProgress: (event) => {
      if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100));
    },
  });
  return data;
};
