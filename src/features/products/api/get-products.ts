import axios from "axios"

import { createApiRequest, toPromise } from "@/shared/lib/api-factory"
import { ProductsResponseSchema, type ProductsResponse } from "../model/schema"

type GetProductsParams = {
  q?: string
  sortBy?: string
  order?: "asc" | "desc"
  limit?: number
  skip?: number
}

const fetchProductsRequest = (params: GetProductsParams): Promise<unknown> => {
  const url = new URL("https://dummyjson.com/products")
  if (params.q) url.searchParams.set("q", params.q)
  if (params.sortBy) url.searchParams.set("sortBy", params.sortBy)
  if (params.order) url.searchParams.set("order", params.order)
  if (params.limit) url.searchParams.set("limit", String(params.limit))
  if (params.skip) url.searchParams.set("skip", String(params.skip))
  return axios.get(url.toString()).then((res) => res.data)
}

export const getProductsTask = (params: GetProductsParams) =>
  createApiRequest(fetchProductsRequest(params), ProductsResponseSchema)

export const getProducts = (params: GetProductsParams): Promise<ProductsResponse> =>
  toPromise(getProductsTask(params))
