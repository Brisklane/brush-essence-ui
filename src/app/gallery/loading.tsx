import { Container } from "@/components/layout";
import { Skeleton } from "@/components/ui";

/** Skeleton shown while the gallery page streams in. */
export default function GalleryLoading() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-3 h-5 w-72" />

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="border-border bg-surface overflow-hidden rounded-xl border"
            >
              <Skeleton className="aspect-4/5 rounded-none" />
              <div className="p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/2" />
                <Skeleton className="mt-4 h-6 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
