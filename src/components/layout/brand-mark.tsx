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
      <span className="font-display text-foreground text-lg leading-none font-semibold tracking-[0.14em] whitespace-nowrap uppercase sm:text-2xl sm:tracking-[0.2em]">
        {siteConfig.name}
      </span>
      <span className="from-gold-500/0 via-gold-500 to-gold-500/0 mt-1 h-px w-full bg-linear-to-r transition-opacity group-hover:opacity-80 sm:mt-1.5" />
      {showTagline ? (
        <span className="text-muted-2 mt-1 text-[0.55rem] tracking-[0.28em] whitespace-nowrap uppercase sm:mt-1.5 sm:text-[0.6rem] sm:tracking-[0.32em]">
          Original Oil Paintings
        </span>
      ) : null}
    </Link>
  );
}
