import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useMemo } from "react"
import { type Product } from "../model/schema"
import { getColumns } from "./columns"

type ProductsTableProps = {
  data: Product[]
  onSort: (column: "price" | "rating") => void
  onEdit: (product: Product) => void
}

export function ProductsTable({ data, onSort, onEdit }: ProductsTableProps) {
  const columns = useMemo(() => getColumns(onSort, onEdit), [onSort, onEdit])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange"
  })

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-gray-label px-4 py-3 text-left text-sm font-medium"
                  style={{ width: header.getSize() }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-sm text-gray-900">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
