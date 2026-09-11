import { useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Check,
  Loader2,
  Percent,
  Save,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

import {
  useUpdateWalletSettings,
  useWalletSettings,
} from "../hooks/useWalletSettings";
import type { WalletSettingsUpdate } from "../services/walletSettings.service";

function paiseToRupees(paise: number) {
  return (Number(paise || 0) / 100).toString();
}

function rupeesToPaise(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }

  return Math.round(amount * 100);
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
  help,
  min = 0,
  step = "0.01",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  help?: string;
  min?: number;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium">
        {label}
      </label>

      <div className="relative">
        {suffix === "₹" && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            ₹
          </span>
        )}

        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`h-11 w-full rounded-lg border bg-white text-sm outline-none transition focus:border-[#C8A44D] focus:ring-2 focus:ring-[#C8A44D]/10 ${
            suffix === "₹" ? "pl-8 pr-3" : "px-3"
          }`}
        />

        {suffix && suffix !== "₹" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>

      {help && (
        <p className="mt-1.5 text-[10px] text-muted-foreground">
          {help}
        </p>
      )}
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5 ${
        disabled
          ? "bg-neutral-50 opacity-60"
          : "bg-white"
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">
          {title}
        </p>
        <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-[#C8A44D]"
            : "bg-neutral-300"
        } disabled:cursor-not-allowed`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

const defaultForm: WalletSettingsUpdate = {
  enabled: true,
  max_balance_paise: 5000000,
  min_order_value_paise: 0,
  min_redemption_paise: 10000,
  max_redemption_percentage: 50,
  max_redemption_per_order_paise: 200000,
  allow_with_coupon: true,
  allow_on_regular_price: true,
  allow_on_sale_price: true,
  allow_on_special_offer: false,
  allow_on_clearance: false,
  allow_cash_withdrawal: false,
  allow_transfer: false,
  refund_credit_expiry_days: 365,
  cashback_expiry_days: 180,
  referral_expiry_days: 180,
  promotional_expiry_days: 90,
};

export default function WalletSettingsPage() {
  const settingsQuery = useWalletSettings();
  const updateMutation = useUpdateWalletSettings();

  const [form, setForm] =
    useState<WalletSettingsUpdate>(defaultForm);

  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!settingsQuery.data) {
      return;
    }

    const settings = settingsQuery.data;

    setForm({
      enabled: settings.enabled,
      max_balance_paise: settings.max_balance_paise,
      min_order_value_paise:
        settings.min_order_value_paise,
      min_redemption_paise:
        settings.min_redemption_paise,
      max_redemption_percentage:
        settings.max_redemption_percentage,
      max_redemption_per_order_paise:
        settings.max_redemption_per_order_paise,
      allow_with_coupon:
        settings.allow_with_coupon,
      allow_on_regular_price:
        settings.allow_on_regular_price,
      allow_on_sale_price:
        settings.allow_on_sale_price,
      allow_on_special_offer:
        settings.allow_on_special_offer,
      allow_on_clearance:
        settings.allow_on_clearance,
      allow_cash_withdrawal:
        settings.allow_cash_withdrawal,
      allow_transfer:
        settings.allow_transfer,
      refund_credit_expiry_days:
        settings.refund_credit_expiry_days,
      cashback_expiry_days:
        settings.cashback_expiry_days,
      referral_expiry_days:
        settings.referral_expiry_days,
      promotional_expiry_days:
        settings.promotional_expiry_days,
    });

    setDirty(false);
  }, [settingsQuery.data]);

  function updateField<K extends keyof WalletSettingsUpdate>(
    key: K,
    value: WalletSettingsUpdate[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setDirty(true);
  }

  async function handleSave() {
    if (form.max_redemption_percentage < 0 ||
        form.max_redemption_percentage > 100) {
      toast.error(
        "Maximum redemption percentage must be between 0 and 100."
      );
      return;
    }

    try {
      await updateMutation.mutateAsync(form);
      setDirty(false);
      toast.success("Wallet settings saved successfully.");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save wallet settings."
      );
    }
  }

  if (settingsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Wallet Settings"
          subtitle="Configure how T&M Wallet works across your store."
        />

        <section className="flex min-h-[300px] items-center justify-center rounded-xl border bg-white shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading wallet settings...
          </div>
        </section>
      </div>
    );
  }

  if (settingsQuery.isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Wallet Settings"
          subtitle="Configure how T&M Wallet works across your store."
        />

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">
                Unable to load wallet settings
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {settingsQuery.error instanceof Error
                  ? settingsQuery.error.message
                  : "Please try again."}
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        title="Wallet Settings"
        subtitle="Configure how T&M Wallet works across your store."
      />

      {/* STATUS */}

      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8A44D]/10 text-[#C8A44D]">
              <Wallet className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold">
                Wallet Status
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Control whether customers can use their wallet.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <ToggleRow
            title="Enable Wallet"
            description="When disabled, wallet redemption will not be available during checkout."
            checked={form.enabled}
            onChange={(value) =>
              updateField("enabled", value)
            }
          />
        </div>
      </section>

      {/* REDEMPTION */}

      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
              <Percent className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold">
                Redemption Rules
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Define how much wallet balance can be used on an order.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
          <NumberField
            label="Maximum Wallet Balance"
            value={paiseToRupees(form.max_balance_paise)}
            suffix="₹"
            onChange={(value) =>
              updateField(
                "max_balance_paise",
                rupeesToPaise(value)
              )
            }
            help="Maximum balance a customer wallet can hold."
          />

          <NumberField
            label="Minimum Order Value"
            value={paiseToRupees(form.min_order_value_paise)}
            suffix="₹"
            onChange={(value) =>
              updateField(
                "min_order_value_paise",
                rupeesToPaise(value)
              )
            }
            help="Minimum order value required before wallet can be used."
          />

          <NumberField
            label="Minimum Wallet Redemption"
            value={paiseToRupees(form.min_redemption_paise)}
            suffix="₹"
            onChange={(value) =>
              updateField(
                "min_redemption_paise",
                rupeesToPaise(value)
              )
            }
            help="Minimum wallet amount required for redemption."
          />

          <NumberField
            label="Maximum Redemption"
            value={String(form.max_redemption_percentage)}
            suffix="%"
            step="0.01"
            onChange={(value) =>
              updateField(
                "max_redemption_percentage",
                Number(value) || 0
              )
            }
            help="Maximum percentage of eligible order value payable by wallet."
          />

          <NumberField
            label="Maximum Redemption Per Order"
            value={paiseToRupees(
              form.max_redemption_per_order_paise
            )}
            suffix="₹"
            onChange={(value) =>
              updateField(
                "max_redemption_per_order_paise",
                rupeesToPaise(value)
              )
            }
            help="Absolute maximum wallet amount that can be used on one order."
          />
        </div>
      </section>

      {/* USAGE */}

      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-base font-semibold">
            Where Wallet Can Be Used
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Choose which order and product conditions allow wallet redemption.
          </p>
        </div>

        <div className="grid gap-3 p-5 sm:p-6 md:grid-cols-2">
          <ToggleRow
            title="Allow With Coupon"
            description="Allow wallet redemption when a coupon is applied."
            checked={form.allow_with_coupon}
            onChange={(value) =>
              updateField("allow_with_coupon", value)
            }
          />

          <ToggleRow
            title="Regular Price Products"
            description="Allow wallet redemption on regular-price products."
            checked={form.allow_on_regular_price}
            onChange={(value) =>
              updateField(
                "allow_on_regular_price",
                value
              )
            }
          />

          <ToggleRow
            title="Sale Price Products"
            description="Allow wallet redemption on sale-price products."
            checked={form.allow_on_sale_price}
            onChange={(value) =>
              updateField(
                "allow_on_sale_price",
                value
              )
            }
          />

          <ToggleRow
            title="Special Offer Products"
            description="Allow wallet redemption on active Special Offer products."
            checked={form.allow_on_special_offer}
            onChange={(value) =>
              updateField(
                "allow_on_special_offer",
                value
              )
            }
          />

          <ToggleRow
            title="Clearance Products"
            description="Allow wallet redemption on clearance products."
            checked={form.allow_on_clearance}
            onChange={(value) =>
              updateField(
                "allow_on_clearance",
                value
              )
            }
          />

          <ToggleRow
            title="Cash Withdrawal"
            description="Allow customers to withdraw wallet balance as cash."
            checked={form.allow_cash_withdrawal}
            onChange={(value) =>
              updateField(
                "allow_cash_withdrawal",
                value
              )
            }
          />

          <ToggleRow
            title="Wallet Transfer"
            description="Allow customers to transfer wallet balance."
            checked={form.allow_transfer}
            onChange={(value) =>
              updateField("allow_transfer", value)
            }
          />
        </div>
      </section>

      {/* EXPIRY */}

      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold">
                Credit Expiry
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Set the default validity period for different wallet credit types.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
          <NumberField
            label="Refund Credit"
            value={String(form.refund_credit_expiry_days)}
            suffix="days"
            step="1"
            onChange={(value) =>
              updateField(
                "refund_credit_expiry_days",
                Math.max(0, Math.floor(Number(value) || 0))
              )
            }
          />

          <NumberField
            label="Cashback Credit"
            value={String(form.cashback_expiry_days)}
            suffix="days"
            step="1"
            onChange={(value) =>
              updateField(
                "cashback_expiry_days",
                Math.max(0, Math.floor(Number(value) || 0))
              )
            }
          />

          <NumberField
            label="Referral Credit"
            value={String(form.referral_expiry_days)}
            suffix="days"
            step="1"
            onChange={(value) =>
              updateField(
                "referral_expiry_days",
                Math.max(0, Math.floor(Number(value) || 0))
              )
            }
          />

          <NumberField
            label="Promotional Credit"
            value={String(form.promotional_expiry_days)}
            suffix="days"
            step="1"
            onChange={(value) =>
              updateField(
                "promotional_expiry_days",
                Math.max(0, Math.floor(Number(value) || 0))
              )
            }
          />
        </div>
      </section>

      {/* SAVE BAR */}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {dirty ? (
              <>
                <span className="h-2 w-2 rounded-full bg-[#C8A44D]" />
                <span className="text-xs text-muted-foreground">
                  Unsaved changes
                </span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-xs text-muted-foreground">
                  All changes saved
                </span>
              </>
            )}
          </div>

          <Button
            type="button"
            onClick={handleSave}
            disabled={
              !dirty || updateMutation.isPending
            }
            className="h-10 bg-[#C8A44D] px-5 text-black hover:bg-[#D7B65D] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
