import { useState } from "react";
import {
  Check,
  Edit3,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  Save,
  Users,
  X,
  XCircle,
} from "lucide-react";

import {
  useCollaborators,
  useCreatorProfiles,
  useUpdateCollaboratorStatus,
  useUpdateCreator,
} from "../hooks/useCollaborators";

import { useCollaborations } from "../hooks/useCollaborations";

import CollaboratorStats from "../components/CollaboratorStats";
import CollaboratorsTable from "../components/CollaboratorsTable";
import ApprovedCreatorsTable from "../components/ApprovedCreatorsTable";
import CollaborationHistory from "../components/CollaborationHistory";
import NewCollaborationModal from "../components/NewCollaborationModal";

import type {
  CollaboratorApplication,
  CollaboratorProfile,
} from "../types/collaborator.types";

function formatNumber(value: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN").format(value);
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
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
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

type PendingAction =
  | "approved"
  | "rejected"
  | null;

type ActiveTab =
  | "applications"
  | "approved";

type CreatorForm = {
  full_name: string;
  email: string;
  phone: string;
  instagram_username: string;
  instagram_url: string;
  youtube_url: string;
  other_social_url: string;
  follower_count: string;
  average_reel_views: string;
  content_category: string;
  collaboration_type:
    | "gifted"
    | "affiliate"
    | "paid"
    | "ugc";
  portfolio_url: string;
  status:
    | "active"
    | "inactive"
    | "blacklisted";
  admin_notes: string;
  affiliate_code: string;
};

const emptyCreatorForm: CreatorForm = {
  full_name: "",
  email: "",
  phone: "",
  instagram_username: "",
  instagram_url: "",
  youtube_url: "",
  other_social_url: "",
  follower_count: "",
  average_reel_views: "",
  content_category: "",
  collaboration_type: "gifted",
  portfolio_url: "",
  status: "active",
  admin_notes: "",
  affiliate_code: "",
};

export default function CollaboratorsPage() {
  /*
   * =========================================================
   * ACTIVE TAB
   * =========================================================
   */

  const [activeTab, setActiveTab] =
    useState<ActiveTab>("applications");

  /*
   * =========================================================
   * SELECTED APPLICATION
   * =========================================================
   */

  const [
    selectedCollaborator,
    setSelectedCollaborator,
  ] = useState<CollaboratorApplication | null>(
    null
  );

  /*
   * =========================================================
   * SELECTED CREATOR
   * =========================================================
   */

  const [
    selectedCreator,
    setSelectedCreator,
  ] = useState<CollaboratorProfile | null>(
    null
  );

  /*
   * =========================================================
   * NEW COLLABORATION MODAL
   * =========================================================
   */

  const [
    isNewCollaborationOpen,
    setIsNewCollaborationOpen,
  ] = useState(false);

  /*
   * =========================================================
   * COLLABORATION HISTORY
   * =========================================================
   */

  const {
    data: collaborations = [],
    isLoading: isLoadingCollaborations,
  } = useCollaborations(
    selectedCreator?.id
  );

  /*
   * =========================================================
   * CREATOR EDIT MODE
   * =========================================================
   */

  const [isEditingCreator, setIsEditingCreator] =
    useState(false);

  const [creatorForm, setCreatorForm] =
    useState<CreatorForm>(
      emptyCreatorForm
    );

  const [creatorFormError, setCreatorFormError] =
    useState<string | null>(null);

  /*
   * =========================================================
   * ADMIN NOTES
   * =========================================================
   */

  const [
    adminNotes,
    setAdminNotes,
  ] = useState("");

  /*
   * =========================================================
   * PENDING ACTION
   * =========================================================
   */

  const [
    pendingAction,
    setPendingAction,
  ] = useState<PendingAction>(null);

  /*
   * =========================================================
   * APPLICATIONS
   * =========================================================
   */

  const {
    data: collaborators = [],
    isLoading,
    isError,
    error,
  } = useCollaborators();

  /*
   * =========================================================
   * CREATOR PROFILES
   * =========================================================
   */

  const {
    data: creatorProfiles = [],
    isLoading: isLoadingCreatorProfiles,
    isError: isCreatorProfilesError,
    error: creatorProfilesError,
  } = useCreatorProfiles();

  /*
   * =========================================================
   * STATUS MUTATION
   * =========================================================
   */

  const updateCollaboratorStatus =
    useUpdateCollaboratorStatus();

  /*
   * =========================================================
   * CREATOR UPDATE MUTATION
   * =========================================================
   */

  const updateCreator =
    useUpdateCreator();

  /*
   * =========================================================
   * PREPARE CREATOR FORM
   * =========================================================
   */

  const populateCreatorForm = (
    creator: CollaboratorProfile
  ) => {
    setCreatorForm({
      full_name: creator.full_name ?? "",
      email: creator.email ?? "",
      phone: creator.phone ?? "",
      instagram_username:
        creator.instagram_username ?? "",
      instagram_url:
        creator.instagram_url ?? "",
      youtube_url:
        creator.youtube_url ?? "",
      other_social_url:
        creator.other_social_url ?? "",
      follower_count:
        creator.follower_count !== null &&
        creator.follower_count !== undefined
          ? String(creator.follower_count)
          : "",
      average_reel_views:
        creator.average_reel_views !== null &&
        creator.average_reel_views !== undefined
          ? String(
              creator.average_reel_views
            )
          : "",
      content_category:
        creator.content_category ?? "",
      collaboration_type:
        creator.collaboration_type,
      portfolio_url:
        creator.portfolio_url ?? "",
      status: creator.status,
      admin_notes:
        creator.admin_notes ?? "",
      affiliate_code:
        creator.affiliate_code ?? "",
    });

    setCreatorFormError(null);
  };

  /*
   * =========================================================
   * OPEN CREATOR MODAL
   * =========================================================
   */

  const handleOpenCreator = (
    creator: CollaboratorProfile
  ) => {
    setSelectedCreator(creator);
    setIsEditingCreator(false);
    populateCreatorForm(creator);
  };

  /*
   * =========================================================
   * CLOSE CREATOR MODAL
   * =========================================================
   */

  const handleCloseCreatorModal = () => {
    if (updateCreator.isPending) {
      return;
    }

    setSelectedCreator(null);
    setIsEditingCreator(false);
    setCreatorFormError(null);
  };

  /*
   * =========================================================
   * UPDATE CREATOR FORM FIELD
   * =========================================================
   */

  const updateCreatorField = <
    K extends keyof CreatorForm
  >(
    field: K,
    value: CreatorForm[K]
  ) => {
    setCreatorForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (creatorFormError) {
      setCreatorFormError(null);
    }
  };

  /*
   * =========================================================
   * START EDITING
   * =========================================================
   */

  const handleStartCreatorEdit = () => {
    if (!selectedCreator) {
      return;
    }

    populateCreatorForm(
      selectedCreator
    );

    setIsEditingCreator(true);
  };

  /*
   * =========================================================
   * CANCEL EDITING
   * =========================================================
   */

  const handleCancelCreatorEdit = () => {
    if (!selectedCreator) {
      return;
    }

    populateCreatorForm(
      selectedCreator
    );

    setIsEditingCreator(false);
    setCreatorFormError(null);
  };

  /*
   * =========================================================
   * SAVE CREATOR
   * =========================================================
   */

  const handleSaveCreator = async () => {
    if (!selectedCreator) {
      return;
    }

    if (!creatorForm.full_name.trim()) {
      setCreatorFormError(
        "Full name is required."
      );
      return;
    }

    if (!creatorForm.email.trim()) {
      setCreatorFormError(
        "Email is required."
      );
      return;
    }

    if (
      !creatorForm.instagram_username.trim()
    ) {
      setCreatorFormError(
        "Instagram username is required."
      );
      return;
    }

    const followerCount =
      creatorForm.follower_count.trim()
        ? Number(
            creatorForm.follower_count
          )
        : null;

    const averageReelViews =
      creatorForm.average_reel_views.trim()
        ? Number(
            creatorForm.average_reel_views
          )
        : null;

    if (
      followerCount !== null &&
      (!Number.isFinite(followerCount) ||
        followerCount < 0)
    ) {
      setCreatorFormError(
        "Followers must be a valid non-negative number."
      );
      return;
    }

    if (
      averageReelViews !== null &&
      (!Number.isFinite(
        averageReelViews
      ) ||
        averageReelViews < 0)
    ) {
      setCreatorFormError(
        "Average reel views must be a valid non-negative number."
      );
      return;
    }

    try {
      const updated =
        await updateCreator.mutateAsync({
          id: selectedCreator.id,

          updates: {
            full_name:
              creatorForm.full_name.trim(),

            email:
              creatorForm.email.trim(),

            phone:
              creatorForm.phone.trim() ||
              null,

            instagram_username:
              creatorForm.instagram_username
                .trim()
                .replace(/^@/, ""),

            instagram_url:
              creatorForm.instagram_url.trim() ||
              null,

            youtube_url:
              creatorForm.youtube_url.trim() ||
              null,

            other_social_url:
              creatorForm.other_social_url.trim() ||
              null,

            follower_count:
              followerCount,

            average_reel_views:
              averageReelViews,

            content_category:
              creatorForm.content_category.trim() ||
              null,

            collaboration_type:
              creatorForm.collaboration_type,

            portfolio_url:
              creatorForm.portfolio_url.trim() ||
              null,

            status:
              creatorForm.status,

            admin_notes:
              creatorForm.admin_notes.trim() ||
              null,

            affiliate_code:
              creatorForm.affiliate_code.trim() ||
              null,
          },
        });

      setSelectedCreator(
        updated as CollaboratorProfile
      );

      populateCreatorForm(
        updated as CollaboratorProfile
      );

      setIsEditingCreator(false);
      setCreatorFormError(null);
    } catch (error) {
      console.error(
        "Failed to update creator:",
        error
      );

      setCreatorFormError(
        error instanceof Error
          ? error.message
          : "Unable to update creator profile."
      );
    }
  };

  /*
   * =========================================================
   * APPLICATION MODAL CLOSE
   * =========================================================
   */

  const handleCloseModal = () => {
    if (
      updateCollaboratorStatus.isPending ||
      pendingAction
    ) {
      return;
    }

    setSelectedCollaborator(null);
    setAdminNotes("");
  };

  /*
   * =========================================================
   * UPDATE APPLICATION STATUS
   * =========================================================
   */

  const handleStatusUpdate = async (
    status:
      | "under_review"
      | "approved"
      | "rejected"
  ) => {
    if (!selectedCollaborator) {
      return;
    }

    try {
      const updated =
        await updateCollaboratorStatus.mutateAsync({
          id: selectedCollaborator.id,
          status,
          adminNotes:
            adminNotes.trim() || null,
        });

      setSelectedCollaborator(
        updated
      );

      setAdminNotes(
        updated.admin_notes ?? ""
      );

      setPendingAction(null);
    } catch (error) {
      console.error(
        "Failed to update collaborator status:",
        error
      );

      setPendingAction(null);
    }
  };

  /*
   * =========================================================
   * REQUEST STATUS CHANGE
   * =========================================================
   */

  const requestStatusChange = (
    status:
      | "approved"
      | "rejected"
  ) => {
    if (
      updateCollaboratorStatus.isPending
    ) {
      return;
    }

    setPendingAction(status);
  };

  /*
   * =========================================================
   * CONFIRM STATUS CHANGE
   * =========================================================
   */

  const confirmStatusChange = async () => {
    if (!pendingAction) {
      return;
    }

    await handleStatusUpdate(
      pendingAction
    );
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (
    isLoading ||
    isLoadingCreatorProfiles
  ) {
    return (
      <div className="p-6">
        <p>
          Loading collaborators...
        </p>
      </div>
    );
  }

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  if (
    isError ||
    isCreatorProfilesError
  ) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          {isError
            ? error instanceof Error
              ? error.message
              : "Unable to load collaborator applications."
            : creatorProfilesError instanceof Error
            ? creatorProfilesError.message
            : "Unable to load creator profiles."}
        </p>
      </div>
    );
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <>
      <div className="space-y-6 p-6">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div>
          <h1 className="text-2xl font-semibold">
            Collaborators
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage creator applications and approved
            T&M Jewels collaborators.
          </p>
        </div>

        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <CollaboratorStats
          collaborators={
            collaborators
          }
        />

        {/* =====================================================
            TABS
        ====================================================== */}

        <div className="rounded-2xl border bg-white shadow-sm">

          <div className="border-b px-5 pt-4">

            <div className="flex items-center gap-6">

              {/* APPLICATIONS TAB */}

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "applications"
                  )
                }
                className={`
                  relative
                  pb-4
                  text-sm
                  font-medium
                  transition
                  ${
                    activeTab ===
                    "applications"
                      ? "text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-800"
                  }
                `}
              >
                <span className="flex items-center gap-2">

                  Applications

                  <span
                    className={`
                      rounded-full
                      px-2
                      py-0.5
                      text-xs
                      ${
                        activeTab ===
                        "applications"
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-600"
                      }
                    `}
                  >
                    {
                      collaborators.length
                    }
                  </span>

                </span>

                {activeTab ===
                  "applications" && (
                  <span
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      h-0.5
                      rounded-full
                      bg-neutral-900
                    "
                  />
                )}

              </button>

              {/* APPROVED CREATORS TAB */}

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "approved"
                  )
                }
                className={`
                  relative
                  pb-4
                  text-sm
                  font-medium
                  transition
                  ${
                    activeTab ===
                    "approved"
                      ? "text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-800"
                  }
                `}
              >
                <span className="flex items-center gap-2">

                  Approved Creators

                  <span
                    className={`
                      rounded-full
                      px-2
                      py-0.5
                      text-xs
                      ${
                        activeTab ===
                        "approved"
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-600"
                      }
                    `}
                  >
                    {
                      creatorProfiles.length
                    }
                  </span>

                </span>

                {activeTab ===
                  "approved" && (
                  <span
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      h-0.5
                      rounded-full
                      bg-neutral-900
                    "
                  />
                )}

              </button>

            </div>

          </div>

          {/* ===================================================
              APPLICATIONS
          ==================================================== */}

          {activeTab ===
            "applications" && (
            <div className="p-5">

              <CollaboratorsTable
                collaborators={
                  collaborators
                }
                onView={(collaborator) => {
                  setSelectedCollaborator(
                    collaborator
                  );

                  setAdminNotes(
                    collaborator.admin_notes ??
                      ""
                  );

                  setPendingAction(null);
                }}
              />

            </div>
          )}

          {/* ===================================================
              APPROVED CREATORS
          ==================================================== */}

          {activeTab ===
            "approved" && (
            <div className="p-5">

              <ApprovedCreatorsTable
                creators={
                  creatorProfiles
                }
                onView={
                  handleOpenCreator
                }
              />

            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          APPLICATION DETAILS MODAL
      ====================================================== */}

      {selectedCollaborator && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              handleCloseModal();
            }
          }}
        >

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
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >

            {/* HEADER */}

            <div
              className="
                flex
                shrink-0
                items-start
                justify-between
                border-b
                px-6
                py-5
              "
            >

              <div className="min-w-0">

                <p
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.15em]
                    text-neutral-500
                  "
                >
                  Collaborator Application
                </p>

                <h2
                  className="
                    mt-1
                    text-2xl
                    font-semibold
                    text-neutral-900
                  "
                >
                  {
                    selectedCollaborator.full_name
                  }
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-neutral-500
                  "
                >
                  Applied{" "}
                  {formatDate(
                    selectedCollaborator.created_at
                  )}
                </p>

              </div>

              <button
                type="button"
                onClick={
                  handleCloseModal
                }
                disabled={
                  updateCollaboratorStatus.isPending ||
                  !!pendingAction
                }
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
                  transition
                  hover:bg-neutral-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <X size={18} />
              </button>

            </div>

            {/* CONTENT */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
              "
            >

              <div
                className="
                  space-y-6
                  p-6
                "
              >

                {/* STATUS */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-neutral-200
                    bg-neutral-50
                    p-4
                  "
                >

                  <div>

                    <p className="text-xs text-neutral-500">
                      Application Status
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      Current status
                    </p>

                  </div>

                  <span
                    className={`
                      rounded-full
                      border
                      px-3
                      py-1.5
                      text-sm
                      font-medium
                      ${getStatusClasses(
                        selectedCollaborator.status
                      )}
                    `}
                  >
                    {getStatusLabel(
                      selectedCollaborator.status
                    )}
                  </span>

                </div>

                {/* CONTACT */}

                <section
                  className="
                    rounded-xl
                    border
                    border-neutral-200
                    p-5
                  "
                >

                  <h3 className="text-sm font-semibold">
                    Contact Information
                  </h3>

                  <div className="mt-4 space-y-4">

                    <div className="flex items-start gap-3">

                      <Mail
                        size={18}
                        className="mt-0.5 text-neutral-500"
                      />

                      <div>

                        <p className="text-xs text-neutral-500">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm font-medium">
                          {
                            selectedCollaborator.email
                          }
                        </p>

                      </div>

                    </div>

                    {selectedCollaborator.phone && (
                      <div className="flex items-start gap-3">

                        <Phone
                          size={18}
                          className="mt-0.5 text-neutral-500"
                        />

                        <div>

                          <p className="text-xs text-neutral-500">
                            Phone
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {
                              selectedCollaborator.phone
                            }
                          </p>

                        </div>

                      </div>
                    )}

                  </div>

                </section>

                {/* SOCIAL PROFILES */}

                <section
                  className="
                    rounded-xl
                    border
                    border-neutral-200
                    p-5
                  "
                >

                  <h3 className="text-sm font-semibold">
                    Social Profiles
                  </h3>

                  <div className="mt-4 space-y-3">

                    {selectedCollaborator.instagram_url ? (
                      <a
                        href={
                          selectedCollaborator.instagram_url
                        }
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

                        <div>

                          <p className="text-xs text-neutral-500">
                            Instagram
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            @
                            {
                              selectedCollaborator.instagram_username
                            }
                          </p>

                        </div>

                        <ExternalLink
                          size={17}
                          className="text-neutral-500"
                        />

                      </a>
                    ) : (
                      <div className="rounded-xl border border-neutral-200 p-4">

                        <p className="text-xs text-neutral-500">
                          Instagram
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          @
                          {
                            selectedCollaborator.instagram_username
                          }
                        </p>

                      </div>
                    )}

                    {selectedCollaborator.youtube_url && (
                      <a
                        href={
                          selectedCollaborator.youtube_url
                        }
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
                          YouTube
                        </span>

                        <ExternalLink size={17} />

                      </a>
                    )}

                    {selectedCollaborator.other_social_url && (
                      <a
                        href={
                          selectedCollaborator.other_social_url
                        }
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
                          Other Social Profile
                        </span>

                        <ExternalLink size={17} />

                      </a>
                    )}

                  </div>

                </section>

                {/* CREATOR METRICS */}

                <section>

                  <h3 className="mb-3 text-sm font-semibold">
                    Creator Metrics
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div className="rounded-xl border border-neutral-200 p-5">

                      <p className="text-xs text-neutral-500">
                        Followers
                      </p>

                      <p className="mt-2 text-2xl font-semibold">
                        {formatNumber(
                          selectedCollaborator.follower_count
                        )}
                      </p>

                    </div>

                    <div className="rounded-xl border border-neutral-200 p-5">

                      <p className="text-xs text-neutral-500">
                        Average Reel Views
                      </p>

                      <p className="mt-2 text-2xl font-semibold">
                        {formatNumber(
                          selectedCollaborator.average_reel_views
                        )}
                      </p>

                    </div>

                  </div>

                </section>

                {/* COLLABORATION */}

                <section
                  className="
                    rounded-xl
                    border
                    border-neutral-200
                    p-5
                  "
                >

                  <h3 className="text-sm font-semibold">
                    Collaboration Preferences
                  </h3>

                  <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">

                    <div>

                      <p className="text-xs text-neutral-500">
                        Collaboration Type
                      </p>

                      <p className="mt-1 font-medium capitalize">
                        {
                          selectedCollaborator.collaboration_type
                        }
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-neutral-500">
                        Content Category
                      </p>

                      <p className="mt-1 font-medium capitalize">
                        {
                          selectedCollaborator.content_category ||
                          "—"
                        }
                      </p>

                    </div>

                  </div>

                </section>

                {/* WHY COLLABORATE */}

                {selectedCollaborator.why_collaborate && (
                  <section>

                    <h3 className="mb-3 text-sm font-semibold">
                      Why They Want to Collaborate
                    </h3>

                    <div className="rounded-xl bg-neutral-50 p-5">

                      <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                        {
                          selectedCollaborator.why_collaborate
                        }
                      </p>

                    </div>

                  </section>
                )}

                {/* PORTFOLIO */}

                {selectedCollaborator.portfolio_url && (
                  <section>

                    <h3 className="mb-3 text-sm font-semibold">
                      Portfolio
                    </h3>

                    <a
                      href={
                        selectedCollaborator.portfolio_url
                      }
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

                {/* SAVED NOTES */}

                {selectedCollaborator.admin_notes && (
                  <section>

                    <h3 className="mb-3 text-sm font-semibold">
                      Saved Admin Notes
                    </h3>

                    <div
                      className="
                        rounded-xl
                        border
                        border-amber-200
                        bg-amber-50
                        p-5
                      "
                    >

                      <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                        {
                          selectedCollaborator.admin_notes
                        }
                      </p>

                    </div>

                  </section>
                )}

                {/* REVIEW */}

                <section
                  className="
                    rounded-2xl
                    border
                    border-neutral-200
                    bg-neutral-50
                    p-5
                  "
                >

                  <div>

                    <h3 className="text-sm font-semibold text-neutral-900">
                      Review Application
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Add internal notes and update
                      the application status.
                    </p>

                  </div>

                  <div className="mt-5">

                    <label
                      htmlFor="admin-notes"
                      className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-neutral-800
                      "
                    >
                      Admin Notes
                    </label>

                    <textarea
                      id="admin-notes"
                      value={adminNotes}
                      onChange={(event) =>
                        setAdminNotes(
                          event.target.value
                        )
                      }
                      placeholder="Add notes about this creator..."
                      rows={4}
                      disabled={
                        updateCollaboratorStatus.isPending ||
                        !!pendingAction
                      }
                      className="
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-neutral-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                        outline-none
                        transition
                        placeholder:text-neutral-400
                        focus:border-neutral-400
                        focus:ring-2
                        focus:ring-neutral-200
                        disabled:cursor-not-allowed
                        disabled:bg-neutral-100
                      "
                    />

                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusUpdate(
                          "under_review"
                        )
                      }
                      disabled={
                        updateCollaboratorStatus.isPending ||
                        !!pendingAction
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-blue-200
                        bg-blue-50
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-blue-700
                        transition
                        hover:bg-blue-100
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >

                      {updateCollaboratorStatus.isPending ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}

                      Under Review

                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        requestStatusChange(
                          "rejected"
                        )
                      }
                      disabled={
                        updateCollaboratorStatus.isPending ||
                        !!pendingAction
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-red-700
                        transition
                        hover:bg-red-100
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >

                      <XCircle size={16} />

                      Reject

                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        requestStatusChange(
                          "approved"
                        )
                      }
                      disabled={
                        updateCollaboratorStatus.isPending ||
                        !!pendingAction
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-neutral-900
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-neutral-800
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >

                      <Check size={16} />

                      Approve

                    </button>

                  </div>

                </section>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          APPROVED CREATOR MODAL
      ====================================================== */}

      {selectedCreator && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              handleCloseCreatorModal();
            }
          }}
        >

          <div
            className="
              relative
              flex
              max-h-[90vh]
              w-full
              max-w-4xl
              flex-col
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >

            {/* =================================================
                CREATOR HEADER
            ================================================== */}

            <div
              className="
                flex
                shrink-0
                items-start
                justify-between
                border-b
                px-6
                py-5
              "
            >

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-green-200
                      bg-green-50
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      text-green-700
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-green-500
                      "
                    />

                    Approved Creator
                  </span>

                  {!isEditingCreator && (
                    <span
                      className={`
                        rounded-full
                        border
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        ${getStatusClasses(
                          selectedCreator.status
                        )}
                      `}
                    >
                      {getStatusLabel(
                        selectedCreator.status
                      )}
                    </span>
                  )}

                </div>

                <h2
                  className="
                    mt-2
                    text-2xl
                    font-semibold
                    text-neutral-900
                  "
                >
                  {selectedCreator.full_name}
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-neutral-500
                  "
                >
                  @
                  {
                    selectedCreator.instagram_username
                  }
                </p>

              </div>

              <div className="flex items-center gap-2">

                {!isEditingCreator && (
                  <button
                    type="button"
                    onClick={
                      handleStartCreatorEdit
                    }
                    className="
                      inline-flex
                      h-9
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-neutral-200
                      px-3
                      text-sm
                      font-medium
                      text-neutral-700
                      transition
                      hover:bg-neutral-100
                    "
                  >

                    <Edit3 size={16} />

                    Edit

                  </button>
                )}

                <button
                  type="button"
                  onClick={
                    handleCloseCreatorModal
                  }
                  disabled={
                    updateCreator.isPending
                  }
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
                    transition
                    hover:bg-neutral-100
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <X size={18} />
                </button>

              </div>

            </div>

            {/* =================================================
                CONTENT
            ================================================== */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
              "
            >

              <div className="space-y-6 p-6">

                {/* =================================================
                    EDIT MODE
                ================================================== */}

                {isEditingCreator ? (
                  <>
                    {/* EDIT ERROR */}

                    {creatorFormError && (
                      <div
                        className="
                          rounded-xl
                          border
                          border-red-200
                          bg-red-50
                          px-4
                          py-3
                          text-sm
                          text-red-700
                        "
                      >
                        {creatorFormError}
                      </div>
                    )}

                    {/* BASIC INFORMATION */}

                    <section
                      className="
                        rounded-xl
                        border
                        border-neutral-200
                        p-5
                      "
                    >

                      <div className="flex items-center gap-2">

                        <Users
                          size={18}
                          className="text-neutral-500"
                        />

                        <h3 className="text-sm font-semibold">
                          Basic Information
                        </h3>

                      </div>

                      <div
                        className="
                          mt-5
                          grid
                          grid-cols-1
                          gap-5
                          sm:grid-cols-2
                        "
                      >

                        {/* NAME */}

                        <div>

                          <label
                            htmlFor="creator-full-name"
                            className="mb-2 block text-sm font-medium"
                          >
                            Full Name
                          </label>

                          <input
                            id="creator-full-name"
                            type="text"
                            value={
                              creatorForm.full_name
                            }
                            onChange={(event) =>
                              updateCreatorField(
                                "full_name",
                                event.target.value
                              )
                            }
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-neutral-200
                              bg-white
                              px-3
                              text-sm
                              outline-none
                              transition
                              focus:border-neutral-400
                              focus:ring-2
                              focus:ring-neutral-200
                            "
                          />

                        </div>

                        {/* EMAIL */}

                        <div>

                          <label
                            htmlFor="creator-email"
                            className="mb-2 block text-sm font-medium"
                          >
                            Email
                          </label>

                          <input
                            id="creator-email"
                            type="email"
                            value={
                              creatorForm.email
                            }
                            onChange={(event) =>
                              updateCreatorField(
                                "email",
                                event.target.value
                              )
                            }
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-neutral-200
                              bg-white
                              px-3
                              text-sm
                              outline-none
                              transition
                              focus:border-neutral-400
                              focus:ring-2
                              focus:ring-neutral-200
                            "
                          />

                        </div>

                        {/* PHONE */}

                        <div>

                          <label
                            htmlFor="creator-phone"
                            className="mb-2 block text-sm font-medium"
                          >
                            Phone
                          </label>

                          <input
                            id="creator-phone"
                            type="text"
                            value={
                              creatorForm.phone
                            }
                            onChange={(event) =>
                              updateCreatorField(
                                "phone",
                                event.target.value
                              )
                            }
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-neutral-200
                              bg-white
                              px-3
                              text-sm
                              outline-none
                              transition
                              focus:border-neutral-400
                              focus:ring-2
                              focus:ring-neutral-200
                            "
                          />

                        </div>

                        {/* CONTENT CATEGORY */}

                        <div>

                          <label
                            htmlFor="creator-category"
                            className="mb-2 block text-sm font-medium"
                          >
                            Content Category
                          </label>

                          <input
                            id="creator-category"
                            type="text"
                            value={
                              creatorForm.content_category
                            }
                            onChange={(event) =>
                              updateCreatorField(
                                "content_category",
                                event.target.value
                              )
                            }
                            placeholder="Fashion, Beauty, Lifestyle..."
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-neutral-200
                              bg-white
                              px-3
                              text-sm
                              outline-none
                              transition
                              focus:border-neutral-400
                              focus:ring-2
                              focus:ring-neutral-200
                            "
                          />

                        </div>

                      </div>

                    </section>

                    {/* SOCIAL PROFILES */}

                    <section
                      className="
                        rounded-xl
                        border
                        border-neutral-200
                        p-5
                      "
                    >

                      <h3 className="text-sm font-semibold">
                        Social Profiles
                      </h3>

                      <div
                        className="
                          mt-5
                          grid
                          grid-cols-1
                          gap-5
                          sm:grid-cols-2
                        "
                      >

                        {/* INSTAGRAM USERNAME */}

                        <div>

                          <label
                            htmlFor="creator-instagram-username"
                            className="mb-2 block text-sm font-medium"
                          >
                            Instagram Username
                          </label>

                          <div className="relative">

                            <span
                              className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-sm
                                text-neutral-400
                              "
                            >
                              @
                            </span>

                            <input
                              id="creator-instagram-username"
                              type="text"
                              value={
                                creatorForm.instagram_username
                              }
                              onChange={(event) =>
                                updateCreatorField(
                                  "instagram_username",
                                  event.target.value.replace(
                                    /^@/,
                                    ""
                                  )
                                )
                              }
                              className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-neutral-200
                                bg-white
                                pl-7
                                pr-3
                                text-sm
                                outline-none
                                transition
                                focus:border-neutral-400
                                focus:ring-2
                                focus:ring-neutral-200
                              "
                            />

                          </div>

                        </div>

                        {/* INSTAGRAM URL */}

                        <div>

                          <label
                            htmlFor="creator-instagram-url"
                            className="mb-2 block text-sm font-medium"
                          >
                            Instagram URL
                          </label>

                          <input
                            id="creator-instagram-url"
                            type="url"
                            value={
                              creatorForm.instagram_url
                            }
                            onChange={(event) =>
                              updateCreatorField(
                                "instagram_url",
                                event.target.value
                              )
                            }
                            placeholder="https://instagram.com/..."
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-neutral-200
                              bg-white
                              px-3
                              text-sm
                              outline-none
                              transition
                              focus:border-neutral-400
                              focus:ring-2
                              focus:ring-neutral-200
                            "
                          />

                        </div>

                        {/* YOUTUBE */}

                        <div>

                          <label
                            htmlFor="creator-youtube-url"
                            className="mb-2 block text-sm font-medium"
                          >
                            YouTube URL
                          </label>

                          <input
                            id="creator-youtube-url"
                            type="url"
                            value={
                              creatorForm.youtube_url
                            }
                            onChange={(event) =>
                              updateCreatorField(
                                "youtube_url",
                                event.target.value
                              )
                            }
                            placeholder="https://youtube.com/..."
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-neutral-200
                              bg-white
                              px-3
                              text-sm
                              outline-none
                              transition
                              focus:border-neutral-400
                              focus:ring-2
                              focus:ring-neutral-200
                            "
                          />

                        </div>

                        {/* OTHER SOCIAL */}

                        <div>

                          <label
                            htmlFor="creator-other-social"
                            className="mb-2 block text-sm font-medium"
                          >
                            Other Social URL
                          </label>

                          <input
                            id="creator-other-social"
                            type="url"
                            value={
                              creatorForm.other_social_url
                            }
                            onChange={(event) =>
                              updateCreatorField(
                                "other_social_url",
                                event.target.value
                              )
                            }
                            placeholder="Optional"
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-neutral-200
                              bg-white
                              px-3
                              text-sm
                              outline-none
                              transition
                              focus:border-neutral-400
                              focus:ring-2
                              focus:ring-neutral-200
                            "
                          />

                        </div>

                      </div>

                    </section>

                    {/* CREATOR METRICS */}

                    <section
                      className="
                        rounded-xl
                        border
                        border-neutral-200
                        p-5
                      "
                    >

                      <h3 className="text-sm font-semibold">
                        Creator Metrics
                      </h3>

                      <div
                        className="
                          mt-5
                          grid
                          grid-cols-1
                          gap-5
                          sm:grid-cols-2
                        "
                      >

                        {/* FOLLOWERS */}

                        <div>

                          <label
                            htmlFor="creator-followers"
                            className="mb-2 block text-sm font-medium"
                          >
                            Followers
                          </label>

                          <input
                            id="creator-followers"
                            type="number"
                            min="0"
                            value={
                              creatorForm.follower_count
                            }
                            onChange={(event) =>
                              updateCreatorField(
                                "follower_count",
                                event.target.value
                              )
                            }
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-neutral-200
                              bg-white
                              px-3
                              text-sm
                              outline-none
                              transition
                              focus:border-neutral-400
                              focus:ring-2
                              focus:ring-neutral-200
                            "
                          />

                        </div>

                        {/* REEL VIEWS */}

                        <div>

                          <label
                            htmlFor="creator-reel-views"
                            className="mb-2 block text-sm font-medium"
                          >
                            Average Reel Views
                          </label>

                          <input
                            id="creator-reel-views"
                            type="number"
                            min="0"
                            value={
                              creatorForm.average_reel_views
                            }
                            onChange={(event) =>
                              updateCreatorField(
                                "average_reel_views",
                                event.target.value
                              )
                            }
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-neutral-200
                              bg-white
                              px-3
                              text-sm
                              outline-none
                              transition
                              focus:border-neutral-400
                              focus:ring-2
                              focus:ring-neutral-200
                            "
                          />

                        </div>

                      </div>

                    </section>

                    {/* COLLABORATION SETTINGS */}

                    <section
                      className="
                        rounded-xl
                        border
                        border-neutral-200
                        p-5
                      "
                    >

                      <h3 className="text-sm font-semibold">
                        Collaboration Settings
                      </h3>

                      <div
                        className="
                          mt-5
                          grid
                          grid-cols-1
                          gap-5
                          sm:grid-cols-2
                        "
                      >

                        {/* TYPE */}

                        <div>

                          <label
                            htmlFor="creator-collaboration-type"
                            className="mb-2 block text-sm font-medium"
                          >
                            Collaboration Type
                          </label>

                          <select
                            id="creator-collaboration-type"
                            value={
                              creatorForm.collaboration_type
                            }
                            onChange={(event) =>
                              updateCreatorField(
                                "collaboration_type",
                                event.target
                                  .value as CreatorForm["collaboration_type"]
                              )
                            }
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-neutral-200
                              bg-white
                              px-3
                              text-sm
                              capitalize
                              outline-none
                              transition
                              focus:border-neutral-400
                              focus:ring-2
                              focus:ring-neutral-200
                            "
                          >

                            <option value="gifted">
                              Gifted
                            </option>

                            <option value="affiliate">
                              Affiliate
                            </option>

                            <option value="paid">
                              Paid
                            </option>

                            <option value="ugc">
                              UGC
                            </option>

                          </select>

                        </div>

                        {/* STATUS */}

                        <div>

                          <label
                            htmlFor="creator-status"
                            className="mb-2 block text-sm font-medium"
                          >
                            Creator Status
                          </label>

                          <select
                            id="creator-status"
                            value={
                              creatorForm.status
                            }
                            onChange={(event) =>
                              updateCreatorField(
                                "status",
                                event.target
                                  .value as CreatorForm["status"]
                              )
                            }
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-neutral-200
                              bg-white
                              px-3
                              text-sm
                              capitalize
                              outline-none
                              transition
                              focus:border-neutral-400
                              focus:ring-2
                              focus:ring-neutral-200
                            "
                          >

                            <option value="active">
                              Active
                            </option>

                            <option value="inactive">
                              Inactive
                            </option>

                            <option value="blacklisted">
                              Blacklisted
                            </option>

                          </select>

                        </div>

                        {/* AFFILIATE CODE */}

                        <div>

                          <label
                            htmlFor="creator-affiliate-code"
                            className="mb-2 block text-sm font-medium"
                          >
                            Affiliate Code
                          </label>

                          <input
                            id="creator-affiliate-code"
                            type="text"
                            value={
                              creatorForm.affiliate_code
                            }
                            onChange={(event) =>
                              updateCreatorField(
                                "affiliate_code",
                                event.target.value
                              )
                            }
                            placeholder="e.g. TNMPRIYA10"
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-neutral-200
                              bg-white
                              px-3
                              text-sm
                              uppercase
                              outline-none
                              transition
                              focus:border-neutral-400
                              focus:ring-2
                              focus:ring-neutral-200
                            "
                          />

                        </div>

                        {/* PORTFOLIO */}

                        <div>

                          <label
                            htmlFor="creator-portfolio"
                            className="mb-2 block text-sm font-medium"
                          >
                            Portfolio URL
                          </label>

                          <input
                            id="creator-portfolio"
                            type="url"
                            value={
                              creatorForm.portfolio_url
                            }
                            onChange={(event) =>
                              updateCreatorField(
                                "portfolio_url",
                                event.target.value
                              )
                            }
                            placeholder="Optional"
                            className="
                              h-11
                              w-full
                              rounded-xl
                              border
                              border-neutral-200
                              bg-white
                              px-3
                              text-sm
                              outline-none
                              transition
                              focus:border-neutral-400
                              focus:ring-2
                              focus:ring-neutral-200
                            "
                          />

                        </div>

                      </div>

                    </section>

                    {/* ADMIN NOTES */}

                    <section
                      className="
                        rounded-xl
                        border
                        border-neutral-200
                        p-5
                      "
                    >

                      <h3 className="text-sm font-semibold">
                        Admin Notes
                      </h3>

                      <textarea
                        value={
                          creatorForm.admin_notes
                        }
                        onChange={(event) =>
                          updateCreatorField(
                            "admin_notes",
                            event.target.value
                          )
                        }
                        placeholder="Add internal notes about this creator..."
                        rows={5}
                        className="
                          mt-4
                          w-full
                          resize-none
                          rounded-xl
                          border
                          border-neutral-200
                          bg-white
                          px-4
                          py-3
                          text-sm
                          outline-none
                          transition
                          placeholder:text-neutral-400
                          focus:border-neutral-400
                          focus:ring-2
                          focus:ring-neutral-200
                        "
                      />

                    </section>

                    {/* EDIT ACTIONS */}

                    <div
                      className="
                        flex
                        flex-col-reverse
                        gap-3
                        border-t
                        pt-5
                        sm:flex-row
                        sm:justify-end
                      "
                    >

                      <button
                        type="button"
                        onClick={
                          handleCancelCreatorEdit
                        }
                        disabled={
                          updateCreator.isPending
                        }
                        className="
                          rounded-xl
                          border
                          border-neutral-200
                          bg-white
                          px-5
                          py-2.5
                          text-sm
                          font-medium
                          text-neutral-700
                          transition
                          hover:bg-neutral-50
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleSaveCreator
                        }
                        disabled={
                          updateCreator.isPending
                        }
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-neutral-900
                          px-5
                          py-2.5
                          text-sm
                          font-medium
                          text-white
                          transition
                          hover:bg-neutral-800
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >

                        {updateCreator.isPending ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Save size={16} />
                        )}

                        {updateCreator.isPending
                          ? "Saving..."
                          : "Save Changes"}

                      </button>

                    </div>
                  </>
                ) : (
                  <>
                    {/* =================================================
                        VIEW MODE
                    ================================================== */}

                    {/* PROFILE */}

                    <section
                      className="
                        rounded-xl
                        border
                        border-neutral-200
                        p-5
                      "
                    >

                      <h3 className="text-sm font-semibold">
                        Creator Profile
                      </h3>

                      <div
                        className="
                          mt-4
                          grid
                          grid-cols-1
                          gap-5
                          sm:grid-cols-2
                        "
                      >

                        <div>

                          <p className="text-xs text-neutral-500">
                            Full Name
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {
                              selectedCreator.full_name
                            }
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-neutral-500">
                            Email
                          </p>

                          <p className="mt-1 break-all text-sm font-medium">
                            {
                              selectedCreator.email
                            }
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-neutral-500">
                            Phone
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {
                              selectedCreator.phone ||
                              "—"
                            }
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-neutral-500">
                            Collaboration Type
                          </p>

                          <p className="mt-1 text-sm font-medium capitalize">
                            {
                              selectedCreator.collaboration_type
                            }
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-neutral-500">
                            Content Category
                          </p>

                          <p className="mt-1 text-sm font-medium capitalize">
                            {
                              selectedCreator.content_category ||
                              "—"
                            }
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-neutral-500">
                            Status
                          </p>

                          <span
                            className={`
                              mt-1
                              inline-flex
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-xs
                              font-medium
                              ${getStatusClasses(
                                selectedCreator.status
                              )}
                            `}
                          >
                            {getStatusLabel(
                              selectedCreator.status
                            )}
                          </span>

                        </div>

                      </div>

                    </section>

                    {/* SOCIAL */}

                    <section
                      className="
                        rounded-xl
                        border
                        border-neutral-200
                        p-5
                      "
                    >

                      <h3 className="text-sm font-semibold">
                        Social Profiles
                      </h3>

                      <div className="mt-4 space-y-3">

                        {selectedCreator.instagram_url && (
                          <a
                            href={
                              selectedCreator.instagram_url
                            }
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

                            <div>

                              <p className="text-xs text-neutral-500">
                                Instagram
                              </p>

                              <p className="mt-1 text-sm font-medium">
                                @
                                {
                                  selectedCreator.instagram_username
                                }
                              </p>

                            </div>

                            <ExternalLink
                              size={17}
                              className="text-neutral-500"
                            />

                          </a>
                        )}

                        {selectedCreator.youtube_url && (
                          <a
                            href={
                              selectedCreator.youtube_url
                            }
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
                              YouTube
                            </span>

                            <ExternalLink
                              size={17}
                            />

                          </a>
                        )}

                        {selectedCreator.other_social_url && (
                          <a
                            href={
                              selectedCreator.other_social_url
                            }
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
                              Other Social Profile
                            </span>

                            <ExternalLink
                              size={17}
                            />

                          </a>
                        )}

                        {!selectedCreator.instagram_url &&
                          !selectedCreator.youtube_url &&
                          !selectedCreator.other_social_url && (
                            <p className="text-sm text-neutral-500">
                              No social profile links
                              available.
                            </p>
                          )}

                      </div>

                    </section>

                    {/* PERFORMANCE */}

                    <section>

                      <h3 className="mb-3 text-sm font-semibold">
                        Creator Performance
                      </h3>

                      <div
                        className="
                          grid
                          grid-cols-1
                          gap-4
                          sm:grid-cols-2
                          lg:grid-cols-4
                        "
                      >

                        <div className="rounded-xl border p-5">

                          <p className="text-xs text-neutral-500">
                            Followers
                          </p>

                          <p className="mt-2 text-xl font-semibold">
                            {formatNumber(
                              selectedCreator.follower_count
                            )}
                          </p>

                        </div>

                        <div className="rounded-xl border p-5">

                          <p className="text-xs text-neutral-500">
                            Reel Views
                          </p>

                          <p className="mt-2 text-xl font-semibold">
                            {formatNumber(
                              selectedCreator.average_reel_views
                            )}
                          </p>

                        </div>

                        <div className="rounded-xl border p-5">

                          <p className="text-xs text-neutral-500">
                            Collaborations
                          </p>

                          <p className="mt-2 text-xl font-semibold">
                            {
                              selectedCreator.total_collaborations
                            }
                          </p>

                        </div>

                        <div className="rounded-xl border p-5">

                          <p className="text-xs text-neutral-500">
                            Deliverables
                          </p>

                          <p className="mt-2 text-xl font-semibold">
                            {
                              selectedCreator.total_deliverables
                            }
                          </p>

                        </div>

                      </div>

                    </section>

                    {/* =================================================
                        COLLABORATION HISTORY
                    ================================================== */}

                    <CollaborationHistory
                      collaborations={
                        collaborations
                      }
                      isLoading={
                        isLoadingCollaborations
                      }
                      onCreate={() => {
                        setIsNewCollaborationOpen(true);
                      }}
                    />

                    {/* BUSINESS PERFORMANCE */}

                    <section>

                      <h3 className="mb-3 text-sm font-semibold">
                        Business Performance
                      </h3>

                      <div
                        className="
                          grid
                          grid-cols-1
                          gap-4
                          sm:grid-cols-3
                        "
                      >

                        <div className="rounded-xl border p-5">

                          <p className="text-xs text-neutral-500">
                            Orders
                          </p>

                          <p className="mt-2 text-xl font-semibold">
                            {
                              selectedCreator.total_orders
                            }
                          </p>

                        </div>

                        <div className="rounded-xl border p-5">

                          <p className="text-xs text-neutral-500">
                            Revenue
                          </p>

                          <p className="mt-2 text-xl font-semibold">
                            {formatCurrency(
                              selectedCreator.total_revenue
                            )}
                          </p>

                        </div>

                        <div className="rounded-xl border p-5">

                          <p className="text-xs text-neutral-500">
                            Affiliate Code
                          </p>

                          <p className="mt-2 text-sm font-semibold">
                            {
                              selectedCreator.affiliate_code ||
                              "Not assigned"
                            }
                          </p>

                        </div>

                      </div>

                    </section>

                    {/* DATES */}

                    <section
                      className="
                        rounded-xl
                        border
                        border-neutral-200
                        bg-neutral-50
                        p-5
                      "
                    >

                      <div
                        className="
                          grid
                          grid-cols-1
                          gap-5
                          sm:grid-cols-2
                        "
                      >

                        <div>

                          <p className="text-xs text-neutral-500">
                            Approved At
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {formatDate(
                              selectedCreator.approved_at
                            )}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-neutral-500">
                            Last Collaboration
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {formatDate(
                              selectedCreator.last_collaboration_at
                            )}
                          </p>

                        </div>

                      </div>

                    </section>

                    {/* ADMIN NOTES */}

                    {selectedCreator.admin_notes && (
                      <section>

                        <h3 className="mb-3 text-sm font-semibold">
                          Admin Notes
                        </h3>

                        <div
                          className="
                            rounded-xl
                            border
                            border-amber-200
                            bg-amber-50
                            p-5
                          "
                        >

                          <p
                            className="
                              whitespace-pre-wrap
                              text-sm
                              leading-6
                              text-neutral-700
                            "
                          >
                            {
                              selectedCreator.admin_notes
                            }
                          </p>

                        </div>

                      </section>
                    )}

                  </>
                )}

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          NEW COLLABORATION MODAL
      ====================================================== */}

      {selectedCreator && (
        <NewCollaborationModal
          creator={selectedCreator}
          open={isNewCollaborationOpen}
          onClose={() => {
            setIsNewCollaborationOpen(false);
          }}
        />
      )}

      {/* =====================================================
          CONFIRMATION MODAL
      ====================================================== */}

      {pendingAction &&
        selectedCollaborator && (
          <div
            className="
              fixed
              inset-0
              z-[10000]
              flex
              items-center
              justify-center
              bg-black/60
              p-4
            "
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setPendingAction(null);
              }
            }}
          >

            <div
              className="
                w-full
                max-w-md
                rounded-2xl
                bg-white
                p-6
                shadow-2xl
              "
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
            >

              {/* ICON */}

              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  ${
                    pendingAction ===
                    "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                `}
              >

                {pendingAction ===
                "approved" ? (
                  <Check size={22} />
                ) : (
                  <XCircle size={22} />
                )}

              </div>

              {/* CONTENT */}

              <div className="mt-5">

                <h3
                  className="
                    text-lg
                    font-semibold
                    text-neutral-900
                  "
                >
                  {pendingAction ===
                  "approved"
                    ? "Approve collaborator?"
                    : "Reject collaborator?"}
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-neutral-600
                  "
                >
                  {pendingAction ===
                  "approved"
                    ? `Are you sure you want to approve ${selectedCollaborator.full_name} as a collaborator?`
                    : `Are you sure you want to reject ${selectedCollaborator.full_name}'s collaboration application?`}
                </p>

                {adminNotes.trim() && (
                  <div
                    className="
                      mt-4
                      rounded-xl
                      border
                      border-neutral-200
                      bg-neutral-50
                      p-3
                    "
                  >

                    <p
                      className="
                        text-xs
                        font-medium
                        text-neutral-500
                      "
                    >
                      These admin notes will also
                      be saved:
                    </p>

                    <p
                      className="
                        mt-1
                        whitespace-pre-wrap
                        text-sm
                        text-neutral-700
                      "
                    >
                      {adminNotes.trim()}
                    </p>

                  </div>
                )}

              </div>

              {/* BUTTONS */}

              <div
                className="
                  mt-6
                  flex
                  flex-col-reverse
                  gap-3
                  sm:flex-row
                  sm:justify-end
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setPendingAction(null)
                  }
                  disabled={
                    updateCollaboratorStatus.isPending
                  }
                  className="
                    rounded-xl
                    border
                    border-neutral-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-neutral-700
                    transition
                    hover:bg-neutral-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    confirmStatusChange
                  }
                  disabled={
                    updateCollaboratorStatus.isPending
                  }
                  className={`
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    ${
                      pendingAction ===
                      "approved"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }
                  `}
                >

                  {updateCollaboratorStatus.isPending && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {pendingAction ===
                  "approved"
                    ? "Yes, Approve"
                    : "Yes, Reject"}

                </button>

              </div>

            </div>

          </div>
        )}

    </>
  );
}