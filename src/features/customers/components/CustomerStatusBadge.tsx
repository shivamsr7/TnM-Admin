import { Badge } from "@/components/ui/badge";

interface CustomerStatusBadgeProps {
  status: "active" | "blocked";
}

export default function CustomerStatusBadge({
  status,
}: CustomerStatusBadgeProps) {
  switch (status) {
    case "active":
      return (
        <Badge
          className="
            bg-green-100
            text-green-700
            hover:bg-green-100
            border-green-200
          "
        >
          Active
        </Badge>
      );

    case "blocked":
      return (
        <Badge
          className="
            bg-red-100
            text-red-700
            hover:bg-red-100
            border-red-200
          "
        >
          Blocked
        </Badge>
      );

    default:
      return (
        <Badge variant="secondary">
          Unknown
        </Badge>
      );
  }
}