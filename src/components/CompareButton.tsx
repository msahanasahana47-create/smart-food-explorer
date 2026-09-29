import type { Product } from '../types/product';
import { MAX_COMPARE, useApp } from '../context/AppContext';

interface CompareButtonProps {
  product: Product;
  className?: string;
}

export default function CompareButton({ product, className = '' }: CompareButtonProps) {
  const { isCompared, toggleCompare, compare } = useApp();
  const active = isCompared(product.id);
  const full = !active && compare.length >= MAX_COMPARE;

  return (
    <button
      type="button"
      className={`btn btn--ghost ${active ? 'is-active' : ''} ${className}`}
      onClick={() => toggleCompare(product)}
      aria-pressed={active}
      aria-disabled={full}
      title={full ? `You can compare up to ${MAX_COMPARE} products` : undefined}
    >
      {active ? '✓ In Compare' : '⇄ Add to Compare'}
    </button>
  );
}
