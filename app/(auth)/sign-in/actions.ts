"use server";

import { signInSchema } from "@/lib/schemas";
import { ZodError } from "zod";

export interface SignInState {
  success: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
}

export async function signInAction(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const validatedData = signInSchema.parse(rawData);

    console.log("Sign in data validated:", validatedData);

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: "Please fix the errors below",
        fieldErrors: error.flatten().fieldErrors as SignInState["fieldErrors"],
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
