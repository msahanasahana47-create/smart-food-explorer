import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import EmptyState from '../components/EmptyState';
import ProductGrid from '../components/ProductGrid';

export default function FavoritesPage() {
  const { favorites } = useApp();

  return (
    <div className="container page">
      <div className="page__head">
        <h1>Your favorites</h1>
        {favorites.length > 0 && <p>{favorites.length} saved</p>}
      </div>
      {favorites.length === 0 ? (
        <EmptyState
          title="You haven't added any favorites yet."
          message="Tap the heart on any product to save it here."
          icon="💚"
          action={<Link to="/products" className="btn btn--primary">Browse products</Link>}
        />
      ) : (
        <ProductGrid products={favorites} labelledFavorite />
      )}
    </div>
  );
}
