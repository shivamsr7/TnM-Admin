import { Badge } from "@/components/ui/badge";

interface NotifyStatusBadgeProps {
  status:
    | "pending"
    | "notified"
    | "purchased"
    | "cancelled";
}

export default function NotifyStatusBadge({
  status,
}: NotifyStatusBadgeProps) {
  const variants = {
    pending:
      "bg-yellow-100 text-yellow-800 border-yellow-200",

    notified:
      "bg-blue-100 text-blue-800 border-blue-200",

    purchased:
      "bg-green-100 text-green-800 border-green-200",

    cancelled:
      "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Badge
      variant="outline"
      className={variants[status]}
    >
      {status.charAt(0).toUpperCase() +
        status.slice(1)}
    </Badge>
  );
}