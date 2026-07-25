import { useState } from "react";
import {
  Plus,
  HelpCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import FAQTable from "../components/FAQTable";
import FAQDialog from "../components/FAQDialog";
import FAQConfirmDialog from "../components/FAQConfirmDialog";

import {
  useDeleteFAQ,
} from "../hooks/useFAQMutations";

import {
  useFAQs,
} from "../hooks/useFAQs";

import type {
  FAQ,
} from "../types/faq.types";


export default function FAQsPage() {

  const {
    data: faqs = [],
    isLoading,
  } = useFAQs();


  const [dialogOpen, setDialogOpen] =
    useState(false);


  const [selectedFAQ, setSelectedFAQ] =
    useState<FAQ | null>(null);


  const deleteMutation =
    useDeleteFAQ();


  const [deleteOpen, setDeleteOpen] =
    useState(false);


  const [deleteFAQ, setDeleteFAQ] =
    useState<FAQ | null>(null);



  const handleAdd = () => {
    setSelectedFAQ(null);
    setDialogOpen(true);
  };


  const handleEdit = (
    faq: FAQ
  ) => {
    setSelectedFAQ(faq);
    setDialogOpen(true);
  };


  const handleDelete = (
    faq: FAQ
  ) => {
    setDeleteFAQ(faq);
    setDeleteOpen(true);
  };


  const handleConfirmDelete = () => {

    if (!deleteFAQ) return;


    deleteMutation.mutate(
      deleteFAQ.id,
      {
        onSuccess: () => {
          setDeleteOpen(false);
          setDeleteFAQ(null);
        },
      }
    );
  };



  return (
    <div className="space-y-6">


      {/* Header */}
      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            FAQs
          </h1>


          <p className="text-muted-foreground">
            Manage frequently asked questions.
          </p>

        </div>


        <Button
          onClick={handleAdd}
        >

          <Plus className="mr-2 h-4 w-4" />

          Add FAQ

        </Button>

      </div>



      {/* Loading State */}

      {isLoading && (

        <div className="flex h-64 items-center justify-center rounded-xl border bg-white">

          <div className="flex flex-col items-center gap-3">

            <Loader2
              className="h-8 w-8 animate-spin text-muted-foreground"
            />

            <p className="text-sm text-muted-foreground">
              Loading FAQs...
            </p>

          </div>

        </div>

      )}



      {/* Empty State */}

      {!isLoading &&
        faqs.length === 0 && (

        <div className="flex h-72 flex-col items-center justify-center rounded-xl border bg-white text-center">

          <div className="mb-4 rounded-full bg-muted p-4">

            <HelpCircle
              className="h-8 w-8 text-muted-foreground"
            />

          </div>


          <h3 className="text-lg font-semibold">
            No FAQs found
          </h3>


          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add your first frequently asked question
            to help customers find answers quickly.
          </p>


          <Button
            className="mt-5"
            onClick={handleAdd}
          >

            <Plus className="mr-2 h-4 w-4" />

            Create FAQ

          </Button>

        </div>

      )}



      {/* Table */}

      {!isLoading &&
        faqs.length > 0 && (

        <FAQTable
          data={faqs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      )}



      {/* Add/Edit Dialog */}

      <FAQDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        faq={selectedFAQ}
      />



      {/* Delete Confirmation */}

      <FAQConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        loading={
          deleteMutation.isPending
        }
        onConfirm={
          handleConfirmDelete
        }
      />


    </div>
  );
}