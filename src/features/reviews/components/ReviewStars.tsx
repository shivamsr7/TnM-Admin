import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewStarsProps {
  rating: number;
  size?: number;
  showValue?: boolean;
}

export default function ReviewStars({
  rating,
  size = 16,
  showValue = false,
}: ReviewStarsProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={cn(
              "stroke-[1.8]",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        ))}
      </div>

      {showValue && (
        <span className="ml-1 text-sm font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}