"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Chrome, Apple } from "lucide-react";

import Button from "@/components/Button";
import Input from "@/components/Input";

import { signUpAction, type SignUpState } from "./actions";

const initialState: SignUpState = {
  success: false,
};

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.push(state.redirectTo || redirectTo);
      router.refresh();
    }
  }, [state.success, state.redirectTo, redirectTo, router]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Button variant="outline" fullWidth type="button">
          <Chrome className="h-5 w-5" aria-hidden="true" />
          Continue with Google
        </Button>
        <Button variant="outline" fullWidth type="button">
          <Apple className="h-5 w-5" aria-hidden="true" />
          Continue with Apple
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-light-300" />
        <span className="text-caption font-caption text-dark-500">
          Or sign up with
        </span>
        <div className="h-px flex-1 bg-light-300" />
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <Input
          name="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          autoComplete="name"
          error={state.fieldErrors?.fullName?.[0]}
        />
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          autoComplete="email"
          error={state.fieldErrors?.email?.[0]}
        />
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="minimum 8 characters"
          autoComplete="new-password"
          error={state.fieldErrors?.password?.[0]}
        />

        <Button type="submit" fullWidth disabled={isPending} className="mt-2">
          {isPending ? "Signing up..." : "Sign Up"}
        </Button>

        {state.error && !state.fieldErrors && (
          <p className="text-center text-caption font-caption text-red" role="alert">
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}
