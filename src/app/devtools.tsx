import { lazy, Suspense } from "react"

const RouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/router-devtools").then((m) => ({ default: m.TanStackRouterDevtools }))
    )
  : () => null

const QueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((m) => ({ default: m.ReactQueryDevtools }))
    )
  : () => null

export function Devtools() {
  if (!import.meta.env.DEV) return null
  return (
    <Suspense fallback={null}>
      <RouterDevtools position="bottom-right" />
      <QueryDevtools initialIsOpen={false} />
    </Suspense>
  )
}
