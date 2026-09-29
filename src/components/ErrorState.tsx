interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = 'Unable to load products. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="state state--error" role="alert">
      <div className="state__icon" aria-hidden="true">⚠️</div>
      <h2>Something went wrong</h2>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
