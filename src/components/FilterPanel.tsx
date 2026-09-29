import { useState } from 'react';
import type { FilterState } from '../types/product';
import { prettify } from '../utils/format';

interface FilterPanelProps {
  filters: FilterState;
  categories: string[];
  activeCount: number;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

export default function FilterPanel({ filters, categories, activeCount, onChange, onReset }: FilterPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <aside className="filters" aria-label="Filters">
      <button
        type="button"
        className="filters__toggle btn btn--ghost"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="filters-body"
      >
        Filters{activeCount > 0 ? ` (${activeCount})` : ''} <span aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>

      <div id="filters-body" className={`filters__body ${open ? 'filters__body--open' : ''}`}>
        <div className="field">
          <label htmlFor="filter-category">Food type</label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => onChange({ category: e.target.value })}
          >
            <option value="">All food types</option>
            {categories.map((c) => (
              <option key={c} value={c}>{prettify(c)}</option>
            ))}
          </select>
        </div>

        <div className="field field--pair">
          <div>
            <label htmlFor="filter-min">Min price ($)</label>
            <input
              id="filter-min"
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => onChange({ minPrice: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="filter-max">Max price ($)</label>
            <input
              id="filter-max"
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="Any"
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="filter-rating">Minimum rating</label>
          <select
            id="filter-rating"
            value={filters.minRating}
            onChange={(e) => onChange({ minRating: Number(e.target.value) })}
          >
            <option value={0}>Any rating</option>
            <option value={3}>3★ and up</option>
            <option value={3.5}>3.5★ and up</option>
            <option value={4}>4★ and up</option>
            <option value={4.5}>4.5★ and up</option>
          </select>
        </div>

        <div className="field field--check">
          <input
            id="filter-stock"
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ inStockOnly: e.target.checked })}
          />
          <label htmlFor="filter-stock">In stock only</label>
        </div>

        <button type="button" className="btn btn--ghost btn--block" onClick={onReset} disabled={activeCount === 0}>
          Reset filters
        </button>
      </div>
    </aside>
  );
}
