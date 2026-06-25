import { DashboardStats } from "@/components/admin/dashboard-stats";

export default function AdminDashboardPage() {
  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-foreground text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted mt-1">
        Key metrics across sales, customers and commissions.
      </p>
      <div className="mt-6">
        <DashboardStats />
      </div>
    </div>
  );
}
