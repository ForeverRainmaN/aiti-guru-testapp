import { ProductsPage } from "@/pages/products-page"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

export const productsSearchSchema = z.object({
  q: z.string().optional(),
  sortBy: z.enum(["price", "rating"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().optional()
})

export type ProductsSearch = z.infer<typeof productsSearchSchema>

export const Route = createFileRoute("/products")({
  validateSearch: productsSearchSchema,
  component: ProductsPage
})
