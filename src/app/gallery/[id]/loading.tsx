import { Container } from "@/components/layout";
import { Skeleton } from "@/components/ui";

/** Skeleton shown while a painting's detail page streams in. */
export default function PaintingLoading() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Skeleton className="h-5 w-64" />
        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-4/5 w-full rounded-2xl" />
          <div>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="mt-4 h-10 w-3/4" />
            <Skeleton className="mt-4 h-8 w-32" />
            <Skeleton className="mt-8 h-24 w-full" />
            <Skeleton className="mt-8 h-12 w-48" />
          </div>
        </div>
      </Container>
    </div>
  );
}
