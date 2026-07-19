import { Link } from "react-router-dom";
import { Pencil, Trash2, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import DeleteDialog from "@/shared/components/dialogs/DeleteDialog";
import type { Brand } from "../types/brand.types";
import EmptyState from "@/components/shared/EmptyState";
import { Tag } from "lucide-react";
interface Props {
  brands: Brand[];
  onDelete: (brand: Brand) => void;
}

export default function BrandsTable({
  brands,
  onDelete,
}: Props) {
if (brands.length === 0) {
  return (
    <EmptyState
      icon={<Tag className="h-8 w-8 text-gray-400" />}
      title="No brands found"
      description="Create your first brand to organize your products."
    />
  );
}

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="w-full">
        <thead className="bg-muted/40">
          <tr>
            <th className="p-4 text-left">Brand</th>
            <th className="p-4 text-left">Website</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {brands.map((brand) => (
            <tr
              key={brand.id}
              className="border-t"
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="h-10 w-10 rounded-lg border object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-semibold">
                      {brand.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <p className="font-medium">
                      {brand.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {brand.slug}
                    </p>
                  </div>
                </div>
              </td>

              <td className="p-4">
                {brand.website ? (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Globe size={15} />
                    Website
                  </a>
                ) : (
                  "-"
                )}
              </td>

              <td className="p-4 text-center">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    brand.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {brand.is_active
                    ? "Active"
                    : "Inactive"}
                </span>
              </td>

              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                  >
                    <Link
                      to={`/brands/${brand.id}/edit`}
                    >
                      <Pencil size={16} />
                    </Link>
                  </Button>

                  <DeleteDialog
  title="Delete Brand"
  description={`Are you sure you want to delete "${brand.name}"? This action cannot be undone.`}
  onConfirm={() => onDelete(brand)}
  trigger={
    <Button
      variant="outline"
      size="icon"
    >
      <Trash2 size={16} />
    </Button>
  }
/>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}