import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import CollectionForm from "../components/CollectionForm";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function AddCollectionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Collection"
        subtitle="Create a new jewelry collection."
        action={
          <Button asChild variant="outline">
            <Link to="/collections">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <CollectionForm />
    </div>
  );
}