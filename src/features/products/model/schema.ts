import { z } from "zod"

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  brand: z.string().optional(),
  category: z.string(),
  thumbnail: z.string(),
  images: z.array(z.string()),
  sku: z.string().optional()
})

export const ProductsResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number()
})

export const ProductFormSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  price: z
    .number()
    .positive("Цена должна быть положительной")
    .min(0.01, "Цена не может быть нулевой"),
  brand: z.string().optional(),
  sku: z.string().optional()
})

export type Product = z.infer<typeof ProductSchema>
export type ProductFormData = z.infer<typeof ProductFormSchema>
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>
