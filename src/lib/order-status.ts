import type { BadgeProps } from "@/components/ui";
import type { OrderStatus } from "@/types";

/**
 * Presentation metadata for order statuses, mirroring the API's
 * `OrderStatusWorkflow`. Centralised so labels, colours, and the progress
 * timeline stay consistent everywhere they're shown.
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  Placed: "Placed",
  Processing: "Processing",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
};

export const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  Placed: "We've received your order.",
  Processing: "Your order is being prepared.",
  Shipped: "Your order is on its way.",
  Delivered: "Your order has been delivered.",
  Cancelled: "This order was cancelled.",
};

/** The happy-path milestones, in order, used to draw the progress tracker. */
export const ORDER_PROGRESS_STEPS: OrderStatus[] = [
  "Placed",
  "Processing",
  "Shipped",
  "Delivered",
];

/** Allowed next statuses, mirroring the API's OrderStatusWorkflow. */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  Placed: ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
};

export function orderStatusBadgeVariant(
  status: OrderStatus,
): NonNullable<BadgeProps["variant"]> {
  switch (status) {
    case "Delivered":
      return "success";
    case "Cancelled":
      return "danger";
    case "Shipped":
      return "brand";
    case "Processing":
      return "gold";
    default:
      return "neutral";
  }
}
