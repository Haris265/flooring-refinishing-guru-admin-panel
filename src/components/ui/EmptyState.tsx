type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="font-display text-xl text-brown">{title}</p>
      {description ? <p className="mt-2 text-sm">{description}</p> : null}
    </div>
  );
}
