import {
  CreditCard,
  Wallet,
  RotateCcw,
} from "lucide-react";

import {
  useState
} from "react";

import {
  toast
} from "sonner";

import {
  Button
} from "@/components/ui/button";

import type {
  Order
} from "../types/order.types";

import {
  useProcessRefund
} from "../hooks/useOrders";

import PaymentStatusBadge
  from "./PaymentStatusBadge";





interface PaymentCardProps {
  order: Order;
}





export default function PaymentCard({
  order,
}: PaymentCardProps) {





  const [
    showRefundDialog,
    setShowRefundDialog,
  ] = useState(false);





  const [
    refundTransactionId,
    setRefundTransactionId,
  ] = useState("");





  const [
    refundNotes,
    setRefundNotes,
  ] = useState("");





  const processRefund =
    useProcessRefund();





  const isPrepaid =
    order.payment_method ===
    "prepaid";





  const isCancelled =
    order.order_status ===
    "cancelled";





  const showRefund =
    isPrepaid &&
    isCancelled;





  const canMarkRefundProcessed =
    showRefund &&
    order.refund_status ===
      "pending";





  const handleMarkRefundProcessed =
    async () => {

      const transactionId =
        refundTransactionId.trim();





      if (!transactionId) {

        toast.error(
          "Please enter the refund transaction ID"
        );

        return;

      }





      try {

        await processRefund.mutateAsync({

          id:
            order.id,

          refundTransactionId:
            transactionId,

          refundNotes:
            refundNotes.trim() ||
            undefined,

        });





        toast.success(
          "Refund marked as processed"
        );





        setRefundTransactionId("");

        setRefundNotes("");

        setShowRefundDialog(false);





      } catch (error) {

        console.error(
          "Failed to process refund:",
          error
        );





        toast.error(

          error instanceof Error

            ? error.message

            : "Failed to process refund"

        );

      }

    };





  return (

    <>

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-lg font-semibold">

          Payment Details

        </h2>





        <div className="space-y-5">

          {/* Payment Method */}

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <CreditCard className="h-5 w-5 text-gray-500" />





              <div>

                <p className="text-xs text-gray-500">

                  Payment Method

                </p>





                <p className="font-medium capitalize">

                  {order.payment_method.replace(
                    "_",
                    " "
                  )}

                </p>

              </div>

            </div>

          </div>





          {/* Amounts */}

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-lg border bg-gray-50 p-4">

              <p className="text-xs text-gray-500">

                Total Amount

              </p>





              <p className="mt-1 text-xl font-bold">

                ₹
                {order.total_amount.toLocaleString(
                  "en-IN"
                )}

              </p>

            </div>





            <div className="rounded-lg border bg-gray-50 p-4">

              <p className="text-xs text-gray-500">

                Amount Paid

              </p>





              <p className="mt-1 text-xl font-bold text-green-600">

                ₹
                {order.advance_amount.toLocaleString(
                  "en-IN"
                )}

              </p>

            </div>

          </div>





          {/* Remaining COD */}

          {!isPrepaid && (

            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">

              <div className="flex items-center gap-2">

                <Wallet className="h-5 w-5 text-orange-600" />





                <p className="font-medium text-orange-700">

                  Remaining COD

                </p>

              </div>





              <p className="mt-2 text-2xl font-bold text-orange-700">

                ₹
                {order.remaining_amount.toLocaleString(
                  "en-IN"
                )}

              </p>

            </div>

          )}









          {/* Payment Status */}

          <div className="flex items-center justify-between rounded-lg border p-4">

            <div>

              <p className="text-sm font-medium">

                Payment Status

              </p>





              <p className="text-xs text-gray-500">

                {isPrepaid
                  ? "Online Payment"
                  : "Advance Payment"}

              </p>

            </div>





            <PaymentStatusBadge
              status={
                order.advance_payment_status
              }
            />

          </div>









          {/* COD Collection */}

          {!isPrepaid && (

            <div className="flex items-center justify-between rounded-lg border p-4">

              <div>

                <p className="text-sm font-medium">

                  COD Collection

                </p>





                <p className="text-xs text-gray-500">

                  Collect on Delivery

                </p>

              </div>





              <PaymentStatusBadge
                status={
                  order.cod_payment_status
                }
              />

            </div>

          )}









          {/* Refund */}

          {showRefund && (

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">

              <div className="flex items-center gap-2">

                <RotateCcw className="h-5 w-5 text-blue-600" />





                <div>

                  <p className="font-semibold text-blue-800">

                    Refund Information

                  </p>





                  <p className="text-xs text-blue-600">

                    Prepaid order cancellation

                  </p>

                </div>

              </div>





              <div className="mt-4 grid grid-cols-2 gap-4">

                <div>

                  <p className="text-xs text-blue-600">

                    Refund Amount

                  </p>





                  <p className="mt-1 text-xl font-bold text-blue-800">

                    ₹
                    {Number(
                      order.refund_amount ?? 0
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </p>

                </div>





                <div>

                  <p className="text-xs text-blue-600">

                    Refund Status

                  </p>





                  <p className="mt-1 font-semibold capitalize text-blue-800">

                    {order.refund_status
                      ?.replace(
                        "_",
                        " "
                      ) ??
                      "Pending"}

                  </p>

                </div>

              </div>





              {order.refund_transaction_id && (

                <div className="mt-4 rounded-md border border-blue-200 bg-white p-3">

                  <p className="text-xs text-gray-500">

                    Refund Transaction ID

                  </p>





                  <p className="mt-1 break-all text-sm font-medium text-gray-800">

                    {order.refund_transaction_id}

                  </p>

                </div>

              )}









              {order.refund_processed_at && (

                <div className="mt-3">

                  <p className="text-xs text-blue-600">

                    Refund Processed At

                  </p>





                  <p className="mt-1 text-sm text-blue-800">

                    {new Date(

                      order.refund_processed_at

                    ).toLocaleString(
                      "en-IN"
                    )}

                  </p>

                </div>

              )}









              {order.refund_notes && (

                <div className="mt-3">

                  <p className="text-xs text-blue-600">

                    Refund Notes

                  </p>





                  <p className="mt-1 text-sm text-blue-800">

                    {order.refund_notes}

                  </p>

                </div>

              )}









              {canMarkRefundProcessed && (

                <div className="mt-5 border-t border-blue-200 pt-4">

                  <Button

                    type="button"

                    onClick={() =>
                      setShowRefundDialog(true)
                    }

                    className="w-full"

                  >

                    <RotateCcw
                      size={16}
                      className="mr-2"
                    />

                    Mark Refund Processed

                  </Button>

                </div>

              )}

            </div>

          )}

        </div>

      </div>









      {/* Refund Dialog */}

      {showRefundDialog && (

        <div

          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"

          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              if (
                !processRefund.isPending
              ) {

                setShowRefundDialog(
                  false
                );

              }

            }

          }}

        >

          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

            <div className="border-b p-6">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">

                  <RotateCcw size={20} />

                </div>





                <div>

                  <h3 className="text-lg font-semibold">

                    Mark Refund Processed

                  </h3>





                  <p className="mt-1 text-sm text-gray-500">

                    Confirm that the refund has actually been processed.

                  </p>

                </div>

              </div>

            </div>





            <div className="space-y-5 p-6">

              <div className="rounded-lg border bg-gray-50 p-4">

                <p className="text-xs text-gray-500">

                  Refund Amount

                </p>





                <p className="mt-1 text-2xl font-bold">

                  ₹
                  {Number(
                    order.refund_amount ?? 0
                  ).toLocaleString(
                    "en-IN"
                  )}

                </p>

              </div>





              <div>

                <label className="text-sm font-medium text-gray-700">

                  Refund Transaction / Reference ID

                </label>





                <input

                  type="text"

                  value={
                    refundTransactionId
                  }

                  onChange={(event) =>
                    setRefundTransactionId(
                      event.target.value
                    )
                  }

                  placeholder="Enter refund reference ID"

                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"

                />

              </div>





              <div>

                <label className="text-sm font-medium text-gray-700">

                  Refund Notes

                  <span className="font-normal text-gray-400">

                    {" "}(
                    optional
                    )

                  </span>

                </label>





                <textarea

                  value={
                    refundNotes
                  }

                  onChange={(event) =>
                    setRefundNotes(
                      event.target.value
                    )
                  }

                  placeholder="Optional notes about the refund"

                  rows={3}

                  className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"

                />

              </div>





              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">

                <p className="text-xs leading-5 text-yellow-800">

                  Only mark this as processed after the money has actually been refunded to the customer.

                </p>

              </div>

            </div>





            <div className="flex justify-end gap-3 border-t bg-gray-50 p-4">

              <Button

                type="button"

                variant="outline"

                onClick={() =>
                  setShowRefundDialog(false)
                }

                disabled={
                  processRefund.isPending
                }

              >

                Cancel

              </Button>





              <Button

                type="button"

                onClick={
                  handleMarkRefundProcessed
                }

                disabled={

                  processRefund.isPending ||

                  !refundTransactionId.trim()

                }

              >

                {processRefund.isPending

                  ? "Saving..."

                  : "Confirm Refund"}

              </Button>

            </div>

          </div>

        </div>

      )}

    </>

  );

}