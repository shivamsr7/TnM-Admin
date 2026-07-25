import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Search } from "lucide-react";

import { useCollections } from "../hooks/useCollections";
import { useFeaturedCollections } from "../hooks/useFeaturedCollections";
import { useUpdateFeaturedCollection } from "../hooks/useUpdateFeaturedCollection";

import type { FeaturedCollection } from "../types/featuredCollection.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featuredCollection: FeaturedCollection;
}

export default function EditFeaturedCollectionDialog({
  open,
  onOpenChange,
  featuredCollection,
}: Props) {
  const collections = useCollections();
  const featuredCollections = useFeaturedCollections();

  const updateMutation =
    useUpdateFeaturedCollection();

  const [selected, setSelected] =
    useState<string>();

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    if (open) {
      setSelected(featuredCollection.collection_id);
      setSearch("");
    }
  }, [open, featuredCollection]);

  const availableCollections = useMemo(() => {
    if (!collections.data) return [];

    const featuredIds = new Set(
      featuredCollections.data
        ?.filter(
          (item) =>
            item.id !== featuredCollection.id
        )
        .map((item) => item.collection_id) ?? []
    );

    return collections.data.filter(
      (collection) => {
        const matchesSearch =
          collection.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          collection.slug
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        return (
          !featuredIds.has(
            collection.id
          ) && matchesSearch
        );
      }
    );
  }, [
    collections.data,
    featuredCollections.data,
    featuredCollection.id,
    search,
  ]);

  function handleUpdate() {
    if (!selected) {
      toast.error(
        "Please select a collection."
      );
      return;
    }

    updateMutation.mutate(
      {
        id: featuredCollection.id,
        values: {
          collection_id: selected,
          display_order:
            featuredCollection.display_order,
          is_active:
            featuredCollection.is_active,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Edit Featured Collection
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search collections..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="pl-9"
          />
        </div>

        <div className="mt-4 max-h-[420px] overflow-y-auto pr-1">
          {availableCollections.length ===
          0 ? (
            <div className="flex h-52 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
              No collections available.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableCollections.map(
                (collection) => (
                  <button
                    key={collection.id}
                    type="button"
                    onClick={() =>
                      setSelected(
                        collection.id
                      )
                    }
                    className={`group rounded-xl border bg-background p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md ${
                      selected ===
                      collection.id
                        ? "border-primary ring-2 ring-primary/20"
                        : ""
                    }`}
                  >
                    <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                      <img
                        src={
                          collection.thumbnail_image ||
                          collection.banner_image ||
                          "https://placehold.co/400x400"
                        }
                        alt={
                          collection.name
                        }
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-3">
                      <h4 className="truncate font-medium">
                        {
                          collection.name
                        }
                      </h4>

                      <p className="truncate text-xs text-muted-foreground">
                        {
                          collection.slug
                        }
                      </p>
                    </div>

                    {selected ===
                      collection.id && (
                      <div className="mt-3 rounded-md bg-primary py-1 text-center text-xs font-medium text-primary-foreground">
                        Selected
                      </div>
                    )}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t pt-4">
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            onClick={handleUpdate}
            disabled={
              !selected ||
              updateMutation.isPending
            }
          >
            {updateMutation.isPending
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}