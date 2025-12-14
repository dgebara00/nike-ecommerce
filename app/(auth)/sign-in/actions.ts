"use server";

import { signIn, type AuthActionState } from "@/lib/auth/actions";

export type SignInState = AuthActionState;

export async function signInAction(
  prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  return signIn(prevState, formData);
}
