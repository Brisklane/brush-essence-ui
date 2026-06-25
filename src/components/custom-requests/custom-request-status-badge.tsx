import { Badge } from "@/components/ui";
import {
  CUSTOM_REQUEST_STATUS_LABELS,
  customRequestStatusBadgeVariant,
} from "@/lib/custom-request-status";
import type { CustomRequestStatus } from "@/types";

export function CustomRequestStatusBadge({
  status,
  size = "md",
}: {
  status: CustomRequestStatus;
  size?: "sm" | "md";
}) {
  return (
    <Badge variant={customRequestStatusBadgeVariant(status)} size={size}>
      {CUSTOM_REQUEST_STATUS_LABELS[status]}
    </Badge>
  );
}
