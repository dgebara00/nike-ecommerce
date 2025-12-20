import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import * as schema from "@/db/schema";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const authSecret = process.env.BETTER_AUTH_SECRET ?? "dev-secret";

export const auth = betterAuth({
	appName: "Nike Commerce Cloud",
	baseURL: appUrl,
	secret: authSecret,

	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5,
		},
	},
	advanced: {
		cookiePrefix: "nike",
		database: {
			generateId: "uuid",
		},
		cookies: {
			session_token: {
				name: "auth_session",
				options: {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
					path: "/",
					maxAge: 60 * 60 * 24 * 7,
				},
			},
		},
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
	},
	plugins: [nextCookies()],
});
