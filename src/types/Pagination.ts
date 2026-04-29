export interface Pagination {
  total?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
  next?: string | null;
  previous?: string | null;
}