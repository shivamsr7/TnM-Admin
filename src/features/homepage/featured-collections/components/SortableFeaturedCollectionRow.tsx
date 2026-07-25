import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { FeaturedCollection } from "../types/featuredCollection.types";
import FeaturedCollectionRow from "./FeaturedCollectionRow";

interface Props {
  collection: FeaturedCollection;
}

export default function SortableFeaturedCollectionRow({
  collection,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: collection.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <FeaturedCollectionRow
      ref={setNodeRef}
      style={style}
      dragHandleProps={{
        ...attributes,
        ...listeners,
      }}
      collection={collection}
    />
  );
}