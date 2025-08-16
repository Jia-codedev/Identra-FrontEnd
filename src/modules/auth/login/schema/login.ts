import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().min(3, { message: "Login must be at least 3 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

export type LoginForm = z.infer<typeof loginSchema>;
