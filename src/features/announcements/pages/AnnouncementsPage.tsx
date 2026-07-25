import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import DeleteDialog from "@/shared/components/dialogs/DeleteDialog";
import { toast } from "sonner";

import AnnouncementTable from "../components/AnnouncementTable";
// We'll create this next
import AnnouncementDialog from "../dialogs/AnnouncementDialog";

import type { Announcement } from "../types/announcements.types";

import {
  useAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
  useToggleAnnouncementStatus,
} from "../hooks/useAnnouncements";

export default function AnnouncementsPage() {
  const { data = [], isLoading, isError } = useAnnouncements();

  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const toggleAnnouncement = useToggleAnnouncementStatus();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] =
    useState<Announcement | null>(null);

  const handleAdd = () => {
    setSelectedAnnouncement(null);
    setDialogOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setDialogOpen(true);
  };

  const handleDelete = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteOpen(true);
  };

  const handleToggleStatus = async (
    announcement: Announcement
  ) => {
    try {
      await toggleAnnouncement.mutateAsync({
        id: announcement.id,
        is_active: !announcement.is_active,
      });

      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading announcements...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-12 text-center">
        Failed to load announcements.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        subtitle="Manage the announcement bar shown on the storefront."
        action={
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Announcement
          </Button>
        }
      />

      <AnnouncementTable
        announcements={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <AnnouncementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        announcement={selectedAnnouncement}
        onSubmit={async (values) => {
          try {
            if (selectedAnnouncement) {
              await updateAnnouncement.mutateAsync({
  id: selectedAnnouncement.id,
  data: values,
});

              toast.success(
                "Announcement updated successfully."
              );
            } else {
              await createAnnouncement.mutateAsync(values);

              toast.success(
                "Announcement created successfully."
              );
            }

            setDialogOpen(false);
          } catch {
            toast.error("Something went wrong.");
          }
        }}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Announcement"
        description={`Are you sure you want to delete "${announcementToDelete?.message}"? This action cannot be undone.`}
        isLoading={deleteAnnouncement.isPending}
        onConfirm={async () => {
          if (!announcementToDelete) return;

          try {
            await deleteAnnouncement.mutateAsync(
              announcementToDelete.id
            );

            toast.success(
              "Announcement deleted successfully."
            );

            setDeleteOpen(false);
          } catch {
            toast.error("Failed to delete announcement.");
          }
        }}
      />
    </div>
  );
}