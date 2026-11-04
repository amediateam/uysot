import { z } from "zod";

export const errorResponseSchema = z.object({
  id: z.string(),
  message: z.string(),
});
