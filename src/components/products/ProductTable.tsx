import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export default function ProductTable() {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Image</th>
            <th className="px-4 py-3 text-left">Product</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Price</th>
            <th className="px-4 py-3 text-left">Stock</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="px-4 py-4">
              <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
            </td>

            <td className="px-4 py-4 font-medium">
              No Products Yet
            </td>

            <td className="px-4 py-4">-</td>

            <td className="px-4 py-4">₹0</td>

            <td className="px-4 py-4">0</td>

            <td className="px-4 py-4">
              <span className="rounded-full bg-gray-200 px-3 py-1 text-xs">
                Empty
              </span>
            </td>

            <td className="px-4 py-4">
              <div className="flex justify-center gap-2">
                <Button size="icon" variant="outline">
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button size="icon" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}