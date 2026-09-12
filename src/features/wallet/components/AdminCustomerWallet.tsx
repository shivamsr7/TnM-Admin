import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  History,
  Loader2,
  Minus,
  Plus,
  Wallet,
  X,
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock3,
  PackageOpen,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  useAdminCustomerWallet,
  useAdminWalletTransactions,
  useAddWalletCredit,
  useDeductWalletCredit,
} from "../hooks/useAdminWallet";

import {
  useAdminWalletCreditLots,
} from "../hooks/useAdminWalletCreditLots";

interface AdminCustomerWalletProps {
  customerId: string;
}

function formatCurrency(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function AdminCustomerWallet({
  customerId,
}: AdminCustomerWalletProps) {
  /* =====================================================
     FORM STATE
  ===================================================== */

  const [
    showCreditForm,
    setShowCreditForm,
  ] = useState(false);

  const [
    showDebitForm,
    setShowDebitForm,
  ] = useState(false);

  const [
    creditAmount,
    setCreditAmount,
  ] = useState("");

  const [
    creditReason,
    setCreditReason,
  ] = useState("");

  const [
    creditExpiry,
    setCreditExpiry,
  ] = useState("");

  const [
    debitAmount,
    setDebitAmount,
  ] = useState("");

  const [
    debitReason,
    setDebitReason,
  ] = useState("");

  /* =====================================================
     CONFIRMATION MODAL
  ===================================================== */

  const [
    showDebitConfirmation,
    setShowDebitConfirmation,
  ] = useState(false);

  /* =====================================================
     TRANSACTION VIEW
  ===================================================== */

  const [
    showAllTransactions,
    setShowAllTransactions,
  ] = useState(false);

  /* =====================================================
     QUERIES
  ===================================================== */

  const walletQuery =
    useAdminCustomerWallet(customerId);

  const transactionsQuery =
    useAdminWalletTransactions(customerId);

  const creditLotsQuery =
    useAdminWalletCreditLots(customerId);

  const addCreditMutation =
    useAddWalletCredit(customerId);

  const deductCreditMutation =
    useDeductWalletCredit(customerId);

  const wallet = walletQuery.data;

  const transactions =
    transactionsQuery.data ?? [];

  const creditLots =
    creditLotsQuery.data ?? [];

  const recentTransactions = useMemo(
    () =>
      showAllTransactions
        ? transactions
        : transactions.slice(0, 8),
    [
      transactions,
      showAllTransactions,
    ]
  );

  const isCreditLoading =
    addCreditMutation.isPending;

  const isDebitLoading =
    deductCreditMutation.isPending;

  /* =====================================================
     AMOUNT HELPERS
  ===================================================== */

  const parsedDebitAmount =
    Number(debitAmount);

  const debitAmountPaise =
    Number.isFinite(parsedDebitAmount)
      ? Math.round(
          parsedDebitAmount * 100
        )
      : 0;

  const balanceAfterDebit =
    wallet
      ? Math.max(
          0,
          wallet.balance_paise -
            debitAmountPaise
        )
      : 0;

  /* =====================================================
     ADD CREDIT
  ===================================================== */

  async function handleAddCredit() {
    const amount =
      Number(creditAmount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      toast.error(
        "Enter a valid credit amount."
      );
      return;
    }

    if (!creditReason.trim()) {
      toast.error(
        "Please enter a reason."
      );
      return;
    }

    /*
     * Expiry validation
     *
     * The selected date cannot be in the past.
     */

    if (
      creditExpiry &&
      creditExpiry < getTodayDate()
    ) {
      toast.error(
        "Expiry date cannot be in the past."
      );
      return;
    }

    try {
      await addCreditMutation.mutateAsync({
        amount,
        reason:
          creditReason.trim(),
        expiresAt: creditExpiry
          ? new Date(
              `${creditExpiry}T23:59:59`
            ).toISOString()
          : null,
      });

      toast.success(
        `${formatCurrency(
          Math.round(
            amount * 100
          )
        )} added to wallet.`
      );

      setCreditAmount("");
      setCreditReason("");
      setCreditExpiry("");
      setShowCreditForm(false);
      void creditLotsQuery.refetch();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add wallet credit."
      );
    }
  }

  /* =====================================================
     VALIDATE DEDUCTION
  ===================================================== */

  function validateDeduction() {
    const amount =
      Number(debitAmount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      toast.error(
        "Enter a valid deduction amount."
      );
      return false;
    }

    if (!debitReason.trim()) {
      toast.error(
        "Please enter a reason."
      );
      return false;
    }

    if (
      wallet &&
      amount * 100 >
        wallet.balance_paise
    ) {
      toast.error(
        "Deduction amount cannot exceed wallet balance."
      );
      return false;
    }

    return true;
  }

  /* =====================================================
     OPEN DEDUCTION CONFIRMATION
  ===================================================== */

  function handleRequestDeduction() {
    if (!validateDeduction()) {
      return;
    }

    setShowDebitConfirmation(true);
  }

  /* =====================================================
     CONFIRM DEDUCTION
  ===================================================== */

  async function handleConfirmDeduction() {
    if (!validateDeduction()) {
      return;
    }

    const amount =
      Number(debitAmount);

    try {
      await deductCreditMutation.mutateAsync({
        amount,
        reason:
          debitReason.trim(),
      });

      toast.success(
        `${formatCurrency(
          Math.round(
            amount * 100
          )
        )} deducted from wallet.`
      );

      setDebitAmount("");
      setDebitReason("");
      setShowDebitForm(false);
      setShowDebitConfirmation(false);
      void creditLotsQuery.refetch();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to deduct wallet credit."
      );
    }
  }

  /* =====================================================
     CLOSE DEDUCTION
  ===================================================== */

  function closeDebitConfirmation() {
    if (isDebitLoading) {
      return;
    }

    setShowDebitConfirmation(false);
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (walletQuery.isLoading) {
    return (
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex min-h-[180px] items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading wallet...
          </div>
        </div>
      </section>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (
    walletQuery.isError ||
    !wallet
  ) {
    return (
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Wallet className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              Wallet unavailable
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Unable to load this customer's wallet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* =====================================================
          WALLET CARD
      ===================================================== */}

      <section className="overflow-hidden rounded-xl border bg-white shadow-sm">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="border-b bg-gradient-to-r from-neutral-950 to-neutral-900 px-5 py-5 text-white sm:px-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#C8A44D]/30 bg-[#C8A44D]/10 text-[#C8A44D]">
                <Wallet className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C8A44D]">
                  T&M Wallet
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Store Credit
                </h2>
              </div>

            </div>

            <div className="sm:text-right">
              <p className="text-xs text-white/45">
                Available Balance
              </p>

              <p className="mt-1 text-2xl font-semibold tracking-tight text-[#E4C56B]">
                {formatCurrency(
                  wallet.balance_paise
                )}
              </p>
            </div>

          </div>
        </div>


        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="border-b p-5 sm:p-6">

          <div className="grid gap-3 sm:grid-cols-2">

            {/* ADD CREDIT */}

            <Button
              type="button"
              onClick={() => {
                setShowCreditForm(
                  (current) => !current
                );

                setShowDebitForm(false);
              }}
              className="h-11 bg-[#C8A44D] text-black hover:bg-[#D7B65D]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Credit
            </Button>


            {/* DEDUCT CREDIT */}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowDebitForm(
                  (current) => !current
                );

                setShowCreditForm(false);
              }}
              disabled={
                wallet.balance_paise <= 0
              }
              className="h-11 border-neutral-300"
            >
              <Minus className="mr-2 h-4 w-4" />
              Deduct Credit
            </Button>

          </div>


          {/* =================================================
              ADD CREDIT FORM
          ================================================= */}

          {showCreditForm && (
            <div className="mt-5 rounded-xl border border-[#C8A44D]/30 bg-[#C8A44D]/[0.04] p-4 sm:p-5">

              <div className="mb-4">
                <h3 className="font-semibold">
                  Add Wallet Credit
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Add store credit directly to this
                  customer's T&M wallet.
                </p>
              </div>


              <div className="grid gap-4 md:grid-cols-2">

                {/* AMOUNT */}

                <div>
                  <label className="mb-1.5 block text-xs font-medium">
                    Amount
                  </label>

                  <div className="relative">

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={creditAmount}
                      onChange={(event) =>
                        setCreditAmount(
                          event.target.value
                        )
                      }
                      placeholder="500"
                      className="h-11 w-full rounded-lg border bg-white pl-8 pr-3 text-sm outline-none transition focus:border-[#C8A44D] focus:ring-2 focus:ring-[#C8A44D]/10"
                    />

                  </div>
                </div>


                {/* EXPIRY */}

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium">
                    <CalendarDays className="h-3.5 w-3.5 text-[#C8A44D]" />
                    Expiry Date
                    <span className="text-muted-foreground">
                      (optional)
                    </span>
                  </label>

                  <input
                    type="date"
                    min={getTodayDate()}
                    value={creditExpiry}
                    onChange={(event) =>
                      setCreditExpiry(
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:border-[#C8A44D] focus:ring-2 focus:ring-[#C8A44D]/10"
                  />

                  {creditExpiry && (
                    <p className="mt-1.5 text-[10px] text-muted-foreground">
                      Credit expires on{" "}
                      <span className="font-medium text-foreground">
                        {new Date(
                          `${creditExpiry}T12:00:00`
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </p>
                  )}

                </div>


                {/* REASON */}

                <div className="md:col-span-2">

                  <label className="mb-1.5 block text-xs font-medium">
                    Reason
                  </label>

                  <textarea
                    value={creditReason}
                    onChange={(event) =>
                      setCreditReason(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Compensation for delayed delivery"
                    rows={3}
                    maxLength={500}
                    className="w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#C8A44D] focus:ring-2 focus:ring-[#C8A44D]/10"
                  />

                  <p className="mt-1 text-right text-[10px] text-muted-foreground">
                    {creditReason.length}/500
                  </p>

                </div>

              </div>


              {/* EXPIRY NOTE */}

              {creditExpiry && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#C8A44D]/20 bg-[#C8A44D]/5 px-3 py-2.5">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#C8A44D]" />

                  <p className="text-[11px] leading-4 text-muted-foreground">
                    This credit will be recorded with
                    an expiry date of{" "}
                    <span className="font-medium text-foreground">
                      {new Date(
                        `${creditExpiry}T12:00:00`
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                    .
                  </p>
                </div>
              )}


              {/* BUTTONS */}

              <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setShowCreditForm(false)
                  }
                  disabled={
                    isCreditLoading
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={
                    handleAddCredit
                  }
                  disabled={
                    isCreditLoading
                  }
                  className="bg-[#C8A44D] text-black hover:bg-[#D7B65D]"
                >
                  {isCreditLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Credit
                    </>
                  )}
                </Button>

              </div>

            </div>
          )}


          {/* =================================================
              DEDUCT CREDIT FORM
          ================================================= */}

          {showDebitForm && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50/50 p-4 sm:p-5">

              <div className="mb-4">

                <h3 className="font-semibold">
                  Deduct Wallet Credit
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Current balance:{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(
                      wallet.balance_paise
                    )}
                  </span>
                </p>

              </div>


              <div className="grid gap-4">

                {/* AMOUNT */}

                <div>

                  <label className="mb-1.5 block text-xs font-medium">
                    Amount
                  </label>

                  <div className="relative">

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      max={
                        wallet.balance_paise /
                        100
                      }
                      step="0.01"
                      value={debitAmount}
                      onChange={(event) =>
                        setDebitAmount(
                          event.target.value
                        )
                      }
                      placeholder="100"
                      className="h-11 w-full rounded-lg border bg-white pl-8 pr-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    />

                  </div>

                </div>


                {/* REASON */}

                <div>

                  <label className="mb-1.5 block text-xs font-medium">
                    Reason
                  </label>

                  <textarea
                    value={debitReason}
                    onChange={(event) =>
                      setDebitReason(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Incorrect promotional credit"
                    rows={3}
                    maxLength={500}
                    className="w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />

                  <p className="mt-1 text-right text-[10px] text-muted-foreground">
                    {debitReason.length}/500
                  </p>

                </div>

              </div>


              {/* PREVIEW */}

              {debitAmountPaise > 0 &&
                debitAmountPaise <=
                  wallet.balance_paise && (
                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-red-200 bg-white p-3">

                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Current Balance
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {formatCurrency(
                          wallet.balance_paise
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        After Deduction
                      </p>

                      <p className="mt-1 text-sm font-semibold text-red-600">
                        {formatCurrency(
                          balanceAfterDebit
                        )}
                      </p>
                    </div>

                  </div>
                )}


              {/* BUTTONS */}

              <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setShowDebitForm(
                      false
                    )
                  }
                  disabled={
                    isDebitLoading
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={
                    handleRequestDeduction
                  }
                  disabled={
                    isDebitLoading
                  }
                >
                  <Minus className="mr-2 h-4 w-4" />
                  Review Deduction
                </Button>

              </div>

            </div>
          )}

        </div>


        {/* =====================================================
            CREDIT LOTS & EXPIRY
        ===================================================== */}

        <div className="border-t">

          {/* HEADER */}

          <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">

            <div className="flex items-center gap-2">

              <PackageOpen className="h-4 w-4 text-[#C8A44D]" />

              <h3 className="text-sm font-semibold">
                Credit Lots & Expiry
              </h3>

            </div>

            <span className="text-[11px] text-muted-foreground">
              {creditLots.length}{" "}
              {creditLots.length === 1
                ? "lot"
                : "lots"}
            </span>

          </div>


          {/* LOADING */}

          {creditLotsQuery.isLoading ? (

            <div className="flex h-28 items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>

          ) : creditLotsQuery.isError ? (

            <div className="px-6 py-8 text-center">

              <p className="text-sm font-medium">
                Unable to load credit lots
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Please refresh and try again.
              </p>

            </div>

          ) : creditLots.length === 0 ? (

            <div className="px-6 py-10 text-center">

              <PackageOpen className="mx-auto h-8 w-8 text-neutral-300" />

              <p className="mt-3 text-sm font-medium">
                No credit lots yet
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Credit lots will appear here when wallet credit is added.
              </p>

            </div>

          ) : (

            <div className="divide-y">

              {creditLots.map((lot) => {

                const isExpired =
                  lot.status === "expired";

                const usedAmountPaise =
                  Math.max(
                    0,
                    Number(lot.original_amount_paise) -
                      Number(lot.remaining_amount_paise)
                  );

                const statusLabel =
                  isExpired
                    ? "Expired"
                    : lot.status === "exhausted"
                    ? "Exhausted"
                    : "Active";

                const statusClass =
                  isExpired
                    ? "bg-red-50 text-red-600"
                    : lot.status === "exhausted"
                    ? "bg-neutral-100 text-neutral-600"
                    : "bg-emerald-50 text-emerald-600";

                return (
                  <div
                    key={lot.id}
                    className="px-5 py-4 sm:px-6"
                  >

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      {/* SOURCE / EXPIRY */}

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <p className="text-sm font-medium">
                            {lot.source_transaction_type
                              ? lot.source_transaction_type
                                  .replaceAll("_", " ")
                                  .replace(/\b\w/g, (character) =>
                                    character.toUpperCase()
                                  )
                              : "Wallet Credit"}
                          </p>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${statusClass}`}
                          >
                            {statusLabel}
                          </span>

                        </div>

                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {lot.source_description ||
                            "Wallet credit"}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">

                          <span>
                            Added {formatShortDate(lot.created_at)}
                          </span>

                          {lot.expires_at ? (
                            <span
                              className={`inline-flex items-center gap-1 ${
                                isExpired
                                  ? "text-red-500"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <Clock3 className="h-3 w-3" />
                              {isExpired
                                ? "Expired"
                                : "Expires"}{" "}
                              {formatShortDate(lot.expires_at)}
                            </span>
                          ) : (
                            <span>
                              No expiry
                            </span>
                          )}

                        </div>

                      </div>


                      {/* AMOUNTS */}

                      <div className="shrink-0 sm:text-right">

                        <p className="text-sm font-semibold">
                          {formatCurrency(
                            Number(lot.remaining_amount_paise)
                          )}
                        </p>

                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          of{" "}
                          {formatCurrency(
                            Number(lot.original_amount_paise)
                          )}{" "}
                          remaining
                        </p>

                        {usedAmountPaise > 0 && (
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            Used{" "}
                            {formatCurrency(
                              usedAmountPaise
                            )}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>


        {/* =====================================================
            TRANSACTION HISTORY
        ===================================================== */}

        <div>

          {/* HEADER */}

          <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">

            <div className="flex items-center gap-2">

              <History className="h-4 w-4 text-[#C8A44D]" />

              <h3 className="text-sm font-semibold">
                Wallet Activity
              </h3>

            </div>

            <span className="text-[11px] text-muted-foreground">
              {transactions.length}{" "}
              {transactions.length === 1
                ? "transaction"
                : "transactions"}
            </span>

          </div>


          {/* LOADING */}

          {transactionsQuery.isLoading ? (

            <div className="flex h-28 items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>

          ) : recentTransactions.length === 0 ? (

            /* EMPTY */

            <div className="px-6 py-10 text-center">

              <CreditCard className="mx-auto h-8 w-8 text-neutral-300" />

              <p className="mt-3 text-sm font-medium">
                No wallet activity yet
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Credits and deductions will appear here.
              </p>

            </div>

          ) : (

            /* TRANSACTIONS */

            <div className="divide-y">

              {recentTransactions.map(
                (transaction) => {

                  /*
                   * amount_paise is ALWAYS POSITIVE.
                   *
                   * Direction is determined from
                   * reference_type / transaction_type.
                   *
                   * Credits:
                   *   - admin_credit
                   *   - reward
                   *   - referral
                   *   - refund
                   *
                   * Debits:
                   *   - admin_debit
                   *   - wallet_expiry
                   *   - debit
                   *   - expiry
                   */

                  const isDebit =
                    transaction.reference_type ===
                      "admin_debit" ||
                    transaction.reference_type ===
                      "wallet_expiry" ||
                    transaction.transaction_type ===
                      "debit" ||
                    transaction.transaction_type ===
                      "expiry";

                  const isPositive =
                    !isDebit;

                  const isExpired =
                    Boolean(
                      transaction.expires_at &&
                      new Date(
                        transaction.expires_at
                      ) < new Date()
                    );

                  const isWalletExpiry =
                    transaction.reference_type ===
                      "wallet_expiry" ||
                    transaction.transaction_type ===
                      "expiry";

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-neutral-50 sm:px-6"
                    >

                      {/* ICON */}

                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          isPositive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >

                        {isPositive ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}

                      </div>


                      {/* DESCRIPTION */}

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-medium">
                          {isWalletExpiry
                            ? "Wallet Credit Expired"
                            : isDebit
                            ? "Wallet Deduction"
                            : transaction.transaction_type ===
                              "admin_adjustment"
                            ? "Wallet Credit"
                            : "Wallet Adjustment"}
                        </p>

                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {transaction.description ||
                            "Wallet adjustment"}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">

                          <span>
                            {formatDate(
                              transaction.created_at
                            )}
                          </span>

                          <span>
                            •
                          </span>

                          <span className="capitalize">
                            {transaction.transaction_type.replace(
                              /_/g,
                              " "
                            )}
                          </span>

                        </div>


                        {/* EXPIRY */}

                        {transaction.expires_at && (
                          <div className="mt-1.5 flex items-center gap-1 text-[10px]">

                            <CalendarDays className="h-3 w-3 text-[#C8A44D]" />

                            <span
                              className={
                                isExpired
                                  ? "text-red-500"
                                  : "text-muted-foreground"
                              }
                            >
                              {isExpired
                                ? "Expired"
                                : "Expires"}{" "}
                              {formatShortDate(
                                transaction.expires_at
                              )}
                            </span>

                          </div>
                        )}

                      </div>


                      {/* AMOUNT */}

                      <div className="shrink-0 text-right">

                        <p
                          className={`text-sm font-semibold ${
                            isPositive
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {isPositive
                            ? "+"
                            : "-"}
                          {formatCurrency(
                            Math.abs(
                              transaction.amount_paise
                            )
                          )}
                        </p>

                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          Balance{" "}
                          {formatCurrency(
                            transaction.balance_after_paise
                          )}
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}


          {/* =================================================
              VIEW ALL / SHOW RECENT
          ================================================= */}

          {transactions.length > 8 && (
            <div className="border-t px-5 py-3 sm:px-6">

              <button
                type="button"
                onClick={() =>
                  setShowAllTransactions(
                    (current) =>
                      !current
                  )
                }
                className="mx-auto flex items-center gap-1.5 text-xs font-medium text-[#A17D29] transition-colors hover:text-[#80621F]"
              >

                {showAllTransactions ? (
                  <>
                    Show Recent
                    <ChevronUp className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    View All Transactions
                    <ChevronDown className="h-3.5 w-3.5" />
                  </>
                )}

              </button>

            </div>
          )}

        </div>

      </section>


      {/* =====================================================
          DEDUCTION CONFIRMATION MODAL
      ===================================================== */}

      {showDebitConfirmation && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeDebitConfirmation();
            }
          }}
        >

          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-deduction-title"
          >

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b px-5 py-5 sm:px-6">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <div>
                  <h3
                    id="wallet-deduction-title"
                    className="text-base font-semibold"
                  >
                    Confirm Deduction
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    This will immediately reduce the
                    customer's wallet balance.
                  </p>
                </div>

              </div>


              <button
                type="button"
                onClick={
                  closeDebitConfirmation
                }
                disabled={
                  isDebitLoading
                }
                className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

            </div>


            {/* MODAL BODY */}

            <div className="p-5 sm:p-6">

              {/* AMOUNT */}

              <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 text-center">

                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-red-500">
                  Deducting
                </p>

                <p className="mt-1 text-3xl font-semibold tracking-tight text-red-600">
                  -{" "}
                  {formatCurrency(
                    debitAmountPaise
                  )}
                </p>

              </div>


              {/* BALANCE */}

              <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-xl border bg-neutral-50 p-3">

                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Current Balance
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatCurrency(
                      wallet.balance_paise
                    )}
                  </p>

                </div>


                <div className="rounded-xl border bg-neutral-50 p-3">

                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    New Balance
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatCurrency(
                      balanceAfterDebit
                    )}
                  </p>

                </div>

              </div>


              {/* REASON */}

              <div className="mt-4 rounded-xl border bg-white p-3.5">

                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Reason
                </p>

                <p className="mt-1.5 text-sm text-neutral-800">
                  {debitReason.trim()}
                </p>

              </div>


              {/* WARNING */}

              <p className="mt-4 text-center text-[11px] leading-5 text-muted-foreground">
                Please verify the amount and reason
                before confirming this wallet adjustment.
              </p>

            </div>


            {/* MODAL ACTIONS */}

            <div className="flex flex-col-reverse gap-2 border-t bg-neutral-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

              <Button
                type="button"
                variant="outline"
                onClick={
                  closeDebitConfirmation
                }
                disabled={
                  isDebitLoading
                }
                className="h-11 w-full sm:w-auto"
              >
                Cancel
              </Button>


              <Button
                type="button"
                variant="destructive"
                onClick={
                  handleConfirmDeduction
                }
                disabled={
                  isDebitLoading
                }
                className="h-11 w-full sm:w-auto"
              >
                {isDebitLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deducting...
                  </>
                ) : (
                  <>
                    <Minus className="mr-2 h-4 w-4" />
                    Confirm Deduction
                  </>
                )}
              </Button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}