import { ManageOrders } from "@/components/admin/manage-orders";

export default function AdminOrdersPage() {
  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-foreground text-2xl font-semibold">Orders</h1>
      <p className="text-muted mt-1">
        Track customer orders and advance their fulfilment status.
      </p>
      <div className="mt-6">
        <ManageOrders />
      </div>
    </div>
  );
}
