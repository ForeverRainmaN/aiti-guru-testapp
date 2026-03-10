import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"

import { type Product } from "../model/schema"

const columnHelper = createColumnHelper<Product>()

const columns = [
  columnHelper.accessor("title", {
    header: "Наименование",
    cell: (info) => <div className="font-medium">{info.getValue()}</div>
  }),
  columnHelper.accessor("brand", {
    header: "Вендор"
  }),
  columnHelper.accessor("id", {
    header: "Артикул",
    cell: (info) => <span className="text-gray-600">{info.getValue()}</span>
  }),
  columnHelper.accessor("rating", {
    header: "Оценка",
    cell: (info) => {
      const rating = info.getValue()
      return (
        <span className={rating < 3 ? "font-semibold text-red-500" : ""}>
          {rating.toFixed(1)}/5
        </span>
      )
    }
  }),
  columnHelper.accessor("price", {
    header: "Цена, ₽",
    cell: (info) => {
      const price = info.getValue()
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0
      }).format(price)
    }
  })
]

interface ProductsTableProps {
  data: Product[]
}

export function ProductsTable({ data }: ProductsTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-500 uppercase"
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
                <td key={cell.id} className="px-6 py-4 text-sm text-gray-900">
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
