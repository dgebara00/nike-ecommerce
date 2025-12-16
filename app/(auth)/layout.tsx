import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative flex flex-col justify-between bg-dark-900 p-6 lg:w-1/2 lg:p-12">
        <Link href="/" aria-label="Nike Home">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange">
            <Image
              src="/logo.svg"
              alt="Nike"
              width={28}
              height={28}
              className="brightness-0 invert"
              priority
            />
          </div>
        </Link>

        <div className="my-12 lg:my-0">
          <h1 className="text-heading-2 font-heading-2 text-light-100">Just Do It</h1>
          <p className="mt-4 max-w-md text-lead font-lead text-dark-500">
            Join millions of athletes and fitness enthusiasts who trust Nike for their performance
            needs.
          </p>
          <div className="mt-6 flex gap-2">
            <span className="h-2 w-2 rounded-full bg-light-100" />
            <span className="h-2 w-2 rounded-full bg-light-100" />
            <span className="h-2 w-2 rounded-full bg-light-100" />
          </div>
        </div>

        <p className="text-footnote font-footnote text-dark-700">
          &copy; {currentYear} Nike. All rights reserved.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-light-100 p-6 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
