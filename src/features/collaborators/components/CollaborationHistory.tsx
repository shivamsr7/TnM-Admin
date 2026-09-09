import { useState } from "react";
import {
  CalendarDays,
  Edit3,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Package,
  Plus,
  XCircle,
} from "lucide-react";

import type { Collaboration } from "../types/collaborator.types";
import EditCollaborationModal from "./EditCollaborationModal";
import DeliverablesManager from "./DeliverablesManager";
import { useDeleteCollaboration } from "../hooks/useCollaborations";

interface CollaborationHistoryProps {
  collaborations: Collaboration[];
  isLoading: boolean;
  onCreate: () => void;
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
    case "planned":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "active":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "completed":
      return "border-green-200 bg-green-50 text-green-700";
    case "cancelled":
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

function getStatusIcon(status: string) {
  switch (status) {
    case "planned":
    case "active":
      return <Clock3 size={14} />;
    case "completed":
      return <CheckCircle2 size={14} />;
    case "cancelled":
      return <XCircle size={14} />;
    default:
      return null;
  }
}

function getDeliverableProgress(expected: number, completed: number) {
  if (expected <= 0) return 0;

  return Math.min(
    100,
    Math.round((completed / expected) * 100)
  );
}

export default function CollaborationHistory({
  collaborations,
  isLoading,
  onCreate,
}: CollaborationHistoryProps) {
  const [editingCollaboration, setEditingCollaboration] =
    useState<Collaboration | null>(null);
  const [deletingCollaboration, setDeletingCollaboration] =
    useState<Collaboration | null>(null);
  const deleteCollaboration = useDeleteCollaboration();

  return (
    <>
      <section className="rounded-xl border border-neutral-200 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold">
              Collaboration History
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Track campaigns, deliverables and performance for this creator.
            </p>
          </div>

          <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            <Plus size={16} />
            New Collaboration
          </button>
        </div>

        {isLoading && (
          <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-8 text-center">
            <p className="text-sm text-neutral-500">
              Loading collaboration history...
            </p>
          </div>
        )}

        {!isLoading && collaborations.length === 0 && (
          <div className="mt-5 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-10 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
              <Package size={19} className="text-neutral-500" />
            </div>

            <p className="mt-4 text-sm font-medium">
              No collaborations yet
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Create the first collaboration for this creator.
            </p>

            <button
              type="button"
              onClick={onCreate}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-neutral-100"
            >
              <Plus size={15} />
              Create Collaboration
            </button>
          </div>
        )}

        {!isLoading && collaborations.length > 0 && (
          <div className="mt-5 space-y-4">
            {collaborations.map((collaboration) => {
              const progress = getDeliverableProgress(
                collaboration.deliverables_expected,
                collaboration.deliverables_completed
              );

              return (
                <div
                  key={collaboration.id}
                  className="rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold">
                          {collaboration.campaign_name}
                        </h4>

                        <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium capitalize text-neutral-600">
                          {collaboration.collaboration_type}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                            collaboration.status
                          )}`}
                        >
                          {getStatusIcon(collaboration.status)}
                          {getStatusLabel(collaboration.status)}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          {formatDate(collaboration.start_date)}
                          {collaboration.end_date &&
                            ` — ${formatDate(collaboration.end_date)}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingCollaboration(collaboration)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-900"
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeletingCollaboration(collaboration)
                        }
                        className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50"
                        aria-label="Delete collaboration"
                        title="Delete collaboration"
                      >
                        <XCircle size={17} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-neutral-600">
                        Deliverables
                      </p>
                      <p className="text-xs font-medium text-neutral-700">
                        {collaboration.deliverables_completed} /{" "}
                        {collaboration.deliverables_expected}
                      </p>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-neutral-900 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <DeliverablesManager
                    collaborationId={collaboration.id}
                    deliverablesExpected={
                      collaboration.deliverables_expected
                    }
                  />

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg bg-neutral-50 p-3">
                      <p className="text-[11px] text-neutral-500">
                        Reel Views
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {collaboration.reel_views.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="rounded-lg bg-neutral-50 p-3">
                      <p className="text-[11px] text-neutral-500">
                        Orders
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {collaboration.orders_generated}
                      </p>
                    </div>

                    <div className="rounded-lg bg-neutral-50 p-3">
                      <p className="text-[11px] text-neutral-500">
                        Revenue
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {formatCurrency(
                          collaboration.revenue_generated
                        )}
                      </p>
                    </div>

                    <div className="rounded-lg bg-neutral-50 p-3">
                      <p className="text-[11px] text-neutral-500">
                        Commission
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-sm font-semibold">
                        <IndianRupee size={13} />
                        {formatCurrency(
                          collaboration.commission_amount
                        ).replace("₹", "")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <EditCollaborationModal
        collaboration={editingCollaboration}
        open={Boolean(editingCollaboration)}
        onClose={() => setEditingCollaboration(null)}
      />

      {deletingCollaboration && (
        <div className="fixed inset-0 z-[10003] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">
                  Delete collaboration?
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  This will permanently remove this collaboration from the creator&apos;s history.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDeletingCollaboration(null)}
                disabled={deleteCollaboration.isPending}
                className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close"
              >
                <XCircle size={19} />
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-sm font-semibold text-neutral-900">
                {deletingCollaboration.campaign_name}
              </p>
              <p className="mt-1 text-xs capitalize text-neutral-500">
                {deletingCollaboration.collaboration_type} ·{" "}
                {deletingCollaboration.status}
              </p>
            </div>

            {deleteCollaboration.isError && (
              <p className="mt-4 text-sm text-red-600">
                Failed to delete collaboration. Please try again.
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingCollaboration(null)}
                disabled={deleteCollaboration.isPending}
                className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteCollaboration.isPending}
                onClick={() => {
                  deleteCollaboration.mutate(
                    deletingCollaboration.id,
                    {
                      onSuccess: () =>
                        setDeletingCollaboration(null),
                    }
                  );
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteCollaboration.isPending
                  ? "Deleting..."
                  : "Delete Collaboration"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
