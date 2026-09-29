import type { Product } from '../types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  labelledFavorite?: boolean;
}

export default function ProductGrid({ products, labelledFavorite = false }: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} labelledFavorite={labelledFavorite} />
      ))}
    </div>
  );
}
