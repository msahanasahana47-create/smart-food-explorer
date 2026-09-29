import type { Product, ProductResponse } from '../types/product';

const BASE_URL = 'https://dummyjson.com';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(url: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError('Network error', 0);
  }
  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status);
  }
  return (await response.json()) as T;
}

/** This app only shows food, which DummyJSON stores in the "groceries" category. */
const FOOD_CATEGORY = 'groceries';

/** GET https://dummyjson.com/products/category/groceries (food products only) */
export function fetchAllProducts(signal?: AbortSignal): Promise<ProductResponse> {
  return request<ProductResponse>(`${BASE_URL}/products/category/${FOOD_CATEGORY}?limit=0`, signal);
}

/** GET https://dummyjson.com/products/search?q={query} */
export async function searchProducts(query: string, signal?: AbortSignal): Promise<ProductResponse> {
  const data = await request<ProductResponse>(
    `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=0`,
    signal,
  );
  // The search endpoint covers every category, so keep only the food results.
  const products = data.products.filter((p) => p.category === FOOD_CATEGORY);
  return { ...data, products, total: products.length };
}

/** GET https://dummyjson.com/products/{id} */
export function fetchProduct(id: number, signal?: AbortSignal): Promise<Product> {
  return request<Product>(`${BASE_URL}/products/${id}`, signal);
}

/** GET https://dummyjson.com/products/category-list */
export function fetchCategories(signal?: AbortSignal): Promise<string[]> {
  return request<string[]>(`${BASE_URL}/products/category-list`, signal);
}
