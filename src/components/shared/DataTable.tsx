import React from "react";

export interface Column<T extends object> {
  key: keyof T;
  title: string;
  render?: (
    value: unknown,
    row: T
  ) => React.ReactNode;
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
    <div className="rounded-xl border bg-white shadow-sm">

      <div className="overflow-x-auto rounded-xl">

        <table className="min-w-[900px] w-full">

          <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="whitespace-nowrap px-4 py-4 text-left text-sm font-semibold text-slate-700"
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
                  className="py-14"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-3 text-5xl">
                      📦
                    </div>

                    <h3 className="text-lg font-semibold">
                      Nothing here yet
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Create your first item to get started.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={index}
                  className={`border-t transition-colors hover:bg-blue-50 ${
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50/40"
                  }`}
                >
                  {columns.map((column) => {
                    const value = row[column.key];

                    return (
                      <td
                        key={String(column.key)}
                        className="whitespace-nowrap px-4 py-5 align-middle"
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

    </div>
  );
}