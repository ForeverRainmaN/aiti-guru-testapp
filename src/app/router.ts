import { routeTree } from "@/app/routeTree.gen"
import { getToken } from "@/features/auth/model/auth-storage"
import { createRouter } from "@tanstack/react-router"

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: { token: getToken() }
  }
})
