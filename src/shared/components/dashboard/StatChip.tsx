import { cn } from "@/lib/utils";

interface StatChipProps {
  label: string;
  color?:
    | "green"
    | "blue"
    | "purple"
    | "yellow"
    | "red"
    | "gray";
}

const colors = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  gray: "bg-gray-100 text-gray-700",
};

export default function StatChip({
  label,
  color = "gray",
}: StatChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        colors[color]
      )}
    >
      {label}
    </span>
  );
}