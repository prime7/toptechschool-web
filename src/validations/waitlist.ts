import { z } from "zod";

export const waitlistSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
