import { useState } from "react";

import PageHeader from "@/components/shared/PageHeader";

import SectionListCard from "../components/SectionListCard";
import EditSectionDialog from "../dialogs/EditSectionDialog";
import { useHomepageSections } from "../hooks/useHomepageSections";
import type { HomepageSection } from "../types/section.types";

export default function HomepageSectionsPage() {
  const { data = [], isLoading } = useHomepageSections();

  const [selectedSection, setSelectedSection] =
    useState<HomepageSection | null>(null);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const handleEdit = (section: HomepageSection) => {
    setSelectedSection(section);
    setDialogOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Homepage Sections"
        subtitle="Manage visibility and content of homepage sections."
      />

      <SectionListCard
        sections={data}
        loading={isLoading}
        onEdit={handleEdit}
      />

      <EditSectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        section={selectedSection}
      />
    </>
  );
}