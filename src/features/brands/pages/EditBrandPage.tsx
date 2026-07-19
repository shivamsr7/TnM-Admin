import { Navigate, useParams } from "react-router-dom";

import BrandForm from "../components/BrandForm";
import { useBrand } from "../hooks/useBrands";

export default function EditBrandPage() {
  const { id } = useParams();

  const { data: brand, isLoading } = useBrand(id);

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!brand) {
    return <Navigate to="/admin/brands" replace />;
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <BrandForm brand={brand} />
    </div>
  );
}