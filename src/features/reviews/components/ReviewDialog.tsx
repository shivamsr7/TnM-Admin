import {
  Calendar,
  MessageSquare,
  ShoppingBag,
  User,
  BadgeCheck,
  Trash2,
  Image as ImageIcon,
  Video,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import ReviewConfirmDialog from "./ReviewConfirmDialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Button,
} from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  Review,
} from "../types/review.types";

import type {
  ReviewMedia,
} from "../types/reviewMedia.types";

import ReviewStars from "./ReviewStars";
import ReviewStatusBadge from "./ReviewStatusBadge";

import {
  reviewMediaService,
} from "../services/reviewMedia.service";


/*
 * =========================================================
 * TYPES
 * =========================================================
 */

type RewardType =
  | "text"
  | "image"
  | "video";


interface ReviewWalletRewardSettings {
  enabled: boolean;
  textReward: number;
  imageReward: number;
  videoReward: number;
}

interface ReviewDialogProps {

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  review: Review | null;

  isLoading: boolean;

  rewardSettings: ReviewWalletRewardSettings | null;

  onApprove: (
    id: string,
    rewardType: RewardType
  ) => void;

  onReject: (
    id: string
  ) => void;

  onDelete: (
    id: string
  ) => void;
}


/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function ReviewDialog({
  open,
  onOpenChange,
  review,
  isLoading,
  rewardSettings,
  onApprove,
  onReject,
  onDelete,
}: ReviewDialogProps) {


  /*
   * =======================================================
   * ACTION CONFIRMATION STATE
   * =======================================================
   */

  const [
    confirmOpen,
    setConfirmOpen,
  ] = useState(false);


  const [
    action,
    setAction,
  ] = useState<
    "approved" | "rejected" | "delete" | null
  >(null);


  /*
   * =======================================================
   * REWARD TYPE
   * =======================================================
   */

  const [
    rewardType,
    setRewardType,
  ] = useState<RewardType>("text");


  /*
   * =======================================================
   * MEDIA PREVIEW STATE
   * =======================================================
   */

  const [
    previewMedia,
    setPreviewMedia,
  ] = useState<ReviewMedia | null>(null);


  const [
    previewIndex,
    setPreviewIndex,
  ] = useState(0);


  /*
   * =======================================================
   * MEDIA DELETE STATE
   * =======================================================
   */

  const [
    mediaToDelete,
    setMediaToDelete,
  ] = useState<ReviewMedia | null>(null);


  const [
    isDeletingMedia,
    setIsDeletingMedia,
  ] = useState(false);


  /*
   * =======================================================
   * QUERY CLIENT
   * =======================================================
   */

  const queryClient =
    useQueryClient();


  /*
   * =======================================================
   * REVIEW MEDIA QUERY
   * =======================================================
   *
   * Hooks intentionally stay above the early return below.
   *
   * This avoids React Hooks ordering issues when the dialog
   * changes between review and null states.
   * =======================================================
   */

  const {
    data: media = [],
    isLoading: isMediaLoading,
  } = useQuery({

    queryKey: [
      "admin-review-media",
      review?.id,
    ],

    queryFn: () =>
      reviewMediaService.getByReviewId(
        review!.id
      ),

    enabled:
      Boolean(
        open &&
        review?.id
      ),

  });


  /*
   * =======================================================
   * AUTO SELECT REWARD TYPE
   * =======================================================
   *
   * The reward type is selected from the media attached
   * to the review. The actual reward amount is always read
   * server-side from the admin reward settings.
   *
   * If both image and video exist, video gets priority.
   * =======================================================
   */

  useEffect(() => {

    if (!media.length) {

      setRewardType(
        "text"
      );

      return;
    }


    const hasVideo =
      media.some(
        (item) =>
          item.media_type ===
          "video"
      );


    const hasImage =
      media.some(
        (item) =>
          item.media_type ===
          "image"
      );


    if (hasVideo) {

      setRewardType(
        "video"
      );

    } else if (hasImage) {

      setRewardType(
        "image"
      );

    } else {

      setRewardType(
        "text"
      );

    }

  }, [media]);


  /*
   * =======================================================
   * RESET PREVIEW WHEN REVIEW CHANGES
   * =======================================================
   */

  useEffect(() => {

    setPreviewMedia(null);

    setPreviewIndex(0);

  }, [review?.id]);


  /*
   * =======================================================
   * DON'T RENDER
   * =======================================================
   */

  if (!review) {

    return null;

  }


  /*
   * =======================================================
   * PRODUCT IMAGE
   * =======================================================
   */

  const image =
    review.product
      ?.product_images
      ?.find(
        (img) =>
          img.is_primary
      )
      ?.image_url ??

    review.product
      ?.product_images?.[0]
      ?.image_url ??

    "/placeholder.png";


  /*
   * =======================================================
   * OPEN MEDIA PREVIEW
   * =======================================================
   */

  const openMediaPreview = (
    item: ReviewMedia,
    index: number
  ) => {

    setPreviewMedia(
      item
    );

    setPreviewIndex(
      index
    );

  };


  /*
   * =======================================================
   * CLOSE MEDIA PREVIEW
   * =======================================================
   */

  const closeMediaPreview = () => {

    setPreviewMedia(
      null
    );

  };


  /*
   * =======================================================
   * PREVIOUS MEDIA
   * =======================================================
   */

  const showPreviousMedia = () => {

    if (!media.length) {
      return;
    }


    const newIndex =
      previewIndex === 0
        ? media.length - 1
        : previewIndex - 1;


    setPreviewIndex(
      newIndex
    );

    setPreviewMedia(
      media[newIndex]
    );

  };


  /*
   * =======================================================
   * NEXT MEDIA
   * =======================================================
   */

  const showNextMedia = () => {

    if (!media.length) {
      return;
    }


    const newIndex =
      previewIndex ===
      media.length - 1
        ? 0
        : previewIndex + 1;


    setPreviewIndex(
      newIndex
    );

    setPreviewMedia(
      media[newIndex]
    );

  };


  /*
   * =======================================================
   * DELETE MEDIA
   * =======================================================
   */

  const handleDeleteMedia =
    async () => {

      if (!mediaToDelete) {
        return;
      }


      try {

        setIsDeletingMedia(
          true
        );


        /*
         * Delete only this specific
         * photo/video.
         */

        await reviewMediaService.deleteById(
          mediaToDelete.id
        );


        /*
         * Refresh media list.
         */

        await queryClient.invalidateQueries({
          queryKey: [
            "admin-review-media",
            review.id,
          ],
        });


        /*
         * Close preview if the deleted
         * media was currently open.
         */

        if (
          previewMedia?.id ===
          mediaToDelete.id
        ) {

          setPreviewMedia(
            null
          );

          setPreviewIndex(
            0
          );

        }


        setMediaToDelete(
          null
        );

      } catch (error) {

        console.error(
          "Failed to delete review media:",
          error
        );

      } finally {

        setIsDeletingMedia(
          false
        );

      }

    };


  /*
   * =======================================================
   * REWARD DISPLAY
   * =======================================================
   */

  const rewardAmountRupees =
    rewardType === "video"
      ? (rewardSettings?.videoReward ?? 0)
      : rewardType === "image"
        ? (rewardSettings?.imageReward ?? 0)
        : (rewardSettings?.textReward ?? 0);

  const rewardLabel =
    rewardType === "video"
      ? `Video Review — ₹${rewardAmountRupees.toFixed(2)}`
      : rewardType === "image"
        ? `Image Review — ₹${rewardAmountRupees.toFixed(2)}`
        : `Text Review — ₹${rewardAmountRupees.toFixed(2)}`;

  const rewardsEnabled =
    rewardSettings?.enabled ?? false;


  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (

    <>

      {/* ===================================================
          MAIN REVIEW DIALOG
      ==================================================== */}

      <Dialog
        open={open}
        onOpenChange={
          onOpenChange
        }
      >

        <DialogContent
          className="
            max-h-[90vh]
            max-w-2xl
            overflow-y-auto
          "
        >

          <DialogHeader>

            <DialogTitle>
              Review Details
            </DialogTitle>

          </DialogHeader>


          <div className="space-y-6">


            {/* =================================================
                PRODUCT
            ================================================== */}

            <div className="flex gap-4">

              <img
                src={image}
                alt={
                  review.product?.name ??
                  "Product"
                }
                className="
                  h-24
                  w-24
                  shrink-0
                  rounded-xl
                  border
                  object-cover
                "
              />


              <div className="space-y-2">

                <div className="flex items-center gap-2">

                  <ShoppingBag
                    className="
                      h-4
                      w-4
                    "
                  />

                  <span className="font-semibold">

                    {
                      review.product
                        ?.name
                    }

                  </span>

                </div>


                <ReviewStars
                  rating={
                    review.rating
                  }
                />


                <ReviewStatusBadge
                  status={
                    review.status
                  }
                />


                {review.is_verified && (

                  <Badge
                    variant="secondary"
                    className="w-fit"
                  >

                    <BadgeCheck
                      className="
                        mr-1
                        h-3
                        w-3
                      "
                    />

                    Verified Purchase

                  </Badge>

                )}

              </div>

            </div>


            {/* =================================================
                CUSTOMER
            ================================================== */}

            <div className="grid gap-4">

              <div className="flex items-center gap-3">

                <User
                  className="
                    h-4
                    w-4
                    text-muted-foreground
                  "
                />

                <span>

                  {review.customer
                    ? `${review.customer.first_name} ${review.customer.last_name ?? ""}`.trim()
                    : "Guest Customer"}

                </span>

              </div>


              <div className="flex items-center gap-3">

                <Calendar
                  className="
                    h-4
                    w-4
                    text-muted-foreground
                  "
                />

                <span>

                  {new Date(
                    review.created_at
                  ).toLocaleString()}

                </span>

              </div>

            </div>


            {/* =================================================
                REVIEW
            ================================================== */}

            <div
              className="
                space-y-3
                rounded-xl
                border
                p-4
              "
            >

              <div className="flex items-center gap-2">

                <MessageSquare
                  className="
                    h-4
                    w-4
                  "
                />

                <span className="font-medium">
                  Customer Review
                </span>

              </div>


              {review.title && (

                <h3 className="font-semibold">
                  {review.title}
                </h3>

              )}


              <p
                className="
                  whitespace-pre-wrap
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                {review.review}
              </p>

            </div>


            {/* =================================================
                REVIEW WALLET REWARD
            ================================================== */}

            <div
              className="
                space-y-3
                rounded-xl
                border
                bg-muted/30
                p-4
              "
            >

              <div>

                <p className="font-medium">
                  Review Wallet Reward
                </p>

                <p
                  className="
                    text-xs
                    text-muted-foreground
                  "
                >
                  {rewardsEnabled
                    ? "Select the reward type before approving this review."
                    : "Wallet rewards for reviews are currently disabled in settings."}
                </p>

              </div>


              {rewardsEnabled ? (

                <>

                  <Select
                    value={rewardType}
                    onValueChange={(value) =>
                      setRewardType(
                        value as RewardType
                      )
                    }
                  >

                    <SelectTrigger
                      className="w-full"
                    >
                      <SelectValue />
                    </SelectTrigger>


                    <SelectContent>

                      <SelectItem value="text">
                        Text Review —{" "}
                        ₹{(rewardSettings?.textReward ?? 0).toFixed(2)}
                      </SelectItem>


                      <SelectItem value="image">
                        Image Review —{" "}
                        ₹{(rewardSettings?.imageReward ?? 0).toFixed(2)}
                      </SelectItem>


                      <SelectItem value="video">
                        Video Review —{" "}
                        ₹{(rewardSettings?.videoReward ?? 0).toFixed(2)}
                      </SelectItem>

                    </SelectContent>

                  </Select>


                  <div
                    className="
                      rounded-lg
                      border
                      bg-background
                      px-3
                      py-2
                      text-sm
                    "
                  >

                    Selected reward:

                    <span className="ml-1 font-semibold">
                      {rewardLabel}
                    </span>

                  </div>

                </>

              ) : (

                <div
                  className="
                    rounded-lg
                    border
                    border-dashed
                    bg-background
                    px-3
                    py-3
                    text-sm
                    text-muted-foreground
                  "
                >
                  No wallet reward will be credited when
                  this review is approved.
                </div>

              )}

            </div>


            {/* =================================================
                CUSTOMER MEDIA
            ================================================== */}

            <div
              className="
                space-y-4
                rounded-xl
                border
                p-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >

                <div>

                  <p className="font-medium">
                    Customer Media
                  </p>

                  <p
                    className="
                      text-xs
                      text-muted-foreground
                    "
                  >
                    Photos and videos uploaded
                    with this review.
                  </p>

                </div>


                {media.length > 0 && (

                  <Badge
                    variant="secondary"
                  >
                    {media.length}{" "}
                    {media.length === 1
                      ? "item"
                      : "items"}
                  </Badge>

                )}

              </div>


              {isMediaLoading ? (

                <div
                  className="
                    py-6
                    text-center
                    text-sm
                    text-muted-foreground
                  "
                >
                  Loading media...
                </div>

              ) : media.length === 0 ? (

                <div
                  className="
                    rounded-lg
                    border
                    border-dashed
                    p-6
                    text-center
                  "
                >

                  <p
                    className="
                      text-sm
                      text-muted-foreground
                    "
                  >
                    No photos or videos
                    uploaded.
                  </p>

                </div>

              ) : (

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-3
                    sm:grid-cols-3
                  "
                >

                  {media.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        key={
                          item.id
                        }
                        className="
                          group
                          relative
                          overflow-hidden
                          rounded-xl
                          border
                          bg-muted
                        "
                      >

                        {/* MEDIA */}

                        <button
                          type="button"
                          className="
                            block
                            w-full
                            cursor-pointer
                            text-left
                          "
                          onClick={() =>
                            openMediaPreview(
                              item,
                              index
                            )
                          }
                        >

                          {item.media_type ===
                          "video" ? (

                            <video
                              src={
                                item.media_url
                              }
                              muted
                              playsInline
                              preload="metadata"
                              className="
                                aspect-square
                                w-full
                                object-cover
                              "
                            />

                          ) : (

                            <img
                              src={
                                item.thumbnail_url ||
                                item.media_url
                              }
                              alt="Customer review media"
                              className="
                                aspect-square
                                w-full
                                object-cover
                              "
                            />

                          )}

                        </button>


                        {/* TYPE BADGE */}

                        <div
                          className="
                            absolute
                            left-2
                            top-2
                            pointer-events-none
                          "
                        >

                          <Badge
                            variant="secondary"
                            className="
                              gap-1
                              bg-black/70
                              text-white
                            "
                          >

                            {item.media_type ===
                            "video" ? (

                              <Video
                                className="
                                  h-3
                                  w-3
                                "
                              />

                            ) : (

                              <ImageIcon
                                className="
                                  h-3
                                  w-3
                                "
                              />

                            )}


                            {item.media_type ===
                            "video"
                              ? "Video"
                              : "Image"}

                          </Badge>

                        </div>


                        {/* DELETE BUTTON */}

                        <button
                          type="button"
                          disabled={
                            isDeletingMedia
                          }
                          onClick={(
                            event
                          ) => {

                            event.stopPropagation();

                            setMediaToDelete(
                              item
                            );

                          }}
                          className="
                            absolute
                            right-2
                            top-2
                            z-10
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            bg-red-600
                            text-white
                            opacity-100
                            shadow
                            transition
                            hover:bg-red-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            sm:opacity-0
                            sm:group-hover:opacity-100
                          "
                          aria-label={
                            item.media_type ===
                            "video"
                              ? "Delete video"
                              : "Delete photo"
                          }
                        >

                          <Trash2
                            className="
                              h-4
                              w-4
                            "
                          />

                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>


            {/* =================================================
                FOOTER ACTIONS
            ================================================== */}

            <div
              className="
                flex
                flex-wrap
                justify-end
                gap-2
              "
            >

              <Button
                variant="destructive"
                disabled={
                  isLoading
                }
                onClick={() => {

                  setAction(
                    "delete"
                  );

                  setConfirmOpen(
                    true
                  );

                }}
              >
                Delete
              </Button>


              <Button
                variant="outline"
                disabled={
                  isLoading
                }
                onClick={() => {

                  setAction(
                    "rejected"
                  );

                  setConfirmOpen(
                    true
                  );

                }}
              >
                Reject
              </Button>


              <Button
                disabled={
                  isLoading
                }
                onClick={() => {

                  setAction(
                    "approved"
                  );

                  setConfirmOpen(
                    true
                  );

                }}
              >
                Approve
              </Button>

            </div>

          </div>

        </DialogContent>

      </Dialog>


      {/* ===================================================
          REVIEW ACTION CONFIRMATION
      ==================================================== */}

      <ReviewConfirmDialog
        open={
          confirmOpen
        }

        onOpenChange={
          setConfirmOpen
        }

        loading={
          isLoading
        }

        title="Confirm Action"

        description={

          action ===
          "delete"

            ? "Are you sure you want to permanently delete this review?"

            : action ===
              "approved"

              ? rewardsEnabled
              ? `Approve this review and credit ${rewardLabel}?`
              : "Approve this review without adding a wallet reward?"

              : "Are you sure you want to reject this review?"

        }

        onConfirm={() => {

          if (
            !review ||
            !action
          ) {
            return;
          }


          switch (action) {

            case "approved":

              onApprove(
                review.id,
                rewardType
              );

              break;


            case "rejected":

              onReject(
                review.id
              );

              break;


            case "delete":

              onDelete(
                review.id
              );

              break;

          }


          setConfirmOpen(
            false
          );

        }}
      />


      {/* ===================================================
          MEDIA DELETE CONFIRMATION
      ==================================================== */}

      <ReviewConfirmDialog
        open={
          Boolean(
            mediaToDelete
          )
        }

        onOpenChange={(
          value
        ) => {

          if (!value) {

            setMediaToDelete(
              null
            );

          }

        }}

        loading={
          isDeletingMedia
        }

        title={
          mediaToDelete?.media_type ===
          "video"
            ? "Delete Video?"
            : "Delete Photo?"
        }

        description={
          mediaToDelete?.media_type ===
          "video"
            ? "Are you sure you want to permanently delete this video from the review?"
            : "Are you sure you want to permanently delete this photo from the review?"
        }

        onConfirm={
          handleDeleteMedia
        }
      />


      {/* ===================================================
          MEDIA PREVIEW
      ==================================================== */}

      <Dialog
        open={
          Boolean(
            previewMedia
          )
        }

        onOpenChange={(
          value
        ) => {

          if (!value) {
            closeMediaPreview();
          }

        }}
      >

        <DialogContent
          className="
            max-w-4xl
            overflow-hidden
            p-2
            sm:p-4
          "
        >

          <div
            className="
              relative
              flex
              min-h-[300px]
              items-center
              justify-center
              rounded-xl
              bg-black
              p-2
              sm:min-h-[500px]
            "
          >

            {/* CLOSE */}

            <button
              type="button"
              onClick={
                closeMediaPreview
              }
              className="
                absolute
                right-3
                top-3
                z-20
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-black/70
                text-white
                hover:bg-black
              "
              aria-label="Close media preview"
            >

              <X
                className="
                  h-5
                  w-5
                "
              />

            </button>


            {/* PREVIOUS */}

            {media.length > 1 && (

              <button
                type="button"
                onClick={
                  showPreviousMedia
                }
                className="
                  absolute
                  left-3
                  top-1/2
                  z-20
                  flex
                  h-10
                  w-10
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-black/70
                  text-white
                  hover:bg-black
                "
                aria-label="Previous media"
              >

                <ChevronLeft
                  className="
                    h-5
                    w-5
                  "
                />

              </button>

            )}


            {/* MEDIA */}

            {previewMedia && (

              previewMedia.media_type ===
              "video" ? (

                <video
                  key={
                    previewMedia.id
                  }
                  src={
                    previewMedia.media_url
                  }
                  controls
                  autoPlay
                  playsInline
                  className="
                    max-h-[75vh]
                    max-w-full
                    rounded-lg
                    object-contain
                  "
                />

              ) : (

                <img
                  key={
                    previewMedia.id
                  }
                  src={
                    previewMedia.media_url
                  }
                  alt="Customer review media"
                  className="
                    max-h-[75vh]
                    max-w-full
                    rounded-lg
                    object-contain
                  "
                />

              )

            )}


            {/* NEXT */}

            {media.length > 1 && (

              <button
                type="button"
                onClick={
                  showNextMedia
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  z-20
                  flex
                  h-10
                  w-10
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-black/70
                  text-white
                  hover:bg-black
                "
                aria-label="Next media"
              >

                <ChevronRight
                  className="
                    h-5
                    w-5
                  "
                />

              </button>

            )}


            {/* COUNTER */}

            {media.length > 1 && (

              <div
                className="
                  absolute
                  bottom-3
                  left-1/2
                  -translate-x-1/2
                  rounded-full
                  bg-black/70
                  px-3
                  py-1.5
                  text-xs
                  text-white
                "
              >

                {previewIndex + 1}
                {" / "}
                {media.length}

              </div>

            )}

          </div>


          {/* =================================================
              PREVIEW THUMBNAILS
          ================================================== */}

          {media.length > 1 && (

            <div
              className="
                mt-2
                flex
                gap-2
                overflow-x-auto
                px-1
                pb-1
              "
            >

              {media.map(
                (
                  item,
                  index
                ) => (

                  <button
                    key={
                      item.id
                    }
                    type="button"
                    onClick={() => {

                      setPreviewIndex(
                        index
                      );

                      setPreviewMedia(
                        item
                      );

                    }}
                    className={`
                      relative
                      h-16
                      w-16
                      shrink-0
                      overflow-hidden
                      rounded-lg
                      border-2
                      ${
                        index ===
                        previewIndex
                          ? "border-primary"
                          : "border-transparent"
                      }
                    `}
                  >

                    {item.media_type ===
                    "video" ? (

                      <video
                        src={
                          item.media_url
                        }
                        muted
                        playsInline
                        preload="metadata"
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />

                    ) : (

                      <img
                        src={
                          item.thumbnail_url ||
                          item.media_url
                        }
                        alt="Review thumbnail"
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />

                    )}

                    {item.media_type ===
                    "video" && (

                      <span
                        className="
                          absolute
                          inset-0
                          flex
                          items-center
                          justify-center
                          bg-black/20
                        "
                      >

                        <Video
                          className="
                            h-5
                            w-5
                            text-white
                          "
                        />

                      </span>

                    )}

                  </button>

                )
              )}

            </div>

          )}

        </DialogContent>

      </Dialog>

    </>

  );
}