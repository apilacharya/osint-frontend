import { z } from "zod";

export const searchFormSchema = z.object({
  query: z.string().trim().min(2, "Query must be at least 2 characters long."),
  entityType: z.enum(["PERSON", "COMPANY", "UNKNOWN"]),
  aliases: z.string().trim().optional(),
  location: z.string().trim().optional(),
  industry: z.string().trim().optional()
});

export type SearchFormValues = z.input<typeof searchFormSchema>;
export type SearchFormInput = z.infer<typeof searchFormSchema>;
