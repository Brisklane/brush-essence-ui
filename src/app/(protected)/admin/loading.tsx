import { Skeleton } from "@/components/ui";

/** Skeleton shown while an admin page loads. */
export default function AdminLoading() {
  return (
    <div className="p-6 sm:p-8">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-5 w-64" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="mt-6 h-64" />
    </div>
  );
}
