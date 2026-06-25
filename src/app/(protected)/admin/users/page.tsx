import { ManageUsers } from "@/components/admin/manage-users";

export default function AdminUsersPage() {
  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-foreground text-2xl font-semibold">Users</h1>
      <p className="text-muted mt-1">
        View, search and manage customer and admin accounts.
      </p>
      <div className="mt-6">
        <ManageUsers />
      </div>
    </div>
  );
}
