import Link from "next/link";

import { siteConfig } from "@/config/site";

import { BrandMark } from "./brand-mark";
import { Container } from "./container";

const exploreLinks = [
  { label: "Gallery", href: "/gallery" },
  { label: "Newest arrivals", href: "/gallery?sort=newest" },
  { label: "Best value", href: "/gallery?sort=priceAsc" },
];

export function Footer() {
  return (
    <footer className="border-border bg-surface mt-auto border-t">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <BrandMark className="items-start" showTagline={false} />
          <p className="text-muted max-w-xs text-sm">{siteConfig.description}</p>
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
          <FooterLink href="/login">Sign in</FooterLink>
          <FooterLink href="/register">Create account</FooterLink>
        </FooterColumn>

        <FooterColumn title="Follow">
          {siteConfig.socials.map((social) => (
            <FooterLink key={social.href} href={social.href} external>
              {social.label}
            </FooterLink>
          ))}
        </FooterColumn>
      </Container>

      <div className="border-border border-t">
        <Container className="text-muted flex flex-col items-center justify-between gap-2 py-6 text-sm sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.tagline}</p>
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
      <h3 className="text-foreground mb-3 text-sm font-semibold tracking-wide uppercase">
        {title}
      </h3>
      <ul className="space-y-2">{children}</ul>
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
        className="text-muted hover:text-brand-700 dark:hover:text-gold-300 text-sm transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
