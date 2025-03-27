import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
