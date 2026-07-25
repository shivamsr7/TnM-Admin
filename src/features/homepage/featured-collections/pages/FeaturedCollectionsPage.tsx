import { useState } from "react";
import { Plus } from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

import FeaturedCollectionsCard from "../components/FeaturedCollectionsCard";
import AddFeaturedCollectionDialog from "../dialogs/AddFeaturedCollectionDialog";

export default function FeaturedCollectionsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Featured Collections"
        subtitle="Manage collections displayed on the homepage."
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Collection
          </Button>
        }
      />

      <FeaturedCollectionsCard />

      <AddFeaturedCollectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}