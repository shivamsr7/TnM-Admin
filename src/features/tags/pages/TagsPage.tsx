import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";
import EmptyState from "@/components/shared/EmptyState";

import { useTags } from "../hooks/useTags";
import TagsTable from "../components/TagsTable";

export default function TagsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const {
    data: tags = [],
    isLoading,
  } = useTags();

  const filteredTags = useMemo(() => {
    const keyword = search.toLowerCase();

    return tags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(keyword) ||
        tag.slug.toLowerCase().includes(keyword)
    );
  }, [tags, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tags"
        subtitle="Manage product tags."
        action={
          <Button
            onClick={() => navigate("/tags/add")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Tag
          </Button>
        }
      />

      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tags..."
      />
            {isLoading ? (
        <p className="text-center py-10 text-gray-500">
          Loading tags...
        </p>
      ) : filteredTags.length === 0 ? (
        <EmptyState
          title="No Tags Found"
          description={
            search
              ? "No tags match your search."
              : "Create your first tag to get started."
          }
          actionLabel="Add Tag"
          onAction={() => navigate("/tags/add")}
        />
      ) : (
        <TagsTable
          tags={filteredTags}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}