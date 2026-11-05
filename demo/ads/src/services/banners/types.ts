// Banners / advertising domain types (recovered from the build's zod schemas + usage).

export interface BannerCategory {
  id: number;
  name: string;
  banners_count: number;
}

export interface Language {
  id: number;
  code: string;
  name: string;
}

// Uploaded image/file descriptor.
export interface UploadedFile {
  id: number;
  uuid: string;
  url: string;
  type: string;
  size: number;
  file_format_type: string;
  language_id?: number;
  language_code?: string;
  name: string;
}

export interface BannerCount {
  actual: number;
  expected: number;
}

// A row in the banners table of an advertising collection.
export interface BannerRow {
  id: number;
  page_type: string;
  position: string;
  target_url: string;
  status: boolean;
  views: BannerCount;
  clicks: BannerCount;
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  total: number;
}

// A full banner (for the edit form).
export interface BannerDetail {
  id: number;
  page_type: string;
  position: string;
  target_url_uz: string;
  target_url_ru: string;
  status: boolean;
  expected_views: number;
  expected_clicks: number;
  blank: boolean;
  images: UploadedFile[];
  title_uz?: string | null;
  title_ru?: string | null;
  subtitle_uz?: string | null;
  subtitle_ru?: string | null;
  logo?: UploadedFile | null;
}

export interface StatPoint {
  date: string;
  view_count: number;
  click_count: number;
}

export interface StatisticsQuery {
  min_date?: string;
  max_date?: string;
  banner_id?: number;
}

export interface BannerListQuery {
  banner_category_id: number;
  page?: number | null;
  size?: number;
}
