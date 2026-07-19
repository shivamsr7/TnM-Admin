import type { ReactNode } from "react";

export interface Column<T extends object> {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
}

export default function DataTable<T extends object>({
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-4 py-3 text-left text-sm font-semibold"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-10 text-center text-gray-500"
              >
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                {columns.map((column) => {
                  const value = row[column.key];

                  return (
                    <td
                      key={String(column.key)}
                      className="px-4 py-4 align-middle"
                    >
                      {column.render
                        ? column.render(value, row)
                        : String(value ?? "-")}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}