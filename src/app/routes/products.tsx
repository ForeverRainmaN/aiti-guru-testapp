import { ProductsPage } from "@/pages/products-page"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { isNone } from "fp-ts/Option"

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  beforeLoad: ({ context }) => {
    if (isNone(context.auth.token)) {
      throw redirect({ to: "/login" })
    }
  }
})
