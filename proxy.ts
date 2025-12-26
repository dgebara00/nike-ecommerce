import { type NextRequest, NextResponse } from "next/server";

import { AUTH_SESSION_COOKIE } from "@/lib/auth";

const AUTH_PAGES = ["/sign-in", "/sign-up"];

export function proxy(request: NextRequest) {
	const isAuthorized = Boolean(request.cookies.get(AUTH_SESSION_COOKIE));
	const { pathname, origin } = request.nextUrl;

	if (AUTH_PAGES.includes(pathname) && isAuthorized) {
		return NextResponse.redirect(new URL("/", origin));
	}
}

export const config = {
	matcher: ["/sign-in", "/sign-up"],
};
