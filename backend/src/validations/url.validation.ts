import { z } from "zod";

/**
 * Regex to validate MongoDB ObjectId format
 */
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const updateUrlSchema = z.object({
  // Validate the URL ID in the request parameters
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid URL ID format"),
  }),

  // Validate the update data in the request body
  body: z.object({
    expiresAt: z
      .string()
      .datetime({ message: "Invalid date format. Use ISO 8601" })
      .optional(),
    
    isExpired: z.boolean().optional(),
    
    isLinkPassword: z.boolean().optional(),
    
    password: z
      .string()
      .min(8, "Link password must be at least 8 characters long")
      .optional(),
  })
  .refine(
    (data) => {
      // If the user sets isLinkPassword to true, they MUST provide a password
      if (data.isLinkPassword === true && !data.password) return false;
      return true;
    },
    {
      message: "Password is required when enabling link protection",
      path: ["password"], // Highlights the password field in the error response
    }
  ),
});

// Extract types for use in controllers
export type UpdateUrlInput = z.infer<typeof updateUrlSchema>;