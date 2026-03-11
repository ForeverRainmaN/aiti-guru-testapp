import { getProducts } from "@/features/products/api"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"
import type { Product, ProductFormData } from "../model/schema"

interface UseProductsParams {
  q?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page: number
  limit: number
}

export function useProducts({ q, sortBy, sortOrder, page, limit }: UseProductsParams) {
  const skip = (page - 1) * limit

  const { data, isLoading, error, isRefetching, refetch } = useQuery({
    queryKey: ["products", { q, sortBy, sortOrder, page }],
    queryFn: () =>
      getProducts({
        limit,
        skip,
        ...(q && { q }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { order: sortOrder })
      })
  })

  const [localEdits, setLocalEdits] = useState<Record<number, Product>>({})

  const addProduct = useCallback((newProduct: ProductFormData) => {
    const id = Date.now()
    const product: Product = {
      id,
      title: newProduct.title,
      price: newProduct.price,
      brand: newProduct.brand,
      description: "",
      discountPercentage: 0,
      rating: 0,
      stock: 0,
      category: "",
      thumbnail: "",
      images: [],
      sku: newProduct.sku || `SKU-${id}`
    }
    setLocalEdits((prev) => ({ ...prev, [id]: product }))
  }, [])

  const updateProduct = useCallback((updatedProduct: Product) => {
    setLocalEdits((prev) => ({ ...prev, [updatedProduct.id]: updatedProduct }))
  }, [])

  const products = useMemo(() => {
    const serverProducts = data?.products ?? []
    const merged = serverProducts.map((p) => localEdits[p.id] || p)
    const localAdds = Object.values(localEdits).filter(
      (p) => !serverProducts.some((sp) => sp.id === p.id)
    )
    return [...merged, ...localAdds]
  }, [data, localEdits])

  return {
    products,
    total: data?.total ?? 0,
    skip,
    isLoading,
    isRefetching,
    error,
    addProduct,
    updateProduct,
    refetch
  }
}
