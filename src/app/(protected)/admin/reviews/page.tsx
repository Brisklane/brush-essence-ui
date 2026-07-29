import { ManageReviews } from "@/components/admin/manage-reviews";

export default function AdminReviewsPage() {
  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-foreground text-2xl font-semibold">Reviews</h1>
      <p className="text-muted mt-1">
        Approve, edit or remove customer reviews. Only approved reviews appear
        on the storefront.
      </p>
      <div className="mt-6">
        <ManageReviews />
      </div>
    </div>
  );
}
