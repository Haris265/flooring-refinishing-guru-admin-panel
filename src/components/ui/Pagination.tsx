"use client";

import { DEFAULT_PAGE_SIZE, totalPages } from "@/lib/paginate";

type PaginationProps = {
  page: number;
  pageSize?: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  pageSize = DEFAULT_PAGE_SIZE,
  total,
  onPageChange,
}: PaginationProps) {
  if (total <= pageSize) return null;

  const pages = totalPages(total, pageSize);
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brown/10 bg-white px-4 py-3">
      <p className="text-sm text-muted">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn-ghost text-sm"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
        >
          Prev
        </button>
        <span className="min-w-[4.5rem] text-center text-sm font-semibold text-brown">
          {safePage} / {pages}
        </span>
        <button
          type="button"
          className="btn-ghost text-sm"
          disabled={safePage >= pages}
          onClick={() => onPageChange(safePage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
