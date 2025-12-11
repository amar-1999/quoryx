import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowRight } from "lucide-react";

export function TableWidget({ config }) {
  // Mock Data
  const data = useMemo(
    () => [
      { id: 1, page: "/home", visitors: 12450, bounce: "45%" },
      { id: 2, page: "/pricing", visitors: 8500, bounce: "24%" },
      { id: 3, page: "/blog/ai-trends", visitors: 6200, bounce: "68%" },
      { id: 4, page: "/contact", visitors: 3100, bounce: "30%" },
      { id: 5, page: "/features", visitors: 2800, bounce: "42%" },
      { id: 6, page: "/about", visitors: 1900, bounce: "55%" },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "page",
        header: "Page Name",
        cell: (info) => (
          <span className="font-medium text-foreground">{info.getValue()}</span>
        ),
      },
      {
        accessorKey: "visitors",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="hover:bg-transparent p-0 font-semibold"
            >
              Visitors
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: "bounce",
        header: "Bounce Rate",
        cell: (info) => (
          <span className="text-muted-foreground">{info.getValue()}</span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-auto rounded-md border bg-card/50">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50 text-muted-foreground sticky top-0 backdrop-blur-sm z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pt-2 flex justify-between items-center text-xs text-muted-foreground shrink-0">
        <span>Top performing pages</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            &lt;
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            &gt;
          </Button>
        </div>
      </div>
    </div>
  );
}
