import { createColumnHelper } from "@tanstack/react-table"
import { CircleEllipsis, Pencil, Plus } from "lucide-react"

import { Button, Checkbox } from "@/shared/ui"
import { type Product } from "../model/schema"
import { ProductImageCell } from "./product-image-cell"

const columnHelper = createColumnHelper<Product>()

export const getColumns = (
  onSort: (column: "price" | "rating") => void,
  onEdit: (product: Product) => void
) => [
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
    cell: ({ row }) => <ProductImageCell product={row.original} />,
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
]
