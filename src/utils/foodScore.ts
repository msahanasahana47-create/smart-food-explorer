import type { Product } from '../types/product';

export interface ScoreBreakdown {
  rating: number; // 0-50
  discount: number; // 0-20
  availability: number; // 0-30
  total: number; // 0-100
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Application-generated "Explorer Score" (NOT an official rating).
 *  - Rating       : up to 50 points  (rating / 5)
 *  - Discount     : up to 20 points  (a 25% discount or more gives the max)
 *  - Availability : up to 30 points  (0 = out of stock, 10 = low, 20 = ok, 30 = plenty)
 */
export function calculateFoodScore(
  product: Pick<Product, 'rating' | 'discountPercentage' | 'stock'>,
): ScoreBreakdown {
  const rating = Math.round(clamp(product.rating / 5, 0, 1) * 50);
  const discount = Math.round(clamp(product.discountPercentage / 25, 0, 1) * 20);
  const availability = product.stock <= 0 ? 0 : product.stock < 10 ? 10 : product.stock < 30 ? 20 : 30;
  return { rating, discount, availability, total: rating + discount + availability };
}

export function scoreLabel(total: number): string {
  if (total >= 80) return 'Excellent pick';
  if (total >= 60) return 'Good pick';
  if (total >= 40) return 'Fair pick';
  return 'Low pick';
}
