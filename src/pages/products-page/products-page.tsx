import { Route } from "@/app/routes/products"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { useDebounce } from "@/shared"
import { Skeleton } from "@/shared/ui"

import { useProducts } from "@/features/products/hooks"
import { AddProductButton, Pagination, ProductsTable, SearchBar } from "@/features/products/ui"
import { AddProductModal } from "@/features/products/ui/add-product-modal"

export function ProductsPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const [searchQuery, setSearchQuery] = useState(search.q || "")
  const debouncedQuery = useDebounce(searchQuery, 500)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const { sortBy, sortOrder, page = 1 } = search

  const limit = 10

  const { products, isLoading, error, total, skip, addProduct } = useProducts({
    page,
    limit,
    ...(debouncedQuery && { q: debouncedQuery }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder })
  })

  useEffect(() => {
    navigate({
      search: { ...search, q: debouncedQuery || undefined }
    })
  }, [debouncedQuery, navigate, search])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  const handleSort = (column: "price" | "rating") => {
    const newOrder = sortBy === column && sortOrder === "asc" ? "desc" : "asc"
    navigate({
      search: { ...search, sortBy: column, sortOrder: newOrder, page: 1 }
    })
  }

  if (error) return <div>Ошибка: {error.message}</div>

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex h-24 items-center justify-between rounded-lg bg-white px-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Товары</h1>
          <div className="flex items-center gap-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Все позиции</h2>
            <AddProductButton onClick={() => setIsAddModalOpen(true)} />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <ProductsTable data={products} onSort={handleSort} />
          )}

          {total > 0 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(total / limit)}
              total={total}
              skip={skip}
              limit={limit}
              onPageChange={(newPage) => navigate({ search: { ...search, page: newPage } })}
            />
          )}
        </div>

        <AddProductModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onAdd={addProduct}
        />
      </div>
    </div>
  )
}
