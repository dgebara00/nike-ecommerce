import Link from "next/link";
import { Suspense } from "react";

import SignInForm from "../../../components/SignInForm";

export default function SignInPage() {
	return (
		<div className="flex flex-col gap-8">
			<div className="text-center">
				<p className="text-body font-body text-dark-700">
					Don&apos;t have an account?{" "}
					<Link href="/sign-up" className="font-body-medium text-dark-900 underline hover:text-dark-700">
						Sign Up
					</Link>
				</p>
			</div>

			<div className="text-center">
				<h2 className="text-heading-2 font-heading-2 text-dark-900">Welcome Back!</h2>
				<p className="mt-2 text-body font-body text-dark-700">Sign in to continue your fitness journey</p>
			</div>

			<Suspense>
				<SignInForm />
			</Suspense>

			<p className="text-center text-caption font-caption text-dark-700">
				By signing in, you agree to our{" "}
				<Link href="/terms" className="text-dark-900 underline hover:text-dark-700">
					Terms of Service
				</Link>{" "}
				and{" "}
				<Link href="/privacy" className="text-dark-900 underline hover:text-dark-700">
					Privacy Policy
				</Link>
			</p>
		</div>
	);
}
