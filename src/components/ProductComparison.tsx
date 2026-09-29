import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { Product } from '../types/product';
import { useApp } from '../context/AppContext';
import { calculateFoodScore } from '../utils/foodScore';
import { formatPrice, prettify } from '../utils/format';

interface Row {
  label: string;
  value: (p: Product) => string | number;
  display?: (p: Product) => ReactNode;
  best?: 'min' | 'max';
}

const rows: Row[] = [
  { label: 'Category', value: (p) => p.tags?.[0] ?? p.category, display: (p) => prettify(p.tags?.[0] ?? p.category) },
  { label: 'Brand', value: (p) => p.brand ?? '—' },
  { label: 'Price', value: (p) => p.price, display: (p) => formatPrice(p.price), best: 'min' },
  { label: 'Discount', value: (p) => p.discountPercentage, display: (p) => `${p.discountPercentage.toFixed(1)}%`, best: 'max' },
  { label: 'Rating', value: (p) => p.rating, display: (p) => `★ ${p.rating.toFixed(1)}`, best: 'max' },
  { label: 'Stock', value: (p) => p.stock, display: (p) => (p.stock > 0 ? `${p.stock} units` : 'Out of stock'), best: 'max' },
  { label: 'Explorer Score', value: (p) => calculateFoodScore(p).total, display: (p) => `${calculateFoodScore(p).total}/100`, best: 'max' },
];

export default function ProductComparison({ products }: { products: Product[] }) {
  const { removeFromCompare } = useApp();

  return (
    <div>
      <p className="legend">
        <span className="legend__swatch legend__swatch--diff" aria-hidden="true" /> Rows that differ are highlighted.
        <span className="legend__swatch legend__swatch--best" aria-hidden="true" /> “Best” marks the strongest value in that row.
      </p>
      <div className="table-scroll">
        <table className="compare-table">
          <caption className="sr-only">Product comparison</caption>
          <thead>
            <tr>
              <th scope="col">Product</th>
              {products.map((p) => (
                <th scope="col" key={p.id}>
                  <img src={p.thumbnail} alt={p.title} width={120} height={120} />
                  <Link to={`/products/${p.id}`} className="compare-table__title">{p.title}</Link>
                  <button type="button" className="btn btn--ghost btn--danger" onClick={() => removeFromCompare(p.id)}>
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const values = products.map(row.value);
              const differs = new Set(values).size > 1;
              const numeric = values.filter((v): v is number => typeof v === 'number');
              const target = row.best && numeric.length
                ? row.best === 'min' ? Math.min(...numeric) : Math.max(...numeric)
                : undefined;
              return (
                <tr key={row.label} className={differs ? 'row-diff' : ''}>
                  <th scope="row">{row.label}</th>
                  {products.map((p, i) => {
                    const isBest = differs && target !== undefined && values[i] === target;
                    return (
                      <td key={p.id} className={isBest ? 'best' : ''}>
                        {row.display ? row.display(p) : row.value(p)}
                        {isBest && <span className="best__tag"> Best</span>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
