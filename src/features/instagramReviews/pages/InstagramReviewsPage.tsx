import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/shared/components/admin/EmptyState";

import {
  useInstagramCustomerReviews,
} from "../hooks/useInstagramCustomerReviews";

import type {
  InstagramCustomerReview,
} from "../types/instagramCustomerReview.types";

import InstagramReviewsTable from "../components/InstagramReviewsTable";
import InstagramReviewDialog from "../components/InstagramReviewDialog";
import InstagramReviewPreviewDialog from "../components/InstagramReviewPreviewDialog";


export default function InstagramReviewsPage() {

  const {
    data: reviews = [],
    isLoading,
  } = useInstagramCustomerReviews();


  const [
    formOpen,
    setFormOpen,
  ] = useState(false);


  const [
    selectedReview,
    setSelectedReview,
  ] =
    useState<InstagramCustomerReview | null>(
      null
    );


  const [
    previewReview,
    setPreviewReview,
  ] =
    useState<InstagramCustomerReview | null>(
      null
    );


  /*
   * =========================================================
   * ORDER REVIEWS
   * =========================================================
   */

  const orderedReviews =
    useMemo(

      () =>

        [...reviews].sort(

          (a, b) =>

            a.display_order -
              b.display_order ||

            new Date(
              b.created_at
            ).getTime() -

            new Date(
              a.created_at
            ).getTime()

        ),

      [reviews]

    );


  /*
   * =========================================================
   * CREATE
   * =========================================================
   */

  function openCreate() {

    setSelectedReview(
      null
    );

    setFormOpen(
      true
    );

  }


  /*
   * =========================================================
   * EDIT
   * =========================================================
   */

  function openEdit(
    review: InstagramCustomerReview
  ) {

    setSelectedReview(
      review
    );

    setFormOpen(
      true
    );

  }


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (

    <div
      className="
        space-y-6
      "
    >

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <PageHeader
        title="Instagram Reviews"
      />


      {/* =====================================================
          CONTENT
      ====================================================== */}

      {!isLoading &&
      orderedReviews.length === 0 ? (

        <div
          className="
            space-y-4
          "
        >

          <EmptyState
            title="No Instagram reviews yet"
          />


          <div>

            <Button
              onClick={
                openCreate
              }
            >

              <Plus
                className="
                  mr-2
                  h-4
                  w-4
                "
              />

              Add Review

            </Button>

          </div>

        </div>

      ) : (

        <InstagramReviewsTable

          reviews={
            orderedReviews
          }

          isLoading={
            isLoading
          }

          onEdit={
            openEdit
          }

          onPreview={
            setPreviewReview
          }

        />

      )}


      {/* =====================================================
          ADD / EDIT DIALOG
      ====================================================== */}

      <InstagramReviewDialog

        open={
          formOpen
        }

        onOpenChange={
          setFormOpen
        }

        review={
          selectedReview
        }

      />


      {/* =====================================================
          PREVIEW DIALOG
      ====================================================== */}

      <InstagramReviewPreviewDialog

        open={
          Boolean(
            previewReview
          )
        }

        onOpenChange={(
          open
        ) => {

          if (!open) {

            setPreviewReview(
              null
            );

          }

        }}

        review={
          previewReview
        }

      />

    </div>

  );

}