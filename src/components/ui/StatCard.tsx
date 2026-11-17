import Link from "next/link";

type StatCardProps = {
  label: string;
  value: number | string;
  href: string;
};

export function StatCard({ label, value, href }: StatCardProps) {
  return (
    <Link href={href} className="stat-card">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
    </Link>
  );
}
