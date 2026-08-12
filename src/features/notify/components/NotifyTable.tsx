import {
  Eye,
} from "lucide-react";

import {
  useState,
  useMemo,
} from "react";

import {
  useUpdateNotifyStatus,
} from "../hooks/useNotifyMutations";

import NotifyDialog from "./NotifyDialog";

import DataTable from "@/components/shared/DataTable";

import type {
  Column,
} from "@/components/shared/DataTable";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  NotifyRequest,
} from "../types/notify.types";

import NotifyStatusBadge
  from "./NotifyStatusBadge";


interface NotifyTableProps {

  requests: NotifyRequest[];

}


export default function NotifyTable({

  requests,

}: NotifyTableProps) {


  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [
    selectedRequest,
    setSelectedRequest,
  ] = useState<NotifyRequest | null>(
    null
  );


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");


  const [
    dialogOpen,
    setDialogOpen,
  ] = useState(false);


  /*
   * =========================================================
   * STATUS MUTATION
   * =========================================================
   */

  const updateStatus =
    useUpdateNotifyStatus();


  /*
   * =========================================================
   * FILTER DATA
   * =========================================================
   */

  const filteredData =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      return requests.filter(
        (row) => {

          const matchesSearch =
            row.name
              .toLowerCase()
              .includes(query)

            ||

            (
              row.phone
                ?.toLowerCase()
                .includes(query)
              ??
              false
            )

            ||

            (
              row.email
                ?.toLowerCase()
                .includes(query)
              ??
              false
            )

            ||

            (
              row.product?.name
                ?.toLowerCase()
                .includes(query)
              ??
              false
            );


          const matchesStatus =
            statusFilter === "all"
            ||
            row.status ===
              statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      requests,
      search,
      statusFilter,
    ]);


  /*
   * =========================================================
   * OPEN DIALOG
   * =========================================================
   */

  const openDialog = (
    request: NotifyRequest
  ) => {

    setSelectedRequest(
      request
    );

    setDialogOpen(
      true
    );

  };


  /*
   * =========================================================
   * TABLE COLUMNS
   * =========================================================
   */

  const columns:
    Column<NotifyRequest>[] = [

    /*
     * -------------------------------------------------------
     * PRODUCT
     * -------------------------------------------------------
     */

    {

      key:
        "product",

      title:
        "Product",

      render: (
        _,
        row
      ) => (

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <img

            src={

              row.product
                ?.product_images
                ?.find(
                  (img) =>
                    img.is_primary
                )
                ?.image_url

              ??

              row.product
                ?.product_images
                ?.[0]
                ?.image_url

              ??

              "/placeholder.png"

            }

            alt={
              row.product?.name ??
              "Product"
            }

            className="
              h-12
              w-12
              rounded-lg
              border
              object-cover
            "

          />


          <div>

            <p
              className="
                font-medium
              "
            >

              {
                row.product?.name
                ??
                "Unknown product"
              }

            </p>


            <p
              className="
                text-xs
                text-muted-foreground
              "
            >

              {
                row.product?.slug
                ??
                "—"
              }

            </p>

          </div>

        </div>

      ),

    },


    /*
     * -------------------------------------------------------
     * CUSTOMER
     * -------------------------------------------------------
     */

    {

      key:
        "name",

      title:
        "Customer",

      render: (
        _,
        row
      ) => (

        <div>

          <p
            className="
              font-medium
            "
          >

            {
              row.name
            }

          </p>


          <p
            className="
              text-xs
              text-muted-foreground
            "
          >

            {
              row.phone
              ??
              "No phone"
            }

          </p>

        </div>

      ),

    },


    /*
     * -------------------------------------------------------
     * EMAIL
     * -------------------------------------------------------
     */

    {

      key:
        "email",

      title:
        "Email",

      render: (
        value
      ) => (

        <span>

          {
            (value as string | null)
            ??
            "—"
          }

        </span>

      ),

    },


    /*
     * -------------------------------------------------------
     * CREATED
     * -------------------------------------------------------
     */

    {

      key:
        "created_at",

      title:
        "Requested",

      render: (
        value
      ) => {

        if (!value) {

          return "—";

        }


        return new Date(
          value as string
        ).toLocaleDateString(
          "en-IN",
          {
            day:
              "2-digit",

            month:
              "short",

            year:
              "numeric",
          }
        );

      },

    },


    /*
     * -------------------------------------------------------
     * STATUS
     * -------------------------------------------------------
     */

    {

      key:
        "status",

      title:
        "Status",

      render: (
        value
      ) => (

        <NotifyStatusBadge

          status={
            value as
              NotifyRequest["status"]
          }

        />

      ),

    },


    /*
     * -------------------------------------------------------
     * ACTIONS
     * -------------------------------------------------------
     */

    {

      key:
        "id",

      title:
        "Actions",

      render: (
        _,
        row
      ) => (

        <Button

          variant="ghost"

          size="icon"

          onClick={() =>
            openDialog(row)
          }

        >

          <Eye
            className="
              h-4
              w-4
            "
          />

        </Button>

      ),

    },

  ];


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (

    <>

      {/* =====================================================
          Filters
      ====================================================== */}

      <div
        className="
          mb-4
          flex
          flex-col
          gap-3

          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <Input

          placeholder="
            Search customer, phone, email or product...
          "

          value={
            search
          }

          onChange={(
            event
          ) =>
            setSearch(
              event.target.value
            )
          }

          className="
            md:max-w-sm
          "

        />


        <Select

          value={
            statusFilter
          }

          onValueChange={
            setStatusFilter
          }

        >

          <SelectTrigger
            className="
              w-[180px]
            "
          >

            <SelectValue
              placeholder="
                Filter by status
              "
            />

          </SelectTrigger>


          <SelectContent>

            <SelectItem
              value="all"
            >
              All Status
            </SelectItem>


            <SelectItem
              value="pending"
            >
              Pending
            </SelectItem>


            <SelectItem
              value="notified"
            >
              Notified
            </SelectItem>


            <SelectItem
              value="cancelled"
            >
              Cancelled
            </SelectItem>

          </SelectContent>

        </Select>

      </div>


      {/* =====================================================
          Table
      ====================================================== */}

      <DataTable

        title="
          Notify Requests
        "

        description="
          Customers waiting for products to be restocked.
        "

        columns={
          columns
        }

        data={
          filteredData
        }

        getRowKey={(
          row
        ) =>
          row.id
        }

        emptyTitle="
          No notify requests
        "

        emptyDescription="
          Customers will appear here once they request stock notifications.
        "

      />


      {/* =====================================================
          Dialog
      ====================================================== */}

      <NotifyDialog

        open={
          dialogOpen
        }

        onOpenChange={
          setDialogOpen
        }

        request={
          selectedRequest
        }

        isLoading={
          updateStatus.isPending
        }


        /*
         * ---------------------------------------------------
         * MARK NOTIFIED
         * ---------------------------------------------------
         */

        onMarkNotified={(
          id
        ) => {

          updateStatus.mutate(

            {
              id,

              status:
                "notified",
            },

            {

              onSuccess: () => {

                setDialogOpen(
                  false
                );

                setSelectedRequest(
                  null
                );

              },

            }

          );

        }}


        /*
         * ---------------------------------------------------
         * CANCEL
         * ---------------------------------------------------
         */

        onCancel={(
          id
        ) => {

          updateStatus.mutate(

            {
              id,

              status:
                "cancelled",
            },

            {

              onSuccess: () => {

                setDialogOpen(
                  false
                );

                setSelectedRequest(
                  null
                );

              },

            }

          );

        }}

      />

    </>

  );

}