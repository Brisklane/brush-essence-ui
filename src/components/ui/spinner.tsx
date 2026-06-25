import { cn } from "@/lib/utils";

/** Minimal accessible loading spinner. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "border-muted/40 border-t-brand-600 inline-block size-5 animate-spin rounded-full border-2",
        className,
      )}
    />
  );
}
