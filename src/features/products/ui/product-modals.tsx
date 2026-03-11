import { ProductFormModal } from "@/features/products/ui/product-form-modal"
import * as O from "fp-ts/Option"
import type { Product, ProductFormData } from "../model/schema"

interface ProductModalsProps {
  isAddModalOpen: boolean
  isEditModalOpen: boolean
  editingProduct: O.Option<Product>
  onAdd: (data: ProductFormData) => void
  onEdit: (data: ProductFormData, id?: number) => void
  onCloseAdd: () => void
  onCloseEdit: () => void
}

export function ProductModals({
  isAddModalOpen,
  isEditModalOpen,
  editingProduct,
  onAdd,
  onEdit,
  onCloseAdd,
  onCloseEdit
}: ProductModalsProps) {
  return (
    <>
      <ProductFormModal
        open={isAddModalOpen}
        onOpenChange={(open) => !open && onCloseAdd()}
        mode="add"
        initialData={O.none}
        onSave={onAdd}
      />
      <ProductFormModal
        open={isEditModalOpen}
        onOpenChange={(open) => !open && onCloseEdit()}
        mode="edit"
        initialData={editingProduct}
        onSave={onEdit}
      />
    </>
  )
}
