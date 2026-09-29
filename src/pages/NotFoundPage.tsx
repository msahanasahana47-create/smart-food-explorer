import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';

export default function NotFoundPage() {
  return (
    <div className="container page">
      <EmptyState
        title="404 – Page not found"
        message="The page you're looking for doesn't exist."
        icon="🧭"
        action={<Link to="/products" className="btn btn--primary">Back to Products</Link>}
      />
    </div>
  );
}
