import { ManageRequests } from "@/components/admin/manage-requests";

export default function AdminRequestsPage() {
  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-foreground text-2xl font-semibold">
        Custom requests
      </h1>
      <p className="text-muted mt-1">
        Review commission requests and move them through their lifecycle.
      </p>
      <div className="mt-6">
        <ManageRequests />
      </div>
    </div>
  );
}
