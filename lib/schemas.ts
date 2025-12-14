import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be at most 255 characters")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters"),
});

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be at most 255 characters")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required"),
});

export const guestSessionSchema = z.object({
  sessionToken: z
    .string()
    .uuid("Invalid session token format")
    .optional(),
});

export const mergeCartSchema = z.object({
  guestSessionToken: z
    .string()
    .uuid("Invalid guest session token format"),
  userId: z
    .string()
    .uuid("Invalid user ID format"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type GuestSessionData = z.infer<typeof guestSessionSchema>;
export type MergeCartData = z.infer<typeof mergeCartSchema>;
