import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { InstagramCustomerReview } from "../types/instagramCustomerReview.types";

interface Props {
  review: InstagramCustomerReview | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InstagramReviewPreviewDialog({
  review,
  open,
  onOpenChange,
}: Props) {
  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Instagram Review Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl bg-black">
            <img
              src={review.screenshot_url}
              alt={`Instagram review from ${review.customer_name}`}
              className="mx-auto max-h-[70vh] w-full object-contain"
            />
          </div>

          <div>
            <p className="font-medium">{review.customer_name}</p>
            {review.instagram_username && (
              <p className="text-sm text-muted-foreground">
                {review.instagram_username}
              </p>
            )}
          </div>

          {review.review_text && (
            <p className="rounded-xl bg-muted p-4 text-sm leading-6">
              {review.review_text}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
