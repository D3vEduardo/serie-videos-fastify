"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(3000),
    HOST: zod_1.z.string().default("0.0.0.0"),
    MONGODB_URI: zod_1.z.string(),
});
exports.env = envSchema.parse({
    ...process.env,
    MONGODB_URI: process.env.NODE_ENV === "test"
        ? "http://localhost:1234/test"
        : process.env.MONGODB_URI,
});
