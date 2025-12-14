"use server";

import { signUp, type AuthActionState } from "@/lib/auth/actions";

export type SignUpState = AuthActionState;

export async function signUpAction(
  prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  return signUp(prevState, formData);
}
