type LoadingBlockProps = {
  label?: string;
};

export function LoadingBlock({ label = "Loading…" }: LoadingBlockProps) {
  return (
    <div className="space-y-3 py-6" aria-busy="true" aria-label={label}>
      <div className="skeleton h-8 w-48" />
      <div className="skeleton h-24 w-full" />
      <div className="skeleton h-24 w-full" />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
