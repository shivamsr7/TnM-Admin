import { useEffect, useState } from "react";
import { Check, Loader2, Save, ShieldCheck, WalletCards } from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import { supabase } from "@/lib/supabase";

interface CheckoutSettings {
  id: boolean;
  redemption_enabled: boolean;
  minimum_order_value_paise: number;
  maximum_redemption_paise: number | null;
  maximum_redemption_percent: number | null;
  minimum_wallet_balance_paise: number;
  allow_on_sale_products: boolean;
  allow_on_discounted_products: boolean;
  allow_with_coupon: boolean;
  allow_with_regular_wallet: boolean;
  allow_shipping_charges: boolean;
  allow_cod: boolean;
  allow_online_payment: boolean;
  daily_redemption_limit_paise: number | null;
  monthly_redemption_limit_paise: number | null;
}

const toRupees = (paise: number | null) =>
  paise == null ? "" : String(Number(paise) / 100);

const toPaise = (value: string) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.round(number * 100);
};

export default function PlayEarnCheckoutSettingsPage() {
  const [settings, setSettings] = useState<CheckoutSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const loadSettings = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: rpcError } = await supabase
        .from("play_earn_checkout_settings")
        .select("*")
        .eq("id", true)
        .maybeSingle();

      if (rpcError) throw rpcError;

      if (!data) {
        throw new Error(
          "Play & Earn checkout settings were not found. Run the checkout settings SQL first."
        );
      }

      setSettings(data as CheckoutSettings);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load checkout settings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSettings();
  }, []);

  const update = <K extends keyof CheckoutSettings>(
    key: K,
    value: CheckoutSettings[K]
  ) => {
    setSaved(false);
    setSettings((current) =>
      current ? { ...current, [key]: value } : current
    );
  };

  const saveSettings = async () => {
    if (!settings) return;

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const { error: rpcError } = await supabase.rpc(
        "admin_update_play_earn_checkout_settings",
        {
          p_redemption_enabled: settings.redemption_enabled,
          p_minimum_order_value_paise: settings.minimum_order_value_paise,
          p_maximum_redemption_paise: settings.maximum_redemption_paise,
          p_maximum_redemption_percent: settings.maximum_redemption_percent,
          p_minimum_wallet_balance_paise:
            settings.minimum_wallet_balance_paise,
          p_allow_on_sale_products: settings.allow_on_sale_products,
          p_allow_on_discounted_products:
            settings.allow_on_discounted_products,
          p_allow_with_coupon: settings.allow_with_coupon,
          p_allow_with_regular_wallet: settings.allow_with_regular_wallet,
          p_allow_shipping_charges: settings.allow_shipping_charges,
          p_allow_cod: settings.allow_cod,
          p_allow_online_payment: settings.allow_online_payment,
          p_daily_redemption_limit_paise:
            settings.daily_redemption_limit_paise,
          p_monthly_redemption_limit_paise:
            settings.monthly_redemption_limit_paise,
        }
      );

      if (rpcError) throw rpcError;

      setSaved(true);
      await loadSettings();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save checkout settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Checkout Settings"
          subtitle="Control when Play & Earn wallet balance can be used at checkout."
        />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error || "Settings could not be loaded."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Checkout Settings"
        subtitle="Control how Play & Earn wallet balance can be redeemed during checkout."
        action={
          <button
            type="button"
            onClick={() => void saveSettings()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <Check className="h-4 w-4" />
          Checkout settings saved successfully.
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={<WalletCards className="h-5 w-5" />}
          title="Wallet Redemption"
          description="The main switch and amount limits for Play & Earn wallet usage."
        />

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Toggle
            label="Wallet Redemption"
            description="Allow customers to use Play & Earn balance at checkout."
            checked={settings.redemption_enabled}
            onChange={(value) => update("redemption_enabled", value)}
          />

          <MoneyInput
            label="Minimum Order Value"
            value={toRupees(settings.minimum_order_value_paise)}
            onChange={(value) =>
              update(
                "minimum_order_value_paise",
                toPaise(value) ?? 0
              )
            }
            placeholder="499"
          />

          <MoneyInput
            label="Maximum Wallet Amount / Order"
            value={toRupees(settings.maximum_redemption_paise)}
            onChange={(value) =>
              update("maximum_redemption_paise", toPaise(value))
            }
            placeholder="100"
            optional
          />

          <NumberInput
            label="Maximum Wallet % / Order"
            value={
              settings.maximum_redemption_percent == null
                ? ""
                : String(settings.maximum_redemption_percent)
            }
            onChange={(value) =>
              update(
                "maximum_redemption_percent",
                value.trim() === "" ? null : Number(value)
              )
            }
            placeholder="20"
            suffix="%"
            optional
          />

          <MoneyInput
            label="Minimum Wallet Balance"
            value={toRupees(settings.minimum_wallet_balance_paise)}
            onChange={(value) =>
              update(
                "minimum_wallet_balance_paise",
                toPaise(value) ?? 0
              )
            }
            placeholder="10"
          />

          <MoneyInput
            label="Daily Redemption Limit"
            value={toRupees(settings.daily_redemption_limit_paise)}
            onChange={(value) =>
              update("daily_redemption_limit_paise", toPaise(value))
            }
            placeholder="500"
            optional
          />

          <MoneyInput
            label="Monthly Redemption Limit"
            value={toRupees(settings.monthly_redemption_limit_paise)}
            onChange={(value) =>
              update("monthly_redemption_limit_paise", toPaise(value))
            }
            placeholder="2000"
            optional
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Product & Discount Rules"
          description="Choose which order conditions can use Play & Earn balance."
        />

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Toggle
            label="Sale Products"
            description="Allow redemption when sale products are in the order."
            checked={settings.allow_on_sale_products}
            onChange={(value) => update("allow_on_sale_products", value)}
          />
          <Toggle
            label="Discounted Products"
            description="Allow redemption when discounted products are in the order."
            checked={settings.allow_on_discounted_products}
            onChange={(value) =>
              update("allow_on_discounted_products", value)
            }
          />
          <Toggle
            label="With Coupon"
            description="Allow Play & Earn wallet redemption together with a coupon."
            checked={settings.allow_with_coupon}
            onChange={(value) => update("allow_with_coupon", value)}
          />
          <Toggle
            label="With Regular Wallet"
            description="Allow both wallet systems to be used in the same order."
            checked={settings.allow_with_regular_wallet}
            onChange={(value) =>
              update("allow_with_regular_wallet", value)
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Payment & Charges"
          description="Control which payment methods and order charges can be covered."
        />

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Toggle
            label="Shipping Charges"
            description="Allow Play & Earn balance to pay shipping charges."
            checked={settings.allow_shipping_charges}
            onChange={(value) => update("allow_shipping_charges", value)}
          />
          <Toggle
            label="COD Orders"
            description="Allow Play & Earn balance on Cash on Delivery orders."
            checked={settings.allow_cod}
            onChange={(value) => update("allow_cod", value)}
          />
          <Toggle
            label="Online Payment Orders"
            description="Allow Play & Earn balance on prepaid orders."
            checked={settings.allow_online_payment}
            onChange={(value) => update("allow_online_payment", value)}
          />
        </div>
      </section>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
        <strong>Important:</strong> These settings should be enforced by the
        checkout RPC/server-side calculation as well as the UI. Hiding or
        disabling the wallet option in the frontend alone is not sufficient.
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        {icon}
      </div>
      <div>
        <h2 className="font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-slate-900" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </label>
  );
}

function MoneyInput({
  label,
  value,
  onChange,
  placeholder,
  optional,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  optional?: boolean;
}) {
  return (
    <NumberInput
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      prefix="₹"
      optional={optional}
    />
  );
}

function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  optional,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-slate-600">
        {label}
        {optional && (
          <span className="font-normal text-slate-400">(optional)</span>
        )}
      </span>

      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {prefix}
          </span>
        )}
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white ${
            prefix ? "pl-8" : "pl-3"
          } ${suffix ? "pr-9" : "pr-3"}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}
