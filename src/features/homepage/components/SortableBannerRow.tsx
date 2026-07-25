import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";

import BannerRow from "./BannerRow";
import type { HomepageBanner } from "../types/homepage.types";

interface SortableBannerRowProps {
  banner: HomepageBanner;
}

export default function SortableBannerRow({
  banner,
}: SortableBannerRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: banner.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
    >
      <BannerRow
        banner={banner}
        dragHandle={
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing rounded p-1 hover:bg-muted"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        }
      />
    </tr>
  );
}