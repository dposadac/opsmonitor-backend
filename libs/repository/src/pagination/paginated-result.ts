/**
 * Generic pagination contracts shared across bounded contexts.
 * Keeps the page/limit math and response shape in a single place.
 */

export interface PaginationMeta {
  /** Total number of records matching the query (ignoring page/limit). */
  total: number;
  /** Current 1-based page. */
  page: number;
  /** Page size used for this query. */
  limit: number;
  /** Total number of pages for the current page size. */
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Default page size when the caller does not provide one. */
export const DEFAULT_PAGE_SIZE = 20;

/** Normalizes a 1-based page, defaulting/clamping invalid input to 1. */
export function normalizePage(page?: number): number {
  return page && page > 0 ? Math.floor(page) : 1;
}

/** Normalizes the page size, defaulting/clamping invalid input. */
export function normalizeLimit(limit?: number): number {
  return limit && limit > 0 ? Math.floor(limit) : DEFAULT_PAGE_SIZE;
}

/** Builds the pagination metadata from the total count and page params. */
export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
