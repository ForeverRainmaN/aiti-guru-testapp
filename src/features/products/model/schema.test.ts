import { describe, expect, it } from "vitest"
import { ProductFormSchema } from "./schema"

describe("ProductFormSchema", () => {
  it("should validate correct data", () => {
    const validData = {
      title: "Test Product",
      price: 100,
      brand: "Test Brand",
      sku: "SKU123"
    }
    const result = ProductFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("should fail if title is empty", () => {
    const invalidData = {
      title: "",
      price: 100,
      brand: "Test Brand"
    }
    const result = ProductFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("title")
    }
  })

  it("should fail if price is negative", () => {
    const invalidData = {
      title: "Test",
      price: -10,
      brand: "Test"
    }
    const result = ProductFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it("should accept optional sku", () => {
    const dataWithoutSku = {
      title: "Test",
      price: 100,
      brand: "Test"
    }
    const result = ProductFormSchema.safeParse(dataWithoutSku)
    expect(result.success).toBe(true)
  })
})
