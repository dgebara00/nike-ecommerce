"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface NavLinkProps {
	href: string;
	children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
	return (
		<Link href={href} className="text-dark-900 transition-colors hover:text-dark-700">
			{children}
		</Link>
	);
}

export function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const cartCount = 2;

	const navLinks = [
		{ href: "/?gender=men", label: "Men" },
		{ href: "/?gender=women", label: "Women" },
		{ href: "/?gender=kids", label: "Kids" },
		{ href: "/collections", label: "Collections" },
		{ href: "/contact", label: "Contact" },
	];

	return (
		<header className="w-full bg-light-100 sticky top-0 z-10 shadow-sm">
			<nav
				className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8 font-medium"
				aria-label="Main navigation"
			>
				{/* Logo */}
				<Link href="/" className="shrink-0" aria-label="Nike Home">
					<Image
						src="/logo.svg"
						alt="Nike"
						width={60}
						height={22}
						className="h-5.5 w-auto filter brightness-0"
						priority
					/>
				</Link>

				{/* Desktop Navigation Links */}
				<ul className="hidden items-center gap-8 md:flex" role="menubar">
					{navLinks.map(link => (
						<li key={link.href} role="none">
							<NavLink href={link.href}>{link.label}</NavLink>
						</li>
					))}
				</ul>

				{/* Right Side Actions */}
				<div className="flex items-center gap-6">
					<Link href="/search" className="hidden text-dark-900 transition-colors hover:text-dark-700 sm:block">
						Search
					</Link>
					<Link href="/cart" className="text-dark-900 transition-colors hover:text-dark-700">
						My Cart ({cartCount})
					</Link>

					{/* Mobile Menu Button */}
					<button
						type="button"
						className="flex h-10 w-10 items-center justify-center md:hidden"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-expanded={isMobileMenuOpen}
						aria-controls="mobile-menu"
						aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
					>
						{isMobileMenuOpen ? (
							<svg
								className="h-6 w-6 text-dark-900"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								aria-hidden="true"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						) : (
							<svg
								className="h-6 w-6 text-dark-900"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								aria-hidden="true"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
							</svg>
						)}
					</button>
				</div>
			</nav>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div id="mobile-menu" className="border-t border-light-300 bg-light-100 md:hidden">
					<ul className="space-y-1 px-4 py-4" role="menu">
						{navLinks.map(link => (
							<li key={link.href} role="none">
								<Link
									href={link.href}
									className="block py-2 text-dark-900 transition-colors hover:text-dark-700"
									role="menuitem"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									{link.label}
								</Link>
							</li>
						))}
						<li role="none" className="pt-2">
							<Link
								href="/search"
								className="block py-2 text-dark-900 transition-colors hover:text-dark-700"
								role="menuitem"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Search
							</Link>
						</li>
					</ul>
				</div>
			)}
		</header>
	);
}

export default Navbar;
