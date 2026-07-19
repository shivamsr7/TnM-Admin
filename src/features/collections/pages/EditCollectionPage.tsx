
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";

import CollectionForm from "../components/CollectionForm";
import { useCollection } from "../hooks/useCollections";

export default function EditCollectionPage() {
  const { id } = useParams();
const navigate = useNavigate();
  const {
    data: collection,
    isLoading,
    isError,
  } = useCollection(id ?? "");

  if (isLoading) {
    return <LoadingSpinner text="Loading collection..." />;
  }

if (isError || !collection) {
  return (
    <EmptyState
      title="Collection not found"
      description="The requested collection does not exist."
      actionLabel="Back to Collections"
      onAction={() => navigate("/collections")}
    />
  );
}

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Collection"
        subtitle="Update collection information."
        action={
          <Button asChild variant="outline">
            <Link to="/collections">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <CollectionForm collection={collection} />
    </div>
  );
}