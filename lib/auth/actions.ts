"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { guest } from "@/db/schema";
import {
  signUpSchema,
  signInSchema,
  type SignUpFormData,
  type SignInFormData,
} from "@/lib/schemas";

const GUEST_SESSION_COOKIE = "guest_session";
const GUEST_SESSION_EXPIRY_DAYS = 7;

export interface AuthActionState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = signUpSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      error: "Please fix the errors below",
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const validatedData: SignUpFormData = result.data;

  try {
    const response = await auth.api.signUpEmail({
      body: {
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
      },
    });

    if (!response) {
      return {
        success: false,
        error: "Failed to create account. Please try again.",
      };
    }

    const guestSessionToken = await getGuestSessionToken();
    if (guestSessionToken && response.user?.id) {
      await mergeGuestCartWithUserCart(guestSessionToken, response.user.id);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Sign up error:", error);

    if (error instanceof Error) {
      if (error.message.includes("email") || error.message.includes("exists")) {
        return {
          success: false,
          error: "An account with this email already exists.",
        };
      }
    }

    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = signInSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      error: "Please fix the errors below",
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const validatedData: SignInFormData = result.data;

  try {
    const response = await auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
      },
    });

    if (!response) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    const guestSessionToken = await getGuestSessionToken();
    if (guestSessionToken && response.user?.id) {
      await mergeGuestCartWithUserCart(guestSessionToken, response.user.id);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Sign in error:", error);

    return {
      success: false,
      error: "Invalid email or password.",
    };
  }
}

export async function signOut(): Promise<void> {
  try {
    await auth.api.signOut({
      headers: await getAuthHeaders(),
    });
  } catch (error) {
    console.error("Sign out error:", error);
  }

  redirect("/sign-in");
}

export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await getAuthHeaders(),
    });
    return session;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}

export async function guestSession(): Promise<{
  sessionToken: string | null;
  isValid: boolean;
}> {
  const sessionToken = await getGuestSessionToken();

  if (!sessionToken) {
    return { sessionToken: null, isValid: false };
  }

  try {
    const guestRecord = await db.query.guest.findFirst({
      where: eq(guest.sessionToken, sessionToken),
    });

    if (!guestRecord) {
      return { sessionToken: null, isValid: false };
    }

    const isExpired = new Date(guestRecord.expiresAt) < new Date();
    if (isExpired) {
      await deleteGuestSession(sessionToken);
      return { sessionToken: null, isValid: false };
    }

    return { sessionToken, isValid: true };
  } catch (error) {
    console.error("Guest session error:", error);
    return { sessionToken: null, isValid: false };
  }
}

export async function createGuestSession(): Promise<string> {
  const existingSession = await guestSession();
  if (existingSession.isValid && existingSession.sessionToken) {
    return existingSession.sessionToken;
  }

  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + GUEST_SESSION_EXPIRY_DAYS);

  try {
    await db.insert(guest).values({
      sessionToken,
      expiresAt,
    });

    const cookieStore = await cookies();
    cookieStore.set(GUEST_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * GUEST_SESSION_EXPIRY_DAYS,
    });

    return sessionToken;
  } catch (error) {
    console.error("Create guest session error:", error);
    throw new Error("Failed to create guest session");
  }
}

export async function mergeGuestCartWithUserCart(
  guestSessionToken: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userId: string,
): Promise<void> {
  try {
    await deleteGuestSession(guestSessionToken);
  } catch (error) {
    console.error("Merge cart error:", error);
  }
}

export async function getOrCreateGuestSession(): Promise<string> {
  const existingSession = await guestSession();
  if (existingSession.isValid && existingSession.sessionToken) {
    return existingSession.sessionToken;
  }
  return createGuestSession();
}

export async function requireAuth(redirectUrl?: string): Promise<void> {
  const session = await getSession();
  if (!session?.user) {
    const url = redirectUrl ? `/sign-in?redirect=${encodeURIComponent(redirectUrl)}` : "/sign-in";
    redirect(url);
  }
}

async function getGuestSessionToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(GUEST_SESSION_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

async function deleteGuestSession(sessionToken: string): Promise<void> {
  try {
    await db.delete(guest).where(eq(guest.sessionToken, sessionToken));

    const cookieStore = await cookies();
    cookieStore.delete(GUEST_SESSION_COOKIE);
  } catch (error) {
    console.error("Delete guest session error:", error);
  }
}

async function getAuthHeaders(): Promise<Headers> {
  const cookieStore = await cookies();
  const headers = new Headers();
  headers.set("cookie", cookieStore.toString());
  return headers;
}
