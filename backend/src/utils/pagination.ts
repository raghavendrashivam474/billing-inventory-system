// ================================
// Pagination Utility
// Project: Billing & Inventory Management System
// Sprint: 2.2 — Category & Brand CRUD
// ================================

export interface PaginationParams {
  page:   number;
  limit:  number;
  search: string;
  sort:   string;
  order:  'asc' | 'desc';
  active: boolean | undefined;
}

export interface PaginationMeta {
  page:       number;
  limit:      number;
  total:      number;
  totalPages: number;
}

export function buildPaginationMeta(
  total: number,
  page:  number,
  limit: number
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export function parsePaginationParams(query: Record<string, unknown>): PaginationParams {
  const page   = Math.max(1, parseInt(String(query.page  ?? '1'),  10));
  const limit  = Math.min(100, Math.max(1, parseInt(String(query.limit ?? '20'), 10)));
  const search = String(query.search ?? '').trim();
  const sort   = String(query.sort   ?? 'createdAt').trim();
  const order  = query.order === 'desc' ? 'desc' : 'asc';
  const active = query.active === undefined
    ? undefined
    : query.active === 'true';

  return { page, limit, search, sort, order, active };
}