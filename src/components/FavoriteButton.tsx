import type { Product } from '../types/product';
import { useApp } from '../context/AppContext';

interface FavoriteButtonProps {
  product: Product;
  withLabel?: boolean;
  className?: string;
}

export default function FavoriteButton({ product, withLabel = false, className = '' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useApp();
  const active = isFavorite(product.id);
  const label = active ? 'Remove from favorites' : 'Add to favorites';

  return (
    <button
      type="button"
      className={`${withLabel ? 'btn btn--ghost' : 'icon-btn fav-btn'} ${active ? 'is-active' : ''} ${className}`}
      onClick={() => toggleFavorite(product)}
      aria-pressed={active}
      aria-label={withLabel ? undefined : `${label}: ${product.title}`}
      title={label}
    >
      <span aria-hidden="true">{active ? '♥' : '♡'}</span>
      {withLabel && <span>{active ? 'Remove favorite' : 'Add to Favorites'}</span>}
    </button>
  );
}
