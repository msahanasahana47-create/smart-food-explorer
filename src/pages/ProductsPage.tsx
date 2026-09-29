import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FilterState, Product, SortOption } from '../types/product';
import { SORT_OPTIONS } from '../types/product';
import { fetchAllProducts, searchProducts } from '../services/api';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import SortDropdown from '../components/SortDropdown';
import ProductGrid from '../components/ProductGrid';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import RecentlyViewed from '../components/RecentlyViewed';

const PAGE_SIZE = 12;

function sortProducts(list: Product[], sort: SortOption): Product[] {
  const copy = [...list];
  switch (sort) {
    case 'price-asc': return copy.sort((a, b) => a.price - b.price);
    case 'price-desc': return copy.sort((a, b) => b.price - a.price);
    case 'rating-desc': return copy.sort((a, b) => b.rating - a.rating);
    case 'discount-desc': return copy.sort((a, b) => b.discountPercentage - a.discountPercentage);
    case 'name-asc': return copy.sort((a, b) => a.title.localeCompare(b.title));
    default: return copy;
  }
}

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const sortParam = params.get('sort') as SortOption | null;
  const sort: SortOption = SORT_OPTIONS.some((o) => o.value === sortParam) ? (sortParam as SortOption) : 'default';

  const filters: FilterState = useMemo(
    () => ({
      category: params.get('category') ?? '',
      minPrice: params.get('min') ?? '',
      maxPrice: params.get('max') ?? '',
      minRating: Number(params.get('rating') ?? 0) || 0,
      inStockOnly: params.get('stock') === '1',
    }),
    [params],
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') next.delete(key);
            else next.set(key, value);
          });
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const handleSearch = useCallback((q: string) => updateParams({ q: q.trim() || null }), [updateParams]);

  // Products: all products, or the API's search results when a query is present.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    const request = query.trim()
      ? searchProducts(query.trim(), controller.signal)
      : fetchAllProducts(controller.signal);
    request
      .then((res) => {
        setProducts(res.products);
        setLoading(false);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, [query, reloadKey]);

  // Food types (fruit, meat, ...) come from the tags of the loaded products.
  const categories = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
    if (filters.category) tags.add(filters.category);
    return [...tags].sort();
  }, [products, filters.category]);

  const results = useMemo(() => {
    const min = filters.minPrice === '' ? null : Number(filters.minPrice);
    const max = filters.maxPrice === '' ? null : Number(filters.maxPrice);
    const filtered = products.filter(
      (p) =>
        (!filters.category || (p.tags ?? []).includes(filters.category)) &&
        (min === null || Number.isNaN(min) || p.price >= min) &&
        (max === null || Number.isNaN(max) || p.price <= max) &&
        p.rating >= filters.minRating &&
        (!filters.inStockOnly || p.stock > 0),
    );
    return sortProducts(filtered, sort);
  }, [products, filters, sort]);

  // Go back to the first page whenever the result set changes.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, filters, sort]);

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.minPrice !== '' ? 1 : 0) +
    (filters.maxPrice !== '' ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  const handleFilterChange = (patch: Partial<FilterState>) => {
    const updates: Record<string, string | null> = {};
    if ('category' in patch) updates.category = patch.category ?? null;
    if ('minPrice' in patch) updates.min = patch.minPrice ?? null;
    if ('maxPrice' in patch) updates.max = patch.maxPrice ?? null;
    if ('minRating' in patch) updates.rating = patch.minRating ? String(patch.minRating) : null;
    if ('inStockOnly' in patch) updates.stock = patch.inStockOnly ? '1' : null;
    updateParams(updates);
  };

  const resetFilters = () =>
    updateParams({ category: null, min: null, max: null, rating: null, stock: null });

  const clearAll = () => setParams({}, { replace: true });

  return (
    <div className="container page">
      <section className="hero">
        <h1>Find your next favorite food</h1>
        <p>Search fresh groceries, filter by type, price and rating, compare them, and check each one against our Explorer Score.</p>
        <SearchBar value={query} onSearch={handleSearch} />
      </section>

      <RecentlyViewed />

      <div className="layout">
        <FilterPanel
          filters={filters}
          categories={categories}
          activeCount={activeFilterCount}
          onChange={handleFilterChange}
          onReset={resetFilters}
        />

        <section className="results" aria-live="polite">
          <div className="results__bar">
            <p className="results__count">
              {loading
                ? 'Loading products...'
                : query
                  ? `${results.length} result${results.length === 1 ? '' : 's'} for “${query}”`
                  : `${results.length} product${results.length === 1 ? '' : 's'}`}
            </p>
            <SortDropdown value={sort} onChange={(v) => updateParams({ sort: v === 'default' ? null : v })} />
          </div>

          {loading && <LoadingState variant="grid" count={PAGE_SIZE} label="Loading products" />}

          {!loading && error && (
            <ErrorState
              message="Unable to load products. Please try again."
              onRetry={() => setReloadKey((k) => k + 1)}
            />
          )}

          {!loading && !error && results.length === 0 && (
            <EmptyState
              title="No products found."
              message="Try changing your search or filters."
              icon="🔎"
              action={
                <button type="button" className="btn btn--primary" onClick={clearAll}>
                  Clear search and filters
                </button>
              }
            />
          )}

          {!loading && !error && results.length > 0 && (
            <>
              <ProductGrid products={results.slice(0, visible)} />
              <div className="load-more">
                <p>Showing {Math.min(visible, results.length)} of {results.length}</p>
                {visible < results.length && (
                  <button type="button" className="btn btn--primary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Load More
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
