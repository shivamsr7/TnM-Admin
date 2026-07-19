interface ProductStatusBadgeProps {
  status: "active" | "draft" | "archived";
}

const statusStyles = {
  active:
    "bg-green-100 text-green-700 border border-green-200",
  draft:
    "bg-yellow-100 text-yellow-700 border border-yellow-200",
  archived:
    "bg-red-100 text-red-700 border border-red-200",
};

const statusLabels = {
  active: "Active",
  draft: "Draft",
  archived: "Archived",
};

export default function ProductStatusBadge({
  status,
}: ProductStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}