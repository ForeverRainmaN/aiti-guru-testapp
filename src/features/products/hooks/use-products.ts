import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { getProducts } from "../api"
import type { AddProductForm, Product } from "../model"

export function useProducts(searchParams: {
  q?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page: number
  limit: number
}) {
  const { q, sortBy, sortOrder, page, limit } = searchParams
  const skip = (page - 1) * limit

  const [localProducts, setLocalProducts] = useState<Product[]>([])

  const { data, isLoading, error } = useQuery({
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

  const addProduct = (newProduct: AddProductForm) => {
    const product: Product = {
      id: Date.now(),
      title: newProduct.title,
      price: newProduct.price,
      brand: newProduct.brand,
      description: "",
      discountPercentage: 0,
      rating: 0,
      stock: 0,
      category: "",
      thumbnail: "",
      images: []
    }
    setLocalProducts((prev) => [product, ...prev])
  }

  const combinedProducts = [...(data?.products ?? []), ...localProducts]

  return {
    products: combinedProducts,
    isLoading,
    error,
    total: data?.total ?? 0,
    limit,
    skip,
    addProduct
  }
}
