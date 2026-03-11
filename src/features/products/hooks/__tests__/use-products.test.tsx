import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import { act } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { getProducts } from "../../api/get-products"
import { useProducts } from "../use-products"

vi.mock("../../api/get-products", () => ({
  getProducts: vi.fn()
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } }
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe("useProducts", () => {
  beforeEach(() => {
    queryClient.clear()
    vi.resetAllMocks()
  })

  it("fetches products successfully", async () => {
    const mockData = {
      products: [{ id: 1, title: "Test", price: 100, brand: "TestBrand" }],
      total: 1
    } as any
    vi.mocked(getProducts).mockResolvedValue(mockData)

    const { result } = renderHook(() => useProducts({ page: 1, limit: 10 }), { wrapper })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.products).toEqual(mockData.products)
    expect(result.current.total).toBe(1)
    expect(result.current.error).toBeNull()
  })

  it("handles error", async () => {
    const error = new Error("Network error")
    vi.mocked(getProducts).mockRejectedValue(error)

    const { result } = renderHook(() => useProducts({ page: 1, limit: 10 }), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toEqual(error)
    expect(result.current.products).toEqual([])
    expect(result.current.total).toBe(0)
  })

  it("adds product locally", () => {
    const { result } = renderHook(() => useProducts({ page: 1, limit: 10 }), { wrapper })

    act(() => {
      result.current.addProduct({ title: "New", price: 200, brand: "NewBrand" })
    })

    expect(result.current.products).toHaveLength(1)
    expect(result.current.products[0].title).toBe("New")
  })

  it("updates product locally", () => {
    const { result } = renderHook(() => useProducts({ page: 1, limit: 10 }), { wrapper })

    act(() => {
      result.current.addProduct({ title: "New", price: 200, brand: "NewBrand" })
    })

    const product = result.current.products[0]
    const updated = { ...product, price: 250 }

    act(() => {
      result.current.updateProduct(updated)
    })

    expect(result.current.products[0].price).toBe(250)
  })
})
