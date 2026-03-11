import { Route } from "@/app/routes/products"
import { pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { useDebounce } from "@/shared"
import { Button, Skeleton } from "@/shared/ui"

import {
  AddProductButton,
  useProductModals,
  useProducts,
  type Product,
  type ProductFormData
} from "@/features/products"
import { Pagination, ProductModals, ProductsHeader, ProductsTable } from "@/features/products/ui"

const LIMIT = 10

export function ProductsPage() {
  const search = Route.useSearch()
  const { sortBy, sortOrder, page = 1 } = search
  const navigate = Route.useNavigate()

  const [searchQuery, setSearchQuery] = useState(search.q || "")
  const debouncedQuery = useDebounce(searchQuery, 500)

  const modals = useProductModals()

  const { products, isLoading, error, total, skip, addProduct, updateProduct, refetch } =
    useProducts({
      page,
      limit: LIMIT,
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
    if (error) toast.error(error.message)
  }, [error])

  const handleSort = useCallback(
    (column: "price" | "rating"): void => {
      const newOrder = sortBy === column && sortOrder === "asc" ? "desc" : "asc"
      navigate({
        search: { ...search, sortBy: column, sortOrder: newOrder, page: 1 }
      })
    },
    [navigate, search, sortBy, sortOrder]
  )

  const handleAdd = useCallback(
    (data: ProductFormData): void => {
      addProduct(data)
      toast.success("Товар добавлен")
      modals.closeAddModal()
    },
    [addProduct, modals]
  )

  const handleEdit = useCallback(
    (data: ProductFormData) => {
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
    },
    [updateProduct, modals]
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <ProductsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="rounded-lg bg-white p-6 shadow-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
              <p className="mb-2">Не удалось загрузить товары. Попробуйте ещё раз.</p>
              <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
                Повторить
              </Button>
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Все позиции</h2>
            <AddProductButton onClick={modals.openAddModal} />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
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
              onPageChange={(newPageNumber) =>
                navigate({ search: { ...search, page: newPageNumber } })
              }
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
