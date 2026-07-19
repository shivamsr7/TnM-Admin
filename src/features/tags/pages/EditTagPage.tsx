import { useParams } from "react-router-dom";

import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";

import TagForm from "../components/TagForm";
import { useTag } from "../hooks/useTags";

export default function EditTagPage() {
  const { id } = useParams();

  const {
    data: tag,
    isLoading,
  } = useTag(id ?? "");

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        Loading...
      </div>
    );
  }

  if (!tag) {
    return (
      <EmptyState
        title="Tag Not Found"
        description="The requested tag does not exist."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Tag"
        subtitle="Update tag details."
      />

      <TagForm tag={tag} />
    </div>
  );
}