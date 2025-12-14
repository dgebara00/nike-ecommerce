"use server";

import { signUpSchema } from "@/lib/schemas";
import { ZodError } from "zod";

export interface SignUpState {
  success: boolean;
  error?: string;
  fieldErrors?: {
    fullName?: string[];
    email?: string[];
    password?: string[];
  };
}

export async function signUpAction(
  _prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const validatedData = signUpSchema.parse(rawData);

    console.log("Sign up data validated:", validatedData);

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: "Please fix the errors below",
        fieldErrors: error.flatten().fieldErrors as SignUpState["fieldErrors"],
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
