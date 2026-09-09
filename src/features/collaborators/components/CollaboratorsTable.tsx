import { useMemo, useState } from "react";
import { Search, Eye } from "lucide-react";

import type {
  CollaboratorApplication,
  CollaboratorApplicationStatus,
} from "../types/collaborator.types";

interface CollaboratorsTableProps {
  collaborators: CollaboratorApplication[];
  onView: (collaborator: CollaboratorApplication) => void;
}

const statusLabels: Record<
  CollaboratorApplicationStatus,
  string
> = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
};

function formatFollowers(value: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value.toString();
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CollaboratorsTable({
  collaborators,
  onView,
}: CollaboratorsTableProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    CollaboratorApplicationStatus | "all"
  >("all");

  const filteredCollaborators = useMemo(() => {
    const query = search.trim().toLowerCase();

    return collaborators.filter((item) => {
      const matchesSearch =
        !query ||
        item.full_name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.instagram_username
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        status === "all" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [collaborators, search, status]);

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Applications
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Review creators who want to collaborate with T&M Jewels.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Search creators..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="h-10 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition focus:border-neutral-400 sm:w-64"
            />
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | CollaboratorApplicationStatus
                  | "all"
              )
            }
            className="h-10 rounded-xl border bg-white px-3 text-sm outline-none focus:border-neutral-400"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">
              Under Review
            </option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b bg-neutral-50 text-left">
              <th className="px-5 py-3 font-medium">
                Creator
              </th>

              <th className="px-5 py-3 font-medium">
                Instagram
              </th>

              <th className="px-5 py-3 font-medium">
                Followers
              </th>

              <th className="px-5 py-3 font-medium">
                Collaboration
              </th>

              <th className="px-5 py-3 font-medium">
                Status
              </th>

              <th className="px-5 py-3 font-medium">
                Applied
              </th>

              <th className="px-5 py-3 text-right font-medium">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredCollaborators.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-muted-foreground"
                >
                  No collaborator applications found.
                </td>
              </tr>
            ) : (
              filteredCollaborators.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-0 hover:bg-neutral-50/70"
                >
                  {/* Creator */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium">
                        {item.full_name}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.email}
                      </p>
                    </div>
                  </td>

                  {/* Instagram */}
                  <td className="px-5 py-4">
                    <span className="font-medium">
                      @{item.instagram_username}
                    </span>
                  </td>

                  {/* Followers */}
                  <td className="px-5 py-4">
                    {formatFollowers(
                      item.follower_count
                    )}
                  </td>

                  {/* Collaboration */}
                  <td className="px-5 py-4 capitalize">
                    {item.collaboration_type}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.status === "pending"
                          ? "bg-amber-50 text-amber-700"
                          : item.status === "under_review"
                          ? "bg-blue-50 text-blue-700"
                          : item.status === "approved"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {statusLabels[item.status]}
                    </span>
                  </td>

                  {/* Applied */}
                  <td className="px-5 py-4 text-muted-foreground">
                    {formatDate(item.created_at)}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onView(item)}
                      className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition hover:bg-neutral-100"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t px-5 py-3 text-xs text-muted-foreground">
        Showing {filteredCollaborators.length} of{" "}
        {collaborators.length} applications
      </div>
    </div>
  );
}