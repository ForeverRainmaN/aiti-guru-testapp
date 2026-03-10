import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import { useDebounce } from "@/shared"
import { Skeleton } from "@/shared/ui"

import { Route, type ProductsSearch } from "@/app/routes/products"
import { getProducts } from "@/features/products/api"
import type { AddProductForm, Product } from "@/features/products/model"
import { AddProductButton, Pagination, ProductsTable, SearchBar } from "@/features/products/ui"
import { AddProductModal } from "@/features/products/ui/add-product-modal"

export function ProductsPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const [searchQuery, setSearchQuery] = useState(search.q || "")
  const debouncedQuery = useDebounce<string>(searchQuery, 500)

  const [localProducts, setLocalProducts] = useState<Product[]>([])

  const handleAddProduct = (newProduct: AddProductForm) => {
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

  useEffect(() => {
    navigate({
      search: (prev: ProductsSearch) => ({ ...prev, q: debouncedQuery || undefined })
    })
  }, [debouncedQuery, navigate])

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", debouncedQuery],
    queryFn: () => getProducts(debouncedQuery)
  })

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  if (error) return <div>Ошибка: {error.message}</div>

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Товары</h1>
        <div className="flex items-center gap-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <AddProductButton onClick={() => setIsAddModalOpen(true)} />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <ProductsTable data={[...(data?.products ?? []), ...localProducts]} />
      )}

      {data && (
        <Pagination
          currentPage={1}
          totalPages={Math.ceil(data.total / data.limit)}
          onPageChange={(page) => console.log("page", page)}
        />
      )}

      <AddProductModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddProduct}
      />
    </div>
  )
}
