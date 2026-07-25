import { useState } from "react";
import {
  Plus,
  FileText,
  Loader2,
} from "lucide-react";
import PolicyConfirmDialog from "../components/PolicyConfirmDialog";
import { Button } from "@/components/ui/button";

import PolicyTable from "../components/PolicyTable";
import PolicyDialog from "../components/PolicyDialog";

import {
  usePolicies,
} from "../hooks/usePolicies";

import {
  useDeletePolicy,
} from "../hooks/usePolicyMutations";

import type {
  Policy,
} from "../types/policy.types";


export default function PoliciesPage() {

  const {
    data: policies = [],
    isLoading,
  } = usePolicies();


  const deleteMutation =
    useDeletePolicy();


  const [dialogOpen, setDialogOpen] =
    useState(false);


  const [selectedPolicy, setSelectedPolicy] =
    useState<Policy | null>(null);


  const [deleteOpen, setDeleteOpen] =
    useState(false);


  const [deletePolicy, setDeletePolicy] =
    useState<Policy | null>(null);



  const handleAdd = () => {

    setSelectedPolicy(null);

    setDialogOpen(true);

  };



  const handleEdit = (
    policy: Policy
  ) => {

    setSelectedPolicy(policy);

    setDialogOpen(true);

  };



  const handleDelete = (
    policy: Policy
  ) => {

    setDeletePolicy(policy);

    setDeleteOpen(true);

  };



  const confirmDelete = () => {

    if (!deletePolicy) return;


    deleteMutation.mutate(
      deletePolicy.id,
      {
        onSuccess: () => {

          setDeleteOpen(false);

          setDeletePolicy(null);

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
            Policies
          </h1>


          <p className="text-muted-foreground">
            Manage website policies and CMS content.
          </p>

        </div>



        <Button
          onClick={handleAdd}
        >

          <Plus className="mr-2 h-4 w-4" />

          Add Policy

        </Button>


      </div>



      {/* Loading */}

      {isLoading && (

        <div className="flex h-64 items-center justify-center rounded-xl border">

          <div className="flex flex-col items-center gap-3">

            <Loader2
              className="h-8 w-8 animate-spin"
            />

            <p className="text-sm text-muted-foreground">
              Loading policies...
            </p>

          </div>

        </div>

      )}




      {/* Empty */}

      {!isLoading &&
        policies.length === 0 && (

        <div className="flex h-72 flex-col items-center justify-center rounded-xl border text-center">


          <div className="mb-4 rounded-full bg-muted p-4">

            <FileText
              className="h-8 w-8 text-muted-foreground"
            />

          </div>


          <h3 className="text-lg font-semibold">
            No policies found
          </h3>


          <p className="mt-1 text-sm text-muted-foreground">
            Create your first website policy page.
          </p>



          <Button
            className="mt-5"
            onClick={handleAdd}
          >

            <Plus className="mr-2 h-4 w-4" />

            Create Policy

          </Button>


        </div>

      )}




      {/* Table */}

      {!isLoading &&
        policies.length > 0 && (

        <PolicyTable

          data={policies}

          onEdit={handleEdit}

          onDelete={handleDelete}

        />

      )}






      {/* Add/Edit */}

      <PolicyDialog

        open={dialogOpen}

        onOpenChange={setDialogOpen}

        policy={selectedPolicy}

      />

<PolicyConfirmDialog

  open={deleteOpen}

  onOpenChange={setDeleteOpen}

  loading={
    deleteMutation.isPending
  }

  onConfirm={confirmDelete}

/>

    </div>

  );
}