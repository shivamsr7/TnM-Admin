import PageHeader from "@/components/shared/PageHeader";
import TagForm from "../components/TagForm";

export default function AddTagPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Tag"
        subtitle="Create a new product tag."
      />

      <TagForm />
    </div>
  );
}