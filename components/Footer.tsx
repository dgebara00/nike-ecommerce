import Image from "next/image";
import Link from "next/link";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Link
      href={href}
      className="text-body font-body text-dark-700 transition-colors hover:text-light-100"
    >
      {children}
    </Link>
  );
}

interface FooterColumnProps {
  title: string;
  links: { href: string; label: string }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-body font-body-medium text-light-100">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <FooterLink href={link.href}>{link.label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SocialLinkProps {
  href: string;
  icon: string;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <Link
      href={href}
      className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-80"
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image src={icon} alt={label} width={24} height={24} />
    </Link>
  );
}

export function Footer() {
  const footerColumns = [
    {
      title: "Featured",
      links: [
        { href: "/featured/air-force-1", label: "Air Force 1" },
        { href: "/featured/huarache", label: "Huarache" },
        { href: "/featured/air-max-90", label: "Air Max 90" },
        { href: "/featured/air-max-95", label: "Air Max 95" },
      ],
    },
    {
      title: "Shoes",
      links: [
        { href: "/shoes", label: "All Shoes" },
        { href: "/shoes/custom", label: "Custom Shoes" },
        { href: "/shoes/jordan", label: "Jordan Shoes" },
        { href: "/shoes/running", label: "Running Shoes" },
      ],
    },
    {
      title: "Clothing",
      links: [
        { href: "/clothing", label: "All Clothing" },
        { href: "/clothing/modest-wear", label: "Modest Wear" },
        { href: "/clothing/hoodies", label: "Hoodies & Pullovers" },
        { href: "/clothing/shirts", label: "Shirts & Tops" },
      ],
    },
    {
      title: "Kids'",
      links: [
        { href: "/kids/infant-toddler", label: "Infant & Toddler Shoes" },
        { href: "/kids/shoes", label: "Kids' Shoes" },
        { href: "/kids/jordan", label: "Kids' Jordan Shoes" },
        { href: "/kids/basketball", label: "Kids' Basketball Shoes" },
      ],
    },
  ];

  const socialLinks = [
    { href: "https://x.com/nike", icon: "/x.svg", label: "X (Twitter)" },
    {
      href: "https://facebook.com/nike",
      icon: "/facebook.svg",
      label: "Facebook",
    },
    {
      href: "https://instagram.com/nike",
      icon: "/instagram.svg",
      label: "Instagram",
    },
  ];

  const legalLinks = [
    { href: "/guides", label: "Guides" },
    { href: "/terms-of-sale", label: "Terms of Sale" },
    { href: "/terms-of-use", label: "Terms of Use" },
    { href: "/privacy-policy", label: "Nike Privacy Policy" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" aria-label="Nike Home">
              <Image
                src="/logo.svg"
                alt="Nike"
                width={60}
                height={22}
                className="h-[22px] w-auto brightness-0 invert"
              />
            </Link>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-16">
            {footerColumns.map((column) => (
              <FooterColumn key={column.title} title={column.title} links={column.links} />
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-4 lg:flex-shrink-0">
            {socialLinks.map((social) => (
              <SocialLink
                key={social.label}
                href={social.href}
                icon={social.icon}
                label={social.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-700/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left Side - Location and Copyright */}
            <div className="flex flex-wrap items-center gap-4 text-footnote font-footnote text-dark-700">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Croatia
              </span>
              <span>&copy; {currentYear} Nike, Inc. All Rights Reserved</span>
            </div>

            {/* Right Side - Legal Links */}
            <nav className="flex flex-wrap items-center gap-6" aria-label="Legal">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-footnote font-footnote text-dark-700 transition-colors hover:text-light-100"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
