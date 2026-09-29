import { Link } from 'react-router-dom';
import { MAX_COMPARE, useApp } from '../context/AppContext';
import EmptyState from '../components/EmptyState';
import ProductComparison from '../components/ProductComparison';

export default function ComparePage() {
  const { compare, clearCompare } = useApp();

  return (
    <div className="container page">
      <div className="page__head">
        <h1>Compare products</h1>
        {compare.length > 0 && (
          <button type="button" className="btn btn--ghost" onClick={clearCompare}>Clear all</button>
        )}
      </div>

      {compare.length === 0 ? (
        <EmptyState
          title="Select products from the Products page to compare."
          message={`You can compare up to ${MAX_COMPARE} products side by side.`}
          icon="⚖️"
          action={<Link to="/products" className="btn btn--primary">Browse products</Link>}
        />
      ) : (
        <>
          {compare.length < 2 && <p className="hint">Add at least one more product to see differences.</p>}
          <ProductComparison products={compare} />
        </>
      )}
    </div>
  );
}
