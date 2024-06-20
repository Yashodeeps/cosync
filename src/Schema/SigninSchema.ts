import { z } from "zod";
import { usernameSchema } from "./SignupSchema";

export const SigninSchema = z.object({
  identifier: z.union([
    z.string().email({ message: "Invalid email" }),
    usernameSchema,
  ]),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
