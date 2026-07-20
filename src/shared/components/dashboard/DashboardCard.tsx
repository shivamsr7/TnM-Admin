import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({
  children,
  className,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white shadow-sm transition-shadow duration-300 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}