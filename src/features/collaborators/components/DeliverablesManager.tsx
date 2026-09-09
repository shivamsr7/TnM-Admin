import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Edit3,
  ExternalLink,
  Loader2,
  Plus,
  Trash2,
  X,
  XCircle,
} from "lucide-react";

import {
  useCreateDeliverable,
  useDeleteDeliverable,
  useDeliverables,
  useUpdateDeliverable,
} from "../hooks/useDeliverables";

import type {
  CollaborationDeliverable,
  CollaborationDeliverableStatus,
  CollaborationDeliverableType,
} from "../types/collaborator.types";

interface DeliverablesManagerProps {
  collaborationId: string;
  deliverablesExpected: number;
}

interface FormState {
  deliverable_type: CollaborationDeliverableType;
  title: string;
  content_url: string;
  status: CollaborationDeliverableStatus;
  published_at: string;
  notes: string;
}

const initialForm: FormState = {
  deliverable_type: "reel",
  title: "",
  content_url: "",
  status: "pending",
  published_at: "",
  notes: "",
};

const typeLabels: Record<CollaborationDeliverableType, string> = {
  reel: "Instagram Reel",
  story: "Instagram Story",
  post: "Instagram Post",
  ugc: "UGC",
  youtube: "YouTube Video",
  short: "YouTube Short",
  other: "Other",
};

const statusLabels: Record<CollaborationDeliverableStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  published: "Published",
  approved: "Approved",
  rejected: "Rejected",
};

function getStatusClasses(status: CollaborationDeliverableStatus) {
  switch (status) {
    case "published":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "approved":
      return "border-green-200 bg-green-50 text-green-700";
    case "in_progress":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-neutral-200 bg-neutral-100 text-neutral-600";
  }
}

function getStatusIcon(status: CollaborationDeliverableStatus) {
  if (status === "approved") return <CheckCircle2 size={13} />;
  if (status === "rejected") return <XCircle size={13} />;
  return <Clock3 size={13} />;
}

