import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router"
import { productsSearchSchema } from "./products-schema"

export const Route = createFileRoute("/products")({
  validateSearch: productsSearchSchema,
  component: lazyRouteComponent(() => import("@/pages/products-page"), "ProductsPage")
})
