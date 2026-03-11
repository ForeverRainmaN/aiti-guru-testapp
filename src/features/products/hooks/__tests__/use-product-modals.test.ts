import { act, renderHook } from "@testing-library/react"
import * as O from "fp-ts/Option"
import { describe, expect, it } from "vitest"
import { useProductModals } from "../use-product-modals"

describe("useProductModals", () => {
  it("initial state is closed", () => {
    const { result } = renderHook(() => useProductModals())
    expect(result.current.isAddModalOpen).toBe(false)
    expect(result.current.isEditModalOpen).toBe(false)
    expect(O.isNone(result.current.editingProduct)).toBe(true)
  })

  it("openAddModal sets isAddModalOpen to true", () => {
    const { result } = renderHook(() => useProductModals())
    act(() => {
      result.current.openAddModal()
    })
    expect(result.current.isAddModalOpen).toBe(true)
  })

  it("closeAddModal sets isAddModalOpen to false", () => {
    const { result } = renderHook(() => useProductModals())
    act(() => {
      result.current.openAddModal()
      result.current.closeAddModal()
    })
    expect(result.current.isAddModalOpen).toBe(false)
  })

  it("openEditModal sets isEditModalOpen to true and editingProduct to Some(product)", () => {
    const { result } = renderHook(() => useProductModals())
    const product = { id: 1, title: "Test" } as any
    act(() => {
      result.current.openEditModal(product)
    })
    expect(result.current.isEditModalOpen).toBe(true)
    expect(O.isSome(result.current.editingProduct)).toBe(true)
    if (O.isSome(result.current.editingProduct)) {
      expect(result.current.editingProduct.value).toEqual(product)
    }
  })

  it("closeEditModal resets state", () => {
    const { result } = renderHook(() => useProductModals())
    const product = { id: 1, title: "Test" } as any
    act(() => {
      result.current.openEditModal(product)
      result.current.closeEditModal()
    })
    expect(result.current.isEditModalOpen).toBe(false)
    expect(O.isNone(result.current.editingProduct)).toBe(true)
  })
})
