import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100),
  email: z.email(),
  age: z.number().min(0).max(120),
});

export type UserModelType = z.infer<typeof userSchema>;