function toDateInputValue(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

export default function DeliverablesManager({
  collaborationId,
  deliverablesExpected,
}: DeliverablesManagerProps) {
  const { data: deliverables = [], isLoading, isError } =
    useDeliverables(collaborationId);

  const createDeliverable = useCreateDeliverable();
  const updateDeliverable = useUpdateDeliverable();
  const deleteDeliverable = useDeleteDeliverable();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeliverable, setEditingDeliverable] =
    useState<CollaborationDeliverable | null>(null);
  const [deletingDeliverable, setDeletingDeliverable] =
    useState<CollaborationDeliverable | null>(null);

  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState<string | null>(null);

  const completedCount = useMemo(
    () =>
      deliverables.filter(
        (item) =>
          item.status === "published" ||
          item.status === "approved"
      ).length,
    [deliverables]
  );

  const progress =
    deliverablesExpected > 0
      ? Math.min(
          100,
          Math.round((completedCount / deliverablesExpected) * 100)
        )
      : 0;

  const openCreate = () => {
    setEditingDeliverable(null);
    setForm(initialForm);
    setError(null);
    setIsModalOpen(true);
  };

  const openEdit = (deliverable: CollaborationDeliverable) => {
    setEditingDeliverable(deliverable);
    setForm({
      deliverable_type: deliverable.deliverable_type,
      title: deliverable.title ?? "",
      content_url: deliverable.content_url ?? "",
      status: deliverable.status,
      published_at: toDateInputValue(deliverable.published_at),
      notes: deliverable.notes ?? "",
    });
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (createDeliverable.isPending || updateDeliverable.isPending) return;
    setIsModalOpen(false);
    setEditingDeliverable(null);
    setError(null);
  };

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError("Deliverable title is required.");
      return;
    }

    if (
      form.content_url.trim() &&
      !/^https?:\/\/\S+$/i.test(form.content_url.trim())
    ) {
      setError("Please enter a valid content URL.");
      return;
    }

    try {
      const payload = {
        deliverable_type: form.deliverable_type,
        title: form.title.trim(),
        content_url: form.content_url.trim() || null,
        status: form.status,
        published_at: form.published_at
          ? new Date(`${form.published_at}T00:00:00`).toISOString()
          : null,
        notes: form.notes.trim() || null,
      };

      if (editingDeliverable) {
        await updateDeliverable.mutateAsync({
          id: editingDeliverable.id,
          collaborationId,
          updates: payload,
        });
      } else {
        await createDeliverable.mutateAsync({
          collaboration_id: collaborationId,
          ...payload,
        });
      }

      closeModal();
    } catch (err) {
      console.error("Failed to save deliverable:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save deliverable."
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingDeliverable) return;

    try {
      await deleteDeliverable.mutateAsync({
        id: deletingDeliverable.id,
        collaborationId,
      });
      setDeletingDeliverable(null);
    } catch (err) {
      console.error("Failed to delete deliverable:", err);
    }
  };

  return (
    <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h5 className="text-sm font-semibold text-neutral-900">
              Deliverables
            </h5>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-neutral-600">
              {completedCount} / {deliverablesExpected} completed
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-neutral-900 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus size={15} />
          Add Deliverable
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white px-4 py-7 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-neutral-500">
            <Loader2 size={16} className="animate-spin" />
            Loading deliverables...
          </div>
        </div>
      )}

      {isError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Unable to load deliverables.
        </div>
      )}

      {!isLoading && !isError && deliverables.length === 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-7 text-center">
          <p className="text-sm font-medium text-neutral-700">
            No deliverables added yet
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Add each Reel, Story, Post or other piece of content for this campaign.
          </p>
        </div>
      )}

      {!isLoading && !isError && deliverables.length > 0 && (
        <div className="mt-4 space-y-2">
          {deliverables.map((deliverable) => (
            <div
              key={deliverable.id}
              className="rounded-xl border border-neutral-200 bg-white p-3"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {deliverable.title || typeLabels[deliverable.deliverable_type]}
                    </p>

                    <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-600">
                      {typeLabels[deliverable.deliverable_type]}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium ${getStatusClasses(
                        deliverable.status
                      )}`}
                    >
                      {getStatusIcon(deliverable.status)}
                      {statusLabels[deliverable.status]}
                    </span>
                  </div>

                  {deliverable.notes && (
                    <p className="mt-1 line-clamp-2 text-xs text-neutral-500">
                      {deliverable.notes}
                    </p>
                  )}

                  {deliverable.published_at && (
                    <p className="mt-1 text-[11px] text-neutral-400">
                      Published{" "}
                      {new Date(deliverable.published_at).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {deliverable.content_url && (
                    <a
                      href={deliverable.content_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
                      aria-label="Open content"
                      title="Open content"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => openEdit(deliverable)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
                    aria-label="Edit deliverable"
                    title="Edit deliverable"
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingDeliverable(deliverable)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete deliverable"
                    title="Delete deliverable"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[10004] flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between border-b px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                  {editingDeliverable ? "Edit Deliverable" : "New Deliverable"}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-neutral-900">
                  {editingDeliverable ? "Update Content" : "Add Content"}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={createDeliverable.isPending || updateDeliverable.isPending}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    Deliverable Type
                  </label>
                  <select
                    value={form.deliverable_type}
                    onChange={(event) =>
                      updateField(
                        "deliverable_type",
                        event.target.value as CollaborationDeliverableType
                      )
                    }
                    disabled={createDeliverable.isPending || updateDeliverable.isPending}
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm capitalize outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                  >
                    {Object.entries(typeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="e.g. Festive Collection Reel"
                    disabled={createDeliverable.isPending || updateDeliverable.isPending}
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-800">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateField(
                          "status",
                          event.target.value as CollaborationDeliverableStatus
                        )
                      }
                      disabled={createDeliverable.isPending || updateDeliverable.isPending}
                      className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-800">
                      Published Date
                    </label>
                    <input
                      type="date"
                      value={form.published_at}
                      onChange={(event) =>
                        updateField("published_at", event.target.value)
                      }
                      disabled={createDeliverable.isPending || updateDeliverable.isPending}
                      className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    Content URL
                  </label>
                  <input
                    type="url"
                    value={form.content_url}
                    onChange={(event) =>
                      updateField("content_url", event.target.value)
                    }
                    placeholder="https://instagram.com/..."
                    disabled={createDeliverable.isPending || updateDeliverable.isPending}
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    Notes
                  </label>
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    placeholder="Add content notes, requirements or feedback..."
                    disabled={createDeliverable.isPending || updateDeliverable.isPending}
                    className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col-reverse gap-3 border-t px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                disabled={createDeliverable.isPending || updateDeliverable.isPending}
                className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={createDeliverable.isPending || updateDeliverable.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createDeliverable.isPending || updateDeliverable.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : editingDeliverable ? (
                  "Save Changes"
                ) : (
                  "Add Deliverable"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingDeliverable && (
        <div className="fixed inset-0 z-[10005] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">
                  Delete deliverable?
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  This will permanently remove this content entry.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDeletingDeliverable(null)}
                disabled={deleteDeliverable.isPending}
                className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-sm font-semibold text-neutral-900">
                {deletingDeliverable.title ||
                  typeLabels[deletingDeliverable.deliverable_type]}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {typeLabels[deletingDeliverable.deliverable_type]}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingDeliverable(null)}
                disabled={deleteDeliverable.isPending}
                className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteDeliverable.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteDeliverable.isPending && (
                  <Loader2 size={15} className="animate-spin" />
                )}
                {deleteDeliverable.isPending
                  ? "Deleting..."
                  : "Delete Deliverable"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
