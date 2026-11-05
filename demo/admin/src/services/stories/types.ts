import type { Paginated } from "@/services/companies/types";

// Stories domain types (recovered from usage in the build).
export type StoryStatus = "DRAFT" | "SCHEDULED" | "ACTIVE" | "EXPIRED" | "ARCHIVED";
export type StoryMediaType = "IMAGE" | "VIDEO";
export type StoryActionType = "NONE" | "INTERNAL" | "EXTERNAL";
export type Language = "uz" | "ru" | "tg";

export interface StoryContent {
  label: string;
  signature: string;
  body: string;
  buttonText: string;
}

export interface StoryAction {
  type: StoryActionType;
  value: string | null;
  params?: Record<string, unknown>;
}

export interface StoryFile {
  id: number;
  originalName: string;
  size: number;
  format: string;
  path: string;
}

export interface StoryStats {
  views: number;
  uniqueViewers: number;
  clicks: number;
  ctr: number | null;
}

// A row in the stories list.
export interface StoryListItem {
  id: number;
  signature: string;
  mediaType: StoryMediaType;
  languages: Language[];
  status: StoryStatus;
  action: StoryAction;
  priority: number;
  publishAt: string;
  expireAt: string;
  viewsCount: number;
  clicksCount: number;
  previewFileId: number | null;
}

// A fully-loaded story.
export interface Story {
  id: number;
  status: StoryStatus;
  mediaType: StoryMediaType;
  durationMs: number | null;
  displaySeconds: number | null;
  priority: number;
  publishAt: string;
  expireAt: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: { fullName: string } | null;
  content: { uz: StoryContent; ru: StoryContent | null; tg: StoryContent | null };
  action: StoryAction;
  media: StoryFile | null;
  poster: { id: number } | null;
  stats: StoryStats | null;
}

export interface StoryListFilters {
  status?: StoryStatus;
  sort: "PRIORITY" | "PUBLISH_AT";
  page: number;
  size: number;
}

export type StoryList = Paginated<StoryListItem>;

export interface NavigationTarget {
  code: string;
  label: string;
}

export interface StoryFileUpload {
  fileId: number;
  mediaType: StoryMediaType;
  durationMs: number | null;
  size: number;
}

// Payload sent to create/update a story.
export interface StoryRequest {
  mediaFileId: number;
  posterFileId: number | null;
  displaySeconds: number | null;
  content: { uz: SavedContent; ru: SavedContent; tg: SavedContent | null };
  action: StoryAction;
  priority: number;
  publishAt: string;
  expireAt: string;
}

export interface SavedContent {
  label: string | null;
  signature: string;
  body: string | null;
  buttonText: string | null;
}

// The editor's local form state (richer than the request).
export interface StoryFormMedia {
  mediaType: StoryMediaType;
  mediaFileId: number;
  posterFileId: number | null;
  durationMs: number | null;
  name: string;
  size: number;
  format: string | null;
}

export interface StoryFormValues {
  media: StoryFormMedia | null;
  displaySeconds: number;
  content: Record<Language, StoryContent>;
  actionType: StoryActionType;
  internalTarget: string | null;
  externalUrl: string;
  priority: number;
  publishAt: string;
  expireAt: string;
}
