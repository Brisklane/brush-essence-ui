import Link from "next/link";

import { siteConfig } from "@/config/site";

import { Container } from "./container";

const exploreLinks = [
  { label: "Gallery", href: "/gallery" },
  { label: "Newest arrivals", href: "/gallery?sort=newest" },
  { label: "Best value", href: "/gallery?sort=priceAsc" },
];

/**
 * Deep-navy gallery footer with gold accents — a fixed brand surface that reads
 * the same in light and dark mode (so it uses explicit brand colours, not the
 * theme-aware surface tokens).
 */
export function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-100 mt-auto">
      {/* Gold hairline rule across the top. */}
      <div className="from-gold-500/0 via-gold-500/70 to-gold-500/0 h-px bg-linear-to-r" />

      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="inline-flex flex-col">
            <span className="font-display text-2xl leading-none font-semibold tracking-[0.22em] text-white uppercase">
              {siteConfig.name}
            </span>
            <span className="text-gold-300/80 mt-1.5 text-[0.6rem] tracking-[0.32em] uppercase">
              Original Oil Paintings
            </span>
          </Link>
          <p className="text-brand-200/80 max-w-xs text-sm">
            {siteConfig.description}
          </p>
        </div>

        <FooterColumn title="Explore">
          {exploreLinks.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Account">
          <FooterLink href="/account">My account</FooterLink>
          <FooterLink href="/orders">My orders</FooterLink>
          <FooterLink href="/custom-requests">Custom Painting</FooterLink>
          <FooterLink href="/support">Support</FooterLink>
        </FooterColumn>

        <FooterColumn title="Follow">
          {siteConfig.socials.map((social) => (
            <FooterLink key={social.href} href={social.href} external>
              {social.label}
            </FooterLink>
          ))}
        </FooterColumn>
      </Container>

      <div className="border-brand-800/60 border-t">
        <Container className="text-brand-200/70 flex flex-col items-center justify-between gap-2 py-6 text-sm sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/support"
              className="hover:text-gold-300 font-medium transition-colors"
            >
              Support
            </Link>
            <span className="text-brand-200/40" aria-hidden>
              ·
            </span>
            <span>{siteConfig.tagline}</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-gold-300 mb-3 text-xs font-semibold tracking-[0.18em] uppercase">
        {title}
      </h3>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-brand-200/80 hover:text-gold-300 text-sm transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
