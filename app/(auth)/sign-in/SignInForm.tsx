"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Chrome, Apple } from "lucide-react";

import Button from "@/components/Button";
import Input from "@/components/Input";

import { signIn, type AuthActionState } from "@/lib/auth/actions";

const initialState: AuthActionState = {
  success: false,
};

export default function SignInForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(
    signIn,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.push('/');
    }
  }, [router, state.success]);

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
          Or sign in with
        </span>
        <div className="h-px flex-1 bg-light-300" />
      </div>

      <form action={formAction} className="flex flex-col gap-4">
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
          placeholder="Enter your password"
          autoComplete="current-password"
          error={state.fieldErrors?.password?.[0]}
        />

        <Button type="submit" fullWidth disabled={isPending} className="mt-2">
          {isPending ? "Signing in..." : "Sign In"}
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
