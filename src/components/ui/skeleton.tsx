import { cn } from "@/lib/utils";

/** Animated placeholder block for loading states. */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("bg-surface-2 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}
