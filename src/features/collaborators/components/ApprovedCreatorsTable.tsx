import { useMemo, useState } from "react";
import {
  Eye,
  Search,
  Users,
} from "lucide-react";

import type { CollaboratorProfile } from "../types/collaborator.types";

interface ApprovedCreatorsTableProps {
  creators: CollaboratorProfile[];
  onView: (creator: CollaboratorProfile) => void;
}

function formatNumber(value: number | null) {
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusClasses(status: string) {
  switch (status) {
    case "active":
      return "border-green-200 bg-green-50 text-green-700";

    case "inactive":
      return "border-neutral-200 bg-neutral-100 text-neutral-600";

    case "blacklisted":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-neutral-200 bg-neutral-100 text-neutral-700";
  }
}

function getStatusLabel(status: string) {
  return status
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function ApprovedCreatorsTable({
  creators,
  onView,
}: ApprovedCreatorsTableProps) {
  const [search, setSearch] = useState("");

  const filteredCreators = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return creators;
    }

    return creators.filter((creator) => {
      return (
        creator.full_name
          .toLowerCase()
          .includes(query) ||
        creator.email
          .toLowerCase()
          .includes(query) ||
        creator.instagram_username
          .toLowerCase()
          .includes(query)
      );
    });
  }, [creators, search]);

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
            <Users
              size={19}
              className="text-neutral-700"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Approved Creators
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage creators who are officially approved to collaborate with T&M Jewels.
            </p>
          </div>
        </div>

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
            className="
              h-10
              w-full
              rounded-xl
              border
              bg-white
              pl-9
              pr-3
              text-sm
              outline-none
              transition
              focus:border-neutral-400
              sm:w-64
            "
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-sm">
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
                Collaborations
              </th>

              <th className="px-5 py-3 font-medium">
                Orders
              </th>

              <th className="px-5 py-3 font-medium">
                Revenue
              </th>

              <th className="px-5 py-3 font-medium">
                Status
              </th>

              <th className="px-5 py-3 font-medium">
                Approved
              </th>

              <th className="px-5 py-3 text-right font-medium">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredCreators.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-14 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                      <Users
                        size={20}
                        className="text-neutral-500"
                      />
                    </div>

                    <p className="mt-4 font-medium text-neutral-800">
                      No approved creators found
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {search
                        ? "Try changing your search."
                        : "Approved creators will appear here."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCreators.map((creator) => (
                <tr
                  key={creator.id}
                  className="
                    border-b
                    last:border-0
                    transition
                    hover:bg-neutral-50/70
                  "
                >
                  {/* Creator */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-neutral-900">
                        {creator.full_name}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {creator.email}
                      </p>
                    </div>
                  </td>

                  {/* Instagram */}
                  <td className="px-5 py-4">
                    <span className="font-medium">
                      @{creator.instagram_username}
                    </span>
                  </td>

                  {/* Followers */}
                  <td className="px-5 py-4">
                    {formatNumber(
                      creator.follower_count
                    )}
                  </td>

                  {/* Collaborations */}
                  <td className="px-5 py-4">
                    {creator.total_collaborations}
                  </td>

                  {/* Orders */}
                  <td className="px-5 py-4">
                    {creator.total_orders}
                  </td>

                  {/* Revenue */}
                  <td className="px-5 py-4 font-medium">
                    {formatCurrency(
                      creator.total_revenue
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-flex
                        rounded-full
                        border
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        ${getStatusClasses(
                          creator.status
                        )}
                      `}
                    >
                      {getStatusLabel(
                        creator.status
                      )}
                    </span>
                  </td>

                  {/* Approved */}
                  <td className="px-5 py-4 text-muted-foreground">
                    {formatDate(
                      creator.approved_at
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onView(creator)}
                      className="
                        inline-flex
                        h-9
                        items-center
                        gap-2
                        rounded-lg
                        border
                        px-3
                        text-sm
                        font-medium
                        transition
                        hover:bg-neutral-100
                      "
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
        Showing {filteredCreators.length} of{" "}
        {creators.length} approved creators
      </div>
    </div>
  );
}