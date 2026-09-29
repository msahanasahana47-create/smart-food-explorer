interface LoadingStateProps {
  variant?: 'grid' | 'spinner';
  count?: number;
  label?: string;
}

export default function LoadingState({ variant = 'spinner', count = 8, label = 'Loading...' }: LoadingStateProps) {
  if (variant === 'grid') {
    return (
      <div className="product-grid" aria-busy="true" aria-label={label}>
        {Array.from({ length: count }, (_, i) => (
          <div className="card skeleton-card" key={i} aria-hidden="true">
            <div className="skeleton skeleton--img" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--short" />
            <div className="skeleton skeleton--line" />
          </div>
        ))}
        <span className="sr-only" role="status">{label}</span>
      </div>
    );
  }
  return (
    <div className="state" role="status" aria-busy="true">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
