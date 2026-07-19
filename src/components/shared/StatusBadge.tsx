interface StatusBadgeProps {
  status:
    | "active"
    | "inactive"
    | "draft"
    | "pending"
    | "published"
    | "archived";
}

const styles = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-red-100 text-red-700",
  draft: "bg-yellow-100 text-yellow-700",
  pending: "bg-blue-100 text-blue-700",
  published: "bg-emerald-100 text-emerald-700",
  archived: "bg-gray-100 text-gray-700",
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status]}`}
    >
      <span
        className={`mr-2 h-2 w-2 rounded-full ${
          status === "active" || status === "published"
            ? "bg-green-600"
            : status === "inactive"
            ? "bg-red-600"
            : status === "draft"
            ? "bg-yellow-600"
            : status === "pending"
            ? "bg-blue-600"
            : "bg-gray-500"
        }`}
      />

      {status}
    </span>
  );
}