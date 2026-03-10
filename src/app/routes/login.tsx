import { LoginPage } from "@/pages/login-page"
import { createRoute, redirect } from "@tanstack/react-router"
import { Route as rootRoute } from "./__root"

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
  beforeLoad: ({ context }) => {
    if (context.auth.token) {
      // TODO: Fix type issue
      throw redirect({ to: "/" })
    }
  }
})
