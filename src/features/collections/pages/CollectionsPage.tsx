import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";

import CollectionsTable from "../components/CollectionsTable";
import { useCollections } from "../hooks/useCollections";

export default function CollectionsPage() {
  const [search, setSearch] = useState("");

  const {
    data: collections = [],
    isLoading,
  } = useCollections();

  const filteredCollections = useMemo(() => {
    if (!search.trim()) return collections;

    const keyword = search.toLowerCase();

    return collections.filter(
      (collection) =>
        collection.name.toLowerCase().includes(keyword) ||
        collection.slug.toLowerCase().includes(keyword)
    );
  }, [collections, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Collections"
        subtitle="Manage your jewelry collections."
        action={
          <Button asChild>
            <Link to="/collections/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Collection
            </Link>
          </Button>
        }
      />

      <SearchBar
        placeholder="Search collections..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <CollectionsTable
        collections={filteredCollections}
        isLoading={isLoading}
      />
    </div>
  );
}