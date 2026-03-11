import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"
import { CircleEllipsis, Pencil, Plus } from "lucide-react"
import { useMemo } from "react"

import { Button, Checkbox } from "@/shared/ui"
import { type Product } from "../model/schema"

const columnHelper = createColumnHelper<Product>()

type ProductsTableProps = {
  data: Product[]
  onSort: (column: "price" | "rating") => void
  onEdit: (product: Product) => void
}

export function ProductsTable({ data, onSort, onEdit }: ProductsTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
            className="border-gray-border"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            className="border-gray-border"
          />
        ),
        size: 40
      }),
      columnHelper.display({
        id: "photo",
        header: "",
        cell: ({ row }) => {
          const thumbnail = row.original.thumbnail
          return (
            <img
              src={thumbnail}
              alt={row.original.title}
              className="h-10 w-10 rounded-md object-cover"
              onError={(e) => (e.currentTarget.src = "/placeholder.png")} // TODO
            />
          )
        },
        size: 60
      }),
      columnHelper.accessor("title", {
        header: "Наименование",
        cell: (info) => (
          <div>
            <div className="font-medium">{info.getValue()}</div>
            <div className="text-xs text-gray-400">{info.row.original.category}</div>
          </div>
        ),
        size: 250
      }),
      columnHelper.accessor("brand", {
        header: "Вендор",
        cell: (info) => <span className="font-semibold">{info.getValue() ?? "—"}</span>,
        size: 120
      }),
      columnHelper.accessor("id", {
        header: "Артикул",
        cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
        size: 120
      }),
      columnHelper.accessor("rating", {
        header: () => (
          <button
            onClick={() => onSort("rating")}
            className="flex items-center gap-1 hover:text-gray-900"
          >
            Оценка
          </button>
        ),
        cell: (info) => {
          const rating = info.getValue()
          return <span className={rating < 3 ? "text-red-500" : ""}>{rating.toFixed(1)}/5</span>
        },
        size: 100
      }),
      columnHelper.accessor("price", {
        header: () => (
          <button
            onClick={() => onSort("price")}
            className="flex items-center gap-1 hover:text-gray-900"
          >
            Цена, ₽
          </button>
        ),
        cell: (info) => {
          const price = info.getValue()
          return new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "RUB",
            minimumFractionDigits: 0
          }).format(price)
        },
        size: 120
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-primary h-6 w-12 rounded-full text-white hover:bg-blue-700 hover:text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(row.original)}
              className="text-gray-label h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-label h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <CircleEllipsis />
            </Button>
          </div>
        ),
        size: 120
      })
    ],
    [onSort, onEdit]
  )

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
