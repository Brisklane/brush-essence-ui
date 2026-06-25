import type { BadgeProps } from "@/components/ui";
import type { CustomRequestStatus } from "@/types";

/**
 * Presentation metadata for custom-request statuses, mirroring the API's
 * `CustomRequestStatusWorkflow`. Centralised so labels, colours, and the
 * progress tracker stay consistent everywhere.
 */
export const CUSTOM_REQUEST_STATUS_LABELS: Record<CustomRequestStatus, string> =
  {
    Submitted: "Submitted",
    Reviewed: "Reviewed",
    InProgress: "In progress",
    Completed: "Completed",
    Declined: "Declined",
  };

export const CUSTOM_REQUEST_STATUS_DESCRIPTIONS: Record<
  CustomRequestStatus,
  string
> = {
  Submitted: "We've received your request and will review it shortly.",
  Reviewed: "The artist has reviewed your request.",
  InProgress: "Your custom piece is being painted.",
  Completed: "Your custom piece is finished.",
  Declined: "Unfortunately this request couldn't be taken on.",
};

/** Happy-path milestones, in order, used to draw the progress tracker. */
export const CUSTOM_REQUEST_PROGRESS_STEPS: CustomRequestStatus[] = [
  "Submitted",
  "Reviewed",
  "InProgress",
  "Completed",
];

/** Allowed next statuses, mirroring the API's CustomRequestStatusWorkflow. */
export const CUSTOM_REQUEST_STATUS_TRANSITIONS: Record<
  CustomRequestStatus,
  CustomRequestStatus[]
> = {
  Submitted: ["Reviewed", "Declined"],
  Reviewed: ["InProgress", "Declined"],
  InProgress: ["Completed", "Declined"],
  Completed: [],
  Declined: [],
};

export function customRequestStatusBadgeVariant(
  status: CustomRequestStatus,
): NonNullable<BadgeProps["variant"]> {
  switch (status) {
    case "Completed":
      return "success";
    case "Declined":
      return "danger";
    case "InProgress":
      return "brand";
    case "Reviewed":
      return "gold";
    default:
      return "neutral";
  }
}
