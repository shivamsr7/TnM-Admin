import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import SectionForm from "../forms/SectionForm";
import { useUpdateSection } from "../hooks/useUpdateSection";
import type {
  HomepageSection,
  HomepageSectionFormValues,
} from "../types/section.types";

interface EditSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: HomepageSection | null;
}

export default function EditSectionDialog({
  open,
  onOpenChange,
  section,
}: EditSectionDialogProps) {
  const updateSection = useUpdateSection();

  if (!section) return null;

  const handleSubmit = (
    values: HomepageSectionFormValues
  ) => {
    updateSection.mutate(
      {
        id: section.id,
        values,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit {section.title ?? section.section_key}
          </DialogTitle>
        </DialogHeader>

        <SectionForm
          section={section}
          isSubmitting={updateSection.isPending}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}