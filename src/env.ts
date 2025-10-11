import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("0.0.0.0"),
  MONGODB_URI: z.string(),
});

export const env = envSchema.parse(process.env);
