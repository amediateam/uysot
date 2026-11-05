import { z } from "zod";

// Category rename form schema (recovered from the build).
export const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  banners_count: z.number().optional(),
});
export type CategoryForm = z.infer<typeof categorySchema>;

// Banner create/edit form schema (recovered from the build), with localized messages.
export const bannerFormSchema = z.object({
  id: z.number().optional(),
  page_type: z.string({ message: "Sahifa nomini tanlang!" }),
  position: z.string({ message: "Joylashivini tanlang" }),
  target_url_uz: z.string({ message: "Target link uz ni kiriting!" }),
  target_url_ru: z.string({ message: "Target link ru ni kiriting!" }),
  status: z.boolean().optional(),
  expected_views: z.string().optional(),
  expected_clicks: z.string().optional(),
  blank: z.boolean().optional(),
  images: z.any({ message: "Rasmlarni yuklang!" }),
  logo: z.any().optional().nullable(),
  title_uz: z.any().optional(),
  title_ru: z.any().optional(),
  subtitle_uz: z.any().optional(),
  subtitle_ru: z.any().optional(),
});
export type BannerFormValues = z.infer<typeof bannerFormSchema>;
