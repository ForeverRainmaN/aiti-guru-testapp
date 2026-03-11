import { useState } from "react"
import { type Product } from "../model/schema"

export const ProductImageCell = ({ product }: { product: Product }) => {
  const [hasError, setHasError] = useState(false)

  if (!product.thumbnail || hasError) {
    return <div className="h-10 w-10 rounded-md bg-gray-200" aria-label="Нет изображения" />
  }

  return (
    <img
      src={product.thumbnail}
      alt={product.title}
      className="h-10 w-10 rounded-md object-cover"
      onError={() => setHasError(true)}
    />
  )
}
