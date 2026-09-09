import { createPortal } from "react-dom";
import {
  ExternalLink,
  Mail,
  Phone,
  X,
} from "lucide-react";

import type { CollaboratorApplication } from "../types/collaborator.types";

interface CollaboratorDetailsProps {
  collaborator: CollaboratorApplication | null;
  open: boolean;
  onClose: () => void;
}

function formatNumber(value: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN").format(value);
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusLabel(status: string) {
  return status
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusClasses(status: string) {
  switch (status) {
    case "pending":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "under_review":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "approved":
      return "border-green-200 bg-green-50 text-green-700";

    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-neutral-200 bg-neutral-100 text-neutral-700";
  }
}

export default function CollaboratorDetails({
  collaborator,
  open,
  onClose,
}: CollaboratorDetailsProps) {
  if (!open || !collaborator) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative
          flex
          max-h-[90vh]
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b px-6 py-5">
          <div className="min-w-0 pr-4">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
              Collaborator Application
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-neutral-900">
              {collaborator.full_name}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Applied {formatDate(collaborator.created_at)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close application"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-neutral-200
              text-neutral-600
              transition
              hover:bg-neutral-100
              hover:text-black
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">

            {/* Status */}
            <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-neutral-500">
                  Application Status
                </p>

                <p className="mt-1 text-sm font-medium text-neutral-900">
                  Current application status
                </p>
              </div>

              <span
                className={`w-fit rounded-full border px-3 py-1.5 text-sm font-medium ${getStatusClasses(
                  collaborator.status
                )}`}
              >
                {getStatusLabel(collaborator.status)}
              </span>
            </div>

            {/* Contact + Social */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Contact */}
              <section className="rounded-xl border border-neutral-200 p-5">
                <h3 className="text-sm font-semibold text-neutral-900">
                  Contact Information
                </h3>

                <div className="mt-4 space-y-4">

                  <div className="flex items-start gap-3">
                    <Mail
                      size={17}
                      className="mt-0.5 shrink-0 text-neutral-500"
                    />

                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-neutral-900">
                        {collaborator.email}
                      </p>
                    </div>
                  </div>

                  {collaborator.phone && (
                    <div className="flex items-start gap-3">
                      <Phone
                        size={17}
                        className="mt-0.5 shrink-0 text-neutral-500"
                      />

                      <div>
                        <p className="text-xs text-neutral-500">
                          Phone
                        </p>

                        <p className="mt-1 text-sm font-medium text-neutral-900">
                          {collaborator.phone}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </section>

              {/* Social */}
              <section className="rounded-xl border border-neutral-200 p-5">
                <h3 className="text-sm font-semibold text-neutral-900">
                  Social Profiles
                </h3>

                <div className="mt-4 space-y-3">

                  {collaborator.instagram_url ? (
                    <a
                      href={collaborator.instagram_url}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-neutral-200
                        p-3
                        transition
                        hover:bg-neutral-50
                      "
                    >
                      <div>
                        <p className="text-xs text-neutral-500">
                          Instagram
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          @{collaborator.instagram_username}
                        </p>
                      </div>

                      <ExternalLink
                        size={16}
                        className="text-neutral-500"
                      />
                    </a>
                  ) : (
                    <div className="rounded-xl border border-neutral-200 p-3">
                      <p className="text-xs text-neutral-500">
                        Instagram
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        @{collaborator.instagram_username}
                      </p>
                    </div>
                  )}

                  {collaborator.youtube_url && (
                    <a
                      href={collaborator.youtube_url}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-neutral-200
                        p-3
                        transition
                        hover:bg-neutral-50
                      "
                    >
                      <span className="text-sm font-medium">
                        YouTube
                      </span>

                      <ExternalLink size={16} />
                    </a>
                  )}

                  {collaborator.other_social_url && (
                    <a
                      href={collaborator.other_social_url}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-neutral-200
                        p-3
                        transition
                        hover:bg-neutral-50
                      "
                    >
                      <span className="text-sm font-medium">
                        Other Social Profile
                      </span>

                      <ExternalLink size={16} />
                    </a>
                  )}

                </div>
              </section>
            </div>

            {/* Creator Metrics */}
            <section>
              <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                Creator Metrics
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-neutral-200 p-5">
                  <p className="text-xs text-neutral-500">
                    Followers
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-neutral-900">
                    {formatNumber(
                      collaborator.follower_count
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 p-5">
                  <p className="text-xs text-neutral-500">
                    Average Reel Views
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-neutral-900">
                    {formatNumber(
                      collaborator.average_reel_views
                    )}
                  </p>
                </div>

              </div>
            </section>

            {/* Collaboration Preferences */}
            <section className="rounded-xl border border-neutral-200 p-5">
              <h3 className="text-sm font-semibold text-neutral-900">
                Collaboration Preferences
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-xs text-neutral-500">
                    Collaboration Type
                  </p>

                  <p className="mt-1 font-medium capitalize">
                    {collaborator.collaboration_type}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">
                    Content Category
                  </p>

                  <p className="mt-1 font-medium capitalize">
                    {collaborator.content_category || "—"}
                  </p>
                </div>

              </div>
            </section>

            {/* Why Collaborate */}
            {collaborator.why_collaborate && (
              <section>
                <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                  Why They Want to Collaborate
                </h3>

                <div className="rounded-xl bg-neutral-50 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                    {collaborator.why_collaborate}
                  </p>
                </div>
              </section>
            )}

            {/* Portfolio */}
            {collaborator.portfolio_url && (
              <section>
                <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                  Portfolio
                </h3>

                <a
                  href={collaborator.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-neutral-200
                    p-4
                    transition
                    hover:bg-neutral-50
                  "
                >
                  <span className="text-sm font-medium">
                    Open Portfolio
                  </span>

                  <ExternalLink size={17} />
                </a>
              </section>
            )}

            {/* Admin Notes */}
            {collaborator.admin_notes && (
              <section>
                <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                  Admin Notes
                </h3>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                    {collaborator.admin_notes}
                  </p>
                </div>
              </section>
            )}

            {/* Review Information */}
            {collaborator.reviewed_at && (
              <section className="border-t pt-5">
                <p className="text-xs text-neutral-500">
                  Last Reviewed
                </p>

                <p className="mt-1 text-sm font-medium text-neutral-900">
                  {formatDate(
                    collaborator.reviewed_at
                  )}
                </p>
              </section>
            )}

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}