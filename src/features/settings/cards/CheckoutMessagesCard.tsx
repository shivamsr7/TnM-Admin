import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import SettingCard from "../components/SettingCard";
import { useSettingsContext } from "../context/SettingsContext";

export default function CheckoutMessagesCard() {
  const { form } = useSettingsContext();

  return (
    <SettingCard
      title="Checkout Messages"
      description="Customize the messages shown to customers after payment."
    >
      <div className="space-y-6">
        {/* Success Message */}
        <div className="space-y-2">
          <Label htmlFor="paymentSuccessMessage">
            Payment Success Message
          </Label>

          <Textarea
            id="paymentSuccessMessage"
            rows={4}
            placeholder="Thank you! Your payment was successful and your order has been placed."
            {...form.register("paymentSuccessMessage")}
          />

          <p className="text-xs text-slate-500">
            Displayed after a successful payment.
          </p>
        </div>

        {/* Failure Message */}
        <div className="space-y-2">
          <Label htmlFor="paymentFailureMessage">
            Payment Failure Message
          </Label>

          <Textarea
            id="paymentFailureMessage"
            rows={4}
            placeholder="Payment failed. Please try again or choose another payment method."
            {...form.register("paymentFailureMessage")}
          />

          <p className="text-xs text-slate-500">
            Displayed when a payment is unsuccessful.
          </p>
        </div>
      </div>
    </SettingCard>
  );
}