import SettingSection from "../components/SettingSection";

import PaymentMethodsCard from "../cards/PaymentMethodsCard";
import RazorpayCard from "../cards/RazorpayCard";
import CheckoutMessagesCard from "../cards/CheckoutMessagesCard";

export default function PaymentSection() {
  return (
    <SettingSection
      title="Payments"
      description="Manage payment gateways and checkout configuration."
    >
      <div className="space-y-8">
        <PaymentMethodsCard />
        <RazorpayCard />
        <CheckoutMessagesCard />
      </div>
    </SettingSection>
  );
}