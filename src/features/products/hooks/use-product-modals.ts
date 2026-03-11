import * as O from "fp-ts/Option"
import { useState } from "react"

import type { Product } from "../model/schema"

type UseProductModalReturnType = {
  isAddModalOpen: boolean
  isEditModalOpen: boolean
  editingProduct: O.Option<Product>
  openAddModal: () => void
  closeAddModal: () => void
  openEditModal: (product: Product) => void
  closeEditModal: () => void
}

export function useProductModals(): UseProductModalReturnType {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<O.Option<Product>>(O.none)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const openAddModal = () => setIsAddModalOpen(true)
  const closeAddModal = () => setIsAddModalOpen(false)

  const openEditModal = (product: Product) => {
    setEditingProduct(O.some(product))
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingProduct(O.none)
  }

  return {
    isAddModalOpen,
    isEditModalOpen,
    editingProduct,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal
  }
}
