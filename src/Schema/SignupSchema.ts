import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(15, { message: "Username must be at most 20 characters" })
  .regex(/^[a-zA-Z0-9_]*$/, {
    message: "Username must only contain letters, numbers, and underscores",
  });

export const SignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email" }),
  username: usernameSchema,
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
