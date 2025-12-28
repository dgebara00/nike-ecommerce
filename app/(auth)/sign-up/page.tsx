import Link from "next/link";
import { Suspense } from "react";

import SignUpForm from "../../../components/SignUpForm";

export default function SignUpPage() {
	return (
		<div className="flex flex-col gap-8">
			<div className="text-center">
				<p className="text-body font-body text-dark-700">
					Already have an account?{" "}
					<Link href="/sign-in" className="font-body-medium text-dark-900 underline hover:text-dark-700">
						Sign In
					</Link>
				</p>
			</div>

			<div className="text-center">
				<h2 className="text-heading-2 font-heading-2 text-dark-900">Join Nike Today!</h2>
				<p className="mt-2 text-body font-body text-dark-700">Create your account to start your fitness journey</p>
			</div>
			<Suspense>
				<SignUpForm />
			</Suspense>
			<p className="text-center text-caption font-caption text-dark-700">
				By signing up, you agree to our{" "}
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
