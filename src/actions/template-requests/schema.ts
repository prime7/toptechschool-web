import { z } from "zod";

export const templateRequestSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

export type TemplateRequestInput = z.infer<typeof templateRequestSchema>;
