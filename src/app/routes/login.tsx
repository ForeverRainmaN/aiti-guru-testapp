import { LoginPage } from "@/pages/login-page"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { isSome } from "fp-ts/Option"

export const Route = createFileRoute("/login")({
  component: LoginPage,
  beforeLoad: ({ context }) => {
    if (isSome(context.auth.token)) {
      throw redirect({ to: "/products" })
    }
  }
})
