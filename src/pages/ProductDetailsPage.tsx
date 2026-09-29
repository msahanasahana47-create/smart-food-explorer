import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Product } from '../types/product';
import { ApiError, fetchProduct } from '../services/api';
import { useApp } from '../context/AppContext';
import { formatPrice, prettify } from '../utils/format';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import FavoriteButton from '../components/FavoriteButton';
import CompareButton from '../components/CompareButton';
import FoodScore from '../components/FoodScore';
import RecentlyViewed from '../components/RecentlyViewed';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const numericId = Number(id);
  const validId = Number.isInteger(numericId) && numericId > 0;

  const { addRecent, addToShoppingList } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(validId);
  const [error, setError] = useState<'none' | 'notfound' | 'failed'>(validId ? 'none' : 'notfound');
  const [reloadKey, setReloadKey] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!validId) {
      setError('notfound');
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError('none');
    setQuantity(1);
    setActiveImage(0);
    fetchProduct(numericId, controller.signal)
      .then((p) => {
        setProduct(p);
        addRecent(p);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof ApiError && err.status === 404 ? 'notfound' : 'failed');
        setLoading(false);
      });
    return () => controller.abort();
  }, [numericId, validId, reloadKey, addRecent]);

  const back = (
    <Link to="/products" className="btn btn--ghost">← Back to Products</Link>
  );

  if (loading) return <div className="container page"><LoadingState label="Loading product..." /></div>;

  if (error === 'notfound') {
    return (
      <div className="container page">
        <EmptyState title="Product not found." message="This product doesn't exist or was removed." icon="🍽️" action={back} />
      </div>
    );
  }

  if (error === 'failed' || !product) {
    return (
      <div className="container page">
        <ErrorState message="Unable to load this product. Please try again." onRetry={() => setReloadKey((k) => k + 1)} />
        <div className="center">{back}</div>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const maxQty = Math.max(1, Math.min(product.stock, 99));
  const outOfStock = product.stock <= 0;

  return (
    <div className="container page">
      <div className="details__top">{back}</div>

      <article className="details">
        <div className="details__gallery">
          <div className="details__hero card">
            <img src={images[activeImage] ?? product.thumbnail} alt={product.title} />
          </div>
          {images.length > 1 && (
            <ul className="details__thumbs" aria-label="Product images">
              {images.map((src, i) => (
                <li key={src}>
                  <button
                    type="button"
                    className={i === activeImage ? 'is-active' : ''}
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1} of ${images.length}`}
                    aria-pressed={i === activeImage}
                  >
                    <img src={src} alt="" width={64} height={64} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="details__info">
          <p className="product-card__category">{prettify(product.tags?.[0] ?? product.category)}</p>
          <h1>{product.title}</h1>
          <p className="details__desc">{product.description}</p>

          <div className="details__price">
            <span className="price price--lg">{formatPrice(product.price)}</span>
            {product.discountPercentage > 0 && (
              <span className="discount-badge discount-badge--inline">-{product.discountPercentage.toFixed(1)}% off</span>
            )}
          </div>

          <dl className="facts">
            <div><dt>Brand</dt><dd>{product.brand ?? 'Not listed'}</dd></div>
            <div><dt>Rating</dt><dd>★ {product.rating.toFixed(1)} / 5</dd></div>
            <div>
              <dt>Stock</dt>
              <dd className={outOfStock ? 'stock--out' : product.stock < 10 ? 'stock--low' : 'stock--ok'}>
                {outOfStock ? 'Out of stock' : `${product.stock} available`}
              </dd>
            </div>
          </dl>

          {product.tags && product.tags.length > 0 && (
            <ul className="tags" aria-label="Tags">
              {product.tags.map((t) => <li key={t}>#{t}</li>)}
            </ul>
          )}

          <FoodScore product={product} detailed />

          <div className="details__buy">
            <div className="qty" role="group" aria-label="Quantity">
              <button type="button" className="icon-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} aria-label="Decrease quantity">−</button>
              <output aria-live="polite">{quantity}</output>
              <button type="button" className="icon-btn" onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))} disabled={quantity >= maxQty} aria-label="Increase quantity">+</button>
            </div>
            <button type="button" className="btn btn--primary" onClick={() => addToShoppingList(product, quantity)} disabled={outOfStock}>
              Add to Shopping List
            </button>
          </div>

          <div className="details__actions">
            <FavoriteButton product={product} withLabel />
            <CompareButton product={product} />
          </div>
        </div>
      </article>

      <RecentlyViewed excludeId={product.id} />
    </div>
  );
}
