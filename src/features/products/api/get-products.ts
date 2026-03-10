import { createApiRequest, toPromise } from "@/shared/lib/api-factory"
import axios from "axios"
import { ProductsResponseSchema, type ProductsResponse } from "../model/schema"

const fetchProductsRequest = (search?: string): Promise<unknown> => {
  const url = search
    ? `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}`
    : "https://dummyjson.com/products"
  return axios.get(url).then((res) => res.data)
}

const getProductsTask = (search?: string) =>
  createApiRequest(fetchProductsRequest(search), ProductsResponseSchema)

export const getProducts = (search?: string): Promise<ProductsResponse> =>
  toPromise(getProductsTask(search))
