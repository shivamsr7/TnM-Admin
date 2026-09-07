import { supabase } from "@/lib/supabase";
import { notificationService } from "@/features/notifications/services/notification.service";

export interface Wallet {
  id: string;
  customer_id: string;
  balance_paise: number;
  currency: string;
  status: "active" | "blocked";
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  transaction_type:
    | "credit"
    | "debit"
    | "refund"
    | "reward"
    | "referral"
    | "admin_adjustment"
    | "expiry";
  amount_paise: number;
  balance_before_paise: number;
  balance_after_paise: number;
  reference_type: string | null;
  reference_id: string | null;
  description: string | null;
  expires_at: string | null;
  created_at: string;
}

class WalletService {
  /**
   * Get or create a customer's wallet.
   * Admin authorization is handled inside the RPC.
   */
  async getCustomerWallet(customerId: string): Promise<Wallet> {
    const { data, error } = await supabase.rpc(
      "admin_get_customer_wallet",
      {
        p_customer_id: customerId,
      }
    );

    if (error) {
      throw error;
    }

    return data as Wallet;
  }

  /**
   * Get customer's wallet transaction history.
   */
  async getCustomerTransactions(
    customerId: string
  ): Promise<WalletTransaction[]> {
    const { data, error } = await supabase.rpc(
      "admin_get_wallet_transactions",
      {
        p_customer_id: customerId,
      }
    );

    if (error) {
      throw error;
    }

    return (data ?? []) as WalletTransaction[];
  }

  /**
   * Add admin credit to customer's wallet.
   *
   * Amount is supplied in rupees from the UI
   * and converted to paise here.
   */
  async addCredit(
    customerId: string,
    amountRupees: number,
    reason: string,
    expiresAt?: string | null
  ): Promise<Wallet> {
    if (!Number.isFinite(amountRupees) || amountRupees <= 0) {
      throw new Error("Credit amount must be greater than zero.");
    }

    const amountPaise = Math.round(amountRupees * 100);

    const { data, error } = await supabase.rpc(
      "admin_credit_wallet",
      {
        p_customer_id: customerId,
        p_amount_paise: amountPaise,
        p_reason: reason.trim(),
        p_expires_at: expiresAt || null,
      }
    );

    if (error) {
      throw error;
    }

    const wallet = data as Wallet;

    // The wallet credit is already committed at this point.
    // Email delivery must never make the successful wallet credit fail.
    try {
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("email, first_name, last_name")
        .eq("id", customerId)
        .maybeSingle();

      if (customerError) {
        console.error(
          "⚠️ Wallet credit succeeded, but customer lookup for email failed:",
          customerError
        );
      } else if (customer?.email) {
        const customerName =
          [customer.first_name, customer.last_name]
            .filter(Boolean)
            .join(" ") || "there";

        await notificationService.sendWalletCreditEmail({
          to: customer.email,
          customerName,
          amount: amountPaise / 100,
          newBalance: Number(wallet.balance_paise) / 100,
          reason: reason.trim() || null,
          expiresAt: expiresAt || null,
        });
      } else {
        console.warn(
          "⚠️ Wallet credit succeeded, but customer email is missing:",
          customerId
        );
      }
    } catch (emailError) {
      console.error(
        "⚠️ Wallet credit succeeded, but wallet credit email failed:",
        emailError
      );
    }

    return wallet;
  }

  /**
   * Deduct admin credit from customer's wallet.
   */
  async deductCredit(
    customerId: string,
    amountRupees: number,
    reason: string
  ): Promise<Wallet> {
    if (!Number.isFinite(amountRupees) || amountRupees <= 0) {
      throw new Error("Deduction amount must be greater than zero.");
    }

    const amountPaise = Math.round(amountRupees * 100);

    const { data, error } = await supabase.rpc(
      "admin_debit_wallet",
      {
        p_customer_id: customerId,
        p_amount_paise: amountPaise,
        p_reason: reason.trim(),
      }
    );

    if (error) {
      throw error;
    }

    return data as Wallet;
  }
}

export const walletService = new WalletService();