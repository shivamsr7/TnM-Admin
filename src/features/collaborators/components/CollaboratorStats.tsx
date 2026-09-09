import {
  CheckCircle2,
  Clock3,
  FileText,
  Search,
} from "lucide-react";

import type { CollaboratorApplication } from "../types/collaborator.types";

interface CollaboratorStatsProps {
  collaborators: CollaboratorApplication[];
}

export default function CollaboratorStats({
  collaborators,
}: CollaboratorStatsProps) {
  const total = collaborators.length;

  const pending = collaborators.filter(
    (item) => item.status === "pending"
  ).length;

  const underReview = collaborators.filter(
    (item) => item.status === "under_review"
  ).length;

  const approved = collaborators.filter(
    (item) => item.status === "approved"
  ).length;

  const stats = [
    {
      label: "Total Applications",
      value: total,
      icon: FileText,
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
    },
    {
      label: "Under Review",
      value: underReview,
      icon: Search,
    },
    {
      label: "Approved",
      value: approved,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {stat.value}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100">
                <Icon
                  size={20}
                  className="text-neutral-700"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}