import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReorderBanners } from "../hooks/useReorderBanners";
import { useHomepage } from "../hooks/useHomepage";
import BannerRow from "./BannerRow";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { useState, useEffect } from "react";
export default function BannerTable() {
  const { bannersQuery } = useHomepage();
  const reorderMutation = useReorderBanners();
const [banners, setBanners] = useState(
  bannersQuery.data ?? []
);

useEffect(() => {
  if (bannersQuery.data) {
    setBanners(bannersQuery.data);
  }
}, [bannersQuery.data]);
  if (bannersQuery.isLoading) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Loading banners...
      </div>
    );
  }

  if (!bannersQuery.data?.length) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        No banners found.
      </div>
    );
  }
function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const oldIndex = banners.findIndex(
    (b) => b.id === active.id
  );

  const newIndex = banners.findIndex(
    (b) => b.id === over.id
  );

  const reordered = arrayMove(
    banners,
    oldIndex,
    newIndex
  ).map((banner, index) => ({
    ...banner,
    display_order: index + 1,
  }));

  setBanners(reordered);

  reorderMutation.mutate(
    reordered.map((banner) => ({
      id: banner.id,
      display_order: banner.display_order,
    }))
  );
}
  return (
    <Table>
      <TableHeader>
        <TableRow>
  <TableHead className="w-12"></TableHead>
  <TableHead>Banner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Order</TableHead>
          <TableHead className="w-[120px] text-right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <DndContext
  collisionDetection={closestCenter}
  onDragEnd={
    reorderMutation.isPending
      ? undefined
      : handleDragEnd
  }
>
  <SortableContext
    items={banners.map((b) => b.id)}
    strategy={verticalListSortingStrategy}
  >
    <TableBody>
      {banners.map((banner) => (
        <BannerRow
          key={banner.id}
          banner={banner}
        />
      ))}
    </TableBody>
  </SortableContext>
</DndContext>
    </Table>
  );
}