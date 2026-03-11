import { Route } from "@/app/routes/products"
import { pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { useDebounce } from "@/shared"
import { Button, Skeleton } from "@/shared/ui"

import {
  useProductModals,
  useProducts,
  type Product,
  type ProductFormData
} from "@/features/products"
import {
  AddProductButton,
  Pagination,
  ProductModals,
  ProductsTable,
  SearchBar
} from "@/features/products/ui"

const LIMIT = 10

export function ProductsPage() {
  const search = Route.useSearch()

  const { sortBy, sortOrder, page = 1 } = search

  const navigate = Route.useNavigate()

  const [searchQuery, setSearchQuery] = useState(search.q || "")
  const debouncedQuery = useDebounce(searchQuery, 500)

  const {
    products,
    isLoading,
    error,
    total,
    skip,
    isRefetching,
    addProduct,
    updateProduct,
    refetch
  } = useProducts({
    page,
    limit: LIMIT,
    ...(debouncedQuery && { q: debouncedQuery }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder })
  })

  const modals = useProductModals()

  useEffect(() => {
    navigate({
      search: { ...search, q: debouncedQuery || undefined }
    })
  }, [debouncedQuery, navigate, search])

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  const handleSort = useCallback((column: "price" | "rating"): void => {
    const newOrder = sortBy === column && sortOrder === "asc" ? "desc" : "asc"
    navigate({
      search: { ...search, sortBy: column, sortOrder: newOrder, page: 1 }
    })
  }, [])

  const handleAdd = useCallback((data: ProductFormData): void => {
    addProduct(data)
    toast.success("Товар добавлен")
    modals.closeAddModal()
  }, [])

  const handleEdit = useCallback((data: ProductFormData): void => {
    pipe(
      modals.editingProduct,
      O.fold(
        () => {},
        (product) => {
          const updatedProduct: Product = {
            ...product,
            title: data.title,
            price: data.price,
            brand: data.brand,
            sku: data.sku || product.sku
          }
          updateProduct(updatedProduct)
          toast.success("Товар обновлён")
          modals.closeEditModal()
        }
      )
    )
  }, [])

  {
    error && (
      <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
        <p className="mb-2">Не удалось загрузить товары. Попробуйте ещё раз.</p>
        <Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
          Повторить
        </Button>
      </div>
    )
  }

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
            <AddProductButton onClick={modals.openAddModal} />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <ProductsTable data={products} onSort={handleSort} onEdit={modals.openEditModal} />
          )}

          {total > 0 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(total / LIMIT)}
              total={total}
              skip={skip}
              limit={LIMIT}
              onPageChange={(newPage) => navigate({ search: { ...search, page: newPage } })}
            />
          )}
        </div>

        <ProductModals
          isAddModalOpen={modals.isAddModalOpen}
          isEditModalOpen={modals.isEditModalOpen}
          editingProduct={modals.editingProduct}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onCloseAdd={modals.closeAddModal}
          onCloseEdit={modals.closeEditModal}
        />
      </div>
    </div>
  )
}
