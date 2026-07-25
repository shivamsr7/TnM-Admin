import { useEffect, useState } from "react";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useFeaturedCollections } from "../hooks/useFeaturedCollections";
import { useReorderFeaturedCollections } from "../hooks/useReorderFeaturedCollections";

import SortableFeaturedCollectionRow from "./SortableFeaturedCollectionRow";

export default function FeaturedCollectionsTable() {
  const query = useFeaturedCollections();

  const reorderMutation =
    useReorderFeaturedCollections();

  const [collections, setCollections] =
    useState(query.data ?? []);

  useEffect(() => {
    if (query.data) {
      setCollections(query.data);
    }
  }, [query.data]);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  function handleDragEnd(
    event: DragEndEvent
  ) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = collections.findIndex(
      (item) => item.id === active.id
    );

    const newIndex = collections.findIndex(
      (item) => item.id === over.id
    );

    const newItems = arrayMove(
      collections,
      oldIndex,
      newIndex
    );

    setCollections(newItems);

    reorderMutation.mutate(
      newItems.map((item) => item.id)
    );
  }

  if (query.isLoading) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Loading featured collections...
      </div>
    );
  }

  if (!collections.length) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        No featured collections found.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={collections.map(
          (item) => item.id
        )}
        strategy={
          verticalListSortingStrategy
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>
                Collection
              </TableHead>
              <TableHead>
                Status
              </TableHead>
              <TableHead>
                Order
              </TableHead>
              <TableHead className="w-[120px] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {collections.map(
              (collection) => (
                <SortableFeaturedCollectionRow
                  key={collection.id}
                  collection={collection}
                />
              )
            )}
          </TableBody>
        </Table>
      </SortableContext>
    </DndContext>
  );
}