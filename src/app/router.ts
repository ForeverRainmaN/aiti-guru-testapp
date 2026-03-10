import { createRouter } from "@tanstack/react-router"
import { Route as rootRoute } from "./routes/__root"
import { Route as loginRoute } from "./routes/login"
import { Route as productsRoute } from "./routes/products"

const routeTree = rootRoute.addChildren([loginRoute, productsRoute])

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined
  }
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
