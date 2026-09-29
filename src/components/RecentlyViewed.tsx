import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/format';

interface RecentlyViewedProps {
  excludeId?: number;
}

export default function RecentlyViewed({ excludeId }: RecentlyViewedProps) {
  const { recent } = useApp();
  const items = recent.filter((p) => p.id !== excludeId);
  if (items.length === 0) return null;

  return (
    <section className="recent" aria-labelledby="recent-heading">
      <h2 id="recent-heading">Recently Viewed Products</h2>
      <ul className="recent__list">
        {items.map((p) => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`} className="recent__item">
              <img src={p.thumbnail} alt="" loading="lazy" width={64} height={64} />
              <span>
                <strong>{p.title}</strong>
                <small>{formatPrice(p.price)}</small>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
