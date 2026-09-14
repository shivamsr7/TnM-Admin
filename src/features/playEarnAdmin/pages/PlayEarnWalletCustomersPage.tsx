import { useEffect, useMemo, useState } from "react";
import {
  Ban,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Gift,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  WalletCards,
  X,
} from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import { customerService } from "@/features/customers/services/customer.service";
import {
  playEarnWalletAdminService,
  type PlayEarnWallet,
  type PlayEarnWalletCreditLot,
  type PlayEarnWalletTransaction,
} from "../services/playEarnWalletAdmin.service";

interface Customer {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
}

interface WalletCustomer extends Customer {
  wallet: PlayEarnWallet | null;
}

const money = (paise: number) =>
  `₹${(Number(paise || 0) / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const dateTime = (value: string | null) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No expiry";

const dateOnly = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No expiry";

const customerName = (customer: Customer) =>
  [customer.first_name, customer.last_name].filter(Boolean).join(" ") ||
  "Unnamed customer";

export default function PlayEarnWalletCustomersPage() {
  const [customers, setCustomers] = useState<WalletCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">(
    "all"
  );
  const [selected, setSelected] = useState<WalletCustomer | null>(null);
  const [transactions, setTransactions] = useState<PlayEarnWalletTransaction[]>([]);
  const [lots, setLots] = useState<PlayEarnWalletCreditLot[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [creditOpen, setCreditOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditReason, setCreditReason] = useState("");
  const [creditExpiry, setCreditExpiry] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async (showRefresh = false) => {
    setError("");
    showRefresh ? setRefreshing(true) : setLoading(true);

    try {
      const list = await customerService.getAll();
      const wallets = await playEarnWalletAdminService.getWallets(
        list.map((customer) => customer.id)
      );

      setCustomers(
        list.map((customer) => ({
          ...(customer as Customer),
          wallet: wallets[customer.id] ?? null,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load wallets.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !query ||
        customerName(customer).toLowerCase().includes(query) ||
        String(customer.phone ?? "").toLowerCase().includes(query) ||
        String(customer.email ?? "").toLowerCase().includes(query);

      const walletStatus = customer.wallet?.status ?? "active";
      const matchesStatus =
        statusFilter === "all" || walletStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const totals = useMemo(() => {
    const activeWallets = customers.filter(
      (customer) => customer.wallet?.status === "active"
    ).length;
    const blockedWallets = customers.filter(
      (customer) => customer.wallet?.status === "blocked"
    ).length;
    const balance = customers.reduce(
      (sum, customer) => sum + Number(customer.wallet?.balance_paise ?? 0),
      0
    );

    return {
      customers: customers.length,
      activeWallets,
      blockedWallets,
      balance,
    };
  }, [customers]);

  const openDetails = async (customer: WalletCustomer) => {
    setSelected(customer);
    setDetailLoading(true);
    setError("");

    try {
      const [txns, creditLots] = await Promise.all([
        playEarnWalletAdminService.getTransactions(customer.id),
        playEarnWalletAdminService.getCreditLots(customer.id),
      ]);
      setTransactions(txns);
      setLots(creditLots);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load wallet details."
      );
      setTransactions([]);
      setLots([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const refreshSelected = async (customerId: string) => {
    const wallet = await playEarnWalletAdminService.getWallet(customerId);

    setCustomers((current) =>
      current.map((customer) =>
        customer.id === customerId ? { ...customer, wallet } : customer
      )
    );

    setSelected((current) =>
      current?.id === customerId ? { ...current, wallet } : current
    );
  };

  const handleStatus = async () => {
    if (!selected) return;

    const nextStatus = selected.wallet?.status === "blocked" ? "active" : "blocked";

    if (
      !window.confirm(
        `${nextStatus === "blocked" ? "Block" : "Unblock"} Play & Earn wallet for ${customerName(selected)}?`
      )
    ) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      await playEarnWalletAdminService.setStatus(selected.id, nextStatus);
      await refreshSelected(selected.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update wallet.");
    } finally {
      setSaving(false);
    }
  };

  const handleCredit = async () => {
    if (!selected) return;

    const amount = Number(creditAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid credit amount.");
      return;
    }

    if (!creditReason.trim()) {
      setError("Please enter a reason for the credit.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await playEarnWalletAdminService.creditWallet(
        selected.id,
        amount,
        creditReason,
        creditExpiry ? new Date(`${creditExpiry}T23:59:59`).toISOString() : null
      );

      await refreshSelected(selected.id);
      setCreditOpen(false);
      setCreditAmount("");
      setCreditReason("");
      setCreditExpiry("");

      const [txns, creditLots] = await Promise.all([
        playEarnWalletAdminService.getTransactions(selected.id),
        playEarnWalletAdminService.getCreditLots(selected.id),
      ]);
      setTransactions(txns);
      setLots(creditLots);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to credit wallet.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Play & Earn Wallets"
        subtitle="Manage customer Play & Earn balances, wallet status, rewards and expiry."
        action={
          <button
            type="button"
            onClick={() => void load(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Customers"
          value={totals.customers.toLocaleString("en-IN")}
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <StatCard
          label="Active Wallets"
          value={totals.activeWallets.toLocaleString("en-IN")}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Blocked Wallets"
          value={totals.blockedWallets.toLocaleString("en-IN")}
          icon={<Ban className="h-5 w-5" />}
        />
        <StatCard
          label="Total Balance"
          value={money(totals.balance)}
          icon={<WalletCards className="h-5 w-5" />}
        />
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <X className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, phone or email..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1">
            {(["all", "active", "blocked"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold capitalize transition ${
                  statusFilter === status
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
            <WalletCards className="mb-3 h-10 w-10 text-slate-300" />
            <p className="font-semibold text-slate-800">No customers found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different name, phone number, email or wallet filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredCustomers.map((customer) => {
              const wallet = customer.wallet;
              const blocked = wallet?.status === "blocked";

              return (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => void openDetails(customer)}
                  className="group flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-slate-50 sm:px-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                    {customerName(customer).charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-slate-900">
                        {customerName(customer)}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          blocked
                            ? "bg-red-50 text-red-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {blocked ? "Blocked" : "Active"}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {customer.phone || customer.email || "No contact details"}
                    </p>
                  </div>

                  <div className="hidden text-right sm:block">
                    <p className="text-xs font-medium text-slate-400">
                      Play & Earn Balance
                    </p>
                    <p className="mt-1 text-base font-bold text-slate-900">
                      {money(wallet?.balance_paise ?? 0)}
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Play & Earn Wallet
                </p>
                <h2 className="mt-1 truncate text-xl font-bold text-slate-900">
                  {customerName(selected)}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selected.phone || selected.email || "No contact details"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                <div className="rounded-2xl bg-slate-900 p-5 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-300">Available Balance</p>
                      <p className="mt-2 text-3xl font-bold">
                        {money(selected.wallet?.balance_paise ?? 0)}
                      </p>
                    </div>
                    <WalletCards className="h-7 w-7 text-slate-300" />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setCreditOpen(true)}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100 disabled:opacity-60"
                    >
                      <Gift className="h-4 w-4" />
                      Credit Reward
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleStatus()}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : selected.wallet?.status === "blocked" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Ban className="h-4 w-4" />
                      )}
                      {selected.wallet?.status === "blocked" ? "Unblock" : "Block"} Wallet
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-slate-500" />
                    <p className="text-sm font-bold text-slate-800">Wallet Status</p>
                  </div>
                  <p
                    className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                      selected.wallet?.status === "blocked"
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {selected.wallet?.status === "blocked" ? "Blocked" : "Active"}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Created</p>
                      <p className="mt-1 font-semibold text-slate-700">
                        {dateOnly(selected.wallet?.created_at ?? null)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Updated</p>
                      <p className="mt-1 font-semibold text-slate-700">
                        {dateOnly(selected.wallet?.updated_at ?? null)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {creditOpen && (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">Credit Reward</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Add balance to this Play & Earn wallet.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCreditOpen(false)}
                      className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <Field
                      label="Amount (₹)"
                      value={creditAmount}
                      onChange={setCreditAmount}
                      placeholder="50"
                      type="number"
                    />
                    <Field
                      label="Reason"
                      value={creditReason}
                      onChange={setCreditReason}
                      placeholder="Manual reward"
                    />
                    <Field
                      label="Expiry"
                      value={creditExpiry}
                      onChange={setCreditExpiry}
                      type="date"
                    />
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => void handleCredit()}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                      {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                      Add Credit
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">Credit Lots</h3>
                      <p className="text-xs text-slate-500">
                        Reward credits and their remaining expiry value.
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                      {lots.length}
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    {detailLoading ? (
                      <div className="flex h-32 items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                      </div>
                    ) : lots.length === 0 ? (
                      <div className="p-6 text-center text-sm text-slate-500">
                        No credit lots yet.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {lots.map((lot) => (
                          <div key={lot.id} className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-slate-800">
                                  {money(lot.remaining_amount_paise)} remaining
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Original {money(lot.original_amount_paise)}
                                </p>
                              </div>
                              <span
                                className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                                  lot.status === "active"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : lot.status === "expired"
                                      ? "bg-red-50 text-red-600"
                                      : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {lot.status}
                              </span>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                              <Clock3 className="h-3.5 w-3.5" />
                              {dateTime(lot.expires_at)}
                            </div>
                            {lot.description && (
                              <p className="mt-2 text-xs text-slate-500">
                                {lot.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">Transactions</h3>
                      <p className="text-xs text-slate-500">
                        Complete Play & Earn wallet activity.
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                      {transactions.length}
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    {detailLoading ? (
                      <div className="flex h-32 items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="p-6 text-center text-sm text-slate-500">
                        No transactions yet.
                      </div>
                    ) : (
                      <div className="max-h-[390px] divide-y divide-slate-100 overflow-y-auto">
                        {transactions.map((transaction) => {
                          const positive =
                            transaction.transaction_type === "credit" ||
                            transaction.transaction_type === "admin_adjustment";

                          return (
                            <div key={transaction.id} className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="font-semibold capitalize text-slate-800">
                                    {transaction.transaction_type.replaceAll(
                                      "_",
                                      " "
                                    )}
                                  </p>
                                  <p className="mt-1 truncate text-xs text-slate-500">
                                    {transaction.description || "Wallet transaction"}
                                  </p>
                                </div>
                                <p
                                  className={`shrink-0 font-bold ${
                                    positive ? "text-emerald-600" : "text-red-600"
                                  }`}
                                >
                                  {positive ? "+" : "-"}
                                  {money(transaction.amount_paise)}
                                </p>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">
                                <span>{dateTime(transaction.created_at)}</span>
                                <span>
                                  Balance {money(transaction.balance_after_paise)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className="rounded-xl bg-slate-100 p-2 text-slate-500">{icon}</span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        step={type === "number" ? "0.01" : undefined}
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
      />
    </label>
  );
}
