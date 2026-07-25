import { Badge } from "@/components/ui/badge";
import type { ReviewStatus } from "../types/review.types";

interface ReviewStatusBadgeProps {
  status: ReviewStatus;
}

export default function ReviewStatusBadge({
  status,
}: ReviewStatusBadgeProps) {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Approved
        </Badge>
      );

    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          Pending
        </Badge>
      );

    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          Rejected
        </Badge>
      );

    default:
      return (
        <Badge variant="secondary">
          {status}
        </Badge>
      );
  }
}