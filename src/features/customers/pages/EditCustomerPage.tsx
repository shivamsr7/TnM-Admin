// src/features/customers/pages/EditCustomerPage.tsx

import { useParams } from "react-router-dom";

import CustomerForm from "../components/forms/CustomerForm";

export default function EditCustomerPage() {
  const { id } = useParams();

  if (!id) return null;

  return (
    <CustomerForm
      mode="edit"
      customerId={id}
    />
  );
}