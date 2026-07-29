import { Badge } from "@/components/ui";
import {
  ORDER_STATUS_LABELS,
  orderStatusBadgeVariant,
} from "@/lib/order-status";
import type { OrderStatus } from "@/types";

export function OrderStatusBadge({
  status,
  size = "md",
}: {
  status: OrderStatus;
  size?: "sm" | "md";
}) {
  return (
    <Badge variant={orderStatusBadgeVariant(status)} size={size}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
