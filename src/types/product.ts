export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  thumbnail: string;
  images: string[];
}

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface FavoriteProduct extends Product {
  addedAt: number;
}

export interface ShoppingListItem {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
}

export interface FilterState {
  category: string;
  minPrice: string;
  maxPrice: string;
  minRating: number;
  inStockOnly: boolean;
}

export type SortOption =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'discount-desc'
  | 'name-asc';

export const DEFAULT_FILTERS: FilterState = {
  category: '',
  minPrice: '',
  maxPrice: '',
  minRating: 0,
  inStockOnly: false,
};

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
  { value: 'discount-desc', label: 'Discount: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
];
