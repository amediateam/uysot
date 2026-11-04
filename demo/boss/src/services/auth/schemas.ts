import { z } from "zod";

const roleSchema = z.object({
  lang: z.object({
    uz: z.string(),
    ru: z.string(),
    en: z.string(),
    kr: z.string(),
    tr: z.string(),
    default: z.string(),
  }),
  permissions: z.array(z.number()),
});

const widgetSchema = z.object({
  type: z.string(),
  status: z.boolean(),
  icon: z.string(),
  id: z.number(),
});

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  fullName: z.string(),
  avatar: z.string(),
  companyId: z.number(),
  role: roleSchema,
  widgets: z.array(widgetSchema),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
});

export const loginSchema = z.object({
  username: z.string().min(3).trim(),
  password: z.string().min(4).trim(),
});

export type User = z.infer<typeof userSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
