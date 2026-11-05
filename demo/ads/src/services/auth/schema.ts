import { z } from "zod";

// Login form schema (recovered from the build).
export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type LoginForm = z.infer<typeof loginSchema>;
