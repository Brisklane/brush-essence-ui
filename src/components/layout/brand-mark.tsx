import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The Brush Essence wordmark: an elegant serif name underlined with a gold
 * brushstroke, echoing the gallery look from the design comps.
 */
export function BrandMark({
  className,
  href = "/",
  showTagline = true,
}: {
  className?: string;
  href?: string;
  showTagline?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex flex-col items-center", className)}
    >
      <span className="font-display text-foreground text-xl leading-none font-semibold tracking-[0.18em] uppercase sm:text-2xl">
        {siteConfig.name}
      </span>
      <span className="from-gold-500/0 via-gold-500 to-gold-500/0 mt-1 h-px w-full bg-linear-to-r" />
      {showTagline ? (
        <span className="text-muted mt-1 text-[0.6rem] tracking-[0.3em] uppercase">
          Original Oil Paintings
        </span>
      ) : null}
    </Link>
  );
}
