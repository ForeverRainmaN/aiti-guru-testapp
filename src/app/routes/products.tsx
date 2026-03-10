import { createRoute, redirect } from "@tanstack/react-router"
import { Route as rootRoute } from "./__root"
import { ProductsPage } from "@/pages/products-page"

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ProductsPage,
  beforeLoad: ({ context }) => {
    if (!context.auth.token) {
      // TODO: Fix type issue
      throw redirect({ to: "/login" })
    }
  }
})
