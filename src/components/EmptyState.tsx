import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: string;
  action?: ReactNode;
}

export default function EmptyState({ title, message, icon = '🥗', action }: EmptyStateProps) {
  return (
    <div className="state">
      <div className="state__icon" aria-hidden="true">{icon}</div>
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
