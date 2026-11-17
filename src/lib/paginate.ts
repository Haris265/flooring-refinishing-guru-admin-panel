export const DEFAULT_PAGE_SIZE = 10;

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
): T[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function totalPages(total: number, pageSize: number = DEFAULT_PAGE_SIZE) {
  return Math.max(1, Math.ceil(total / pageSize) || 1);
}
