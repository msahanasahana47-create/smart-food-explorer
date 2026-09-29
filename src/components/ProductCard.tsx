import { Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { formatPrice, prettify } from '../utils/format';
import FavoriteButton from './FavoriteButton';
import CompareButton from './CompareButton';
import FoodScore from './FoodScore';

interface ProductCardProps {
  product: Product;
  labelledFavorite?: boolean;
}

export default function ProductCard({ product, labelledFavorite = false }: ProductCardProps) {
  const stockText =
    product.stock <= 0 ? 'Out of stock' : product.stock < 10 ? `Only ${product.stock} left` : `${product.stock} in stock`;
  const stockTone = product.stock <= 0 ? 'out' : product.stock < 10 ? 'low' : 'ok';

  return (
    <article className="card product-card">
      <div className="product-card__media">
        <Link to={`/products/${product.id}`} tabIndex={-1} aria-hidden="true">
          <img src={product.thumbnail} alt="" loading="lazy" width={300} height={300} />
        </Link>
        {product.discountPercentage > 0 && (
          <span className="discount-badge">-{Math.round(product.discountPercentage)}%</span>
        )}
        {!labelledFavorite && <FavoriteButton product={product} className="product-card__fav" />}
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{prettify(product.tags?.[0] ?? product.category)}</p>
        <h3 className="product-card__title">
          <Link to={`/products/${product.id}`}>{product.title}</Link>
        </h3>

        <div className="product-card__meta">
          <span className="price">{formatPrice(product.price)}</span>
          <span className="rating" aria-label={`Rated ${product.rating.toFixed(1)} out of 5`}>
            ★ {product.rating.toFixed(1)}
          </span>
        </div>
        <p className={`stock stock--${stockTone}`}>{stockText}</p>

        <FoodScore product={product} />

        <div className="product-card__actions">
          <Link to={`/products/${product.id}`} className="btn btn--primary">View Details</Link>
          <CompareButton product={product} />
          {labelledFavorite && <FavoriteButton product={product} withLabel />}
        </div>
      </div>
    </article>
  );
}
