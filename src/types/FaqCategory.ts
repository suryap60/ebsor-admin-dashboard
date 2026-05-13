// types/FaqCategory.ts

export interface FaqCategory {
  _id: string;
  name: string;
  slug: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface FaqCategoryState {
  categories: FaqCategory[];
  singleCategory: FaqCategory | null;

  pagination: {
    total?: number;
    page?: number;
    page_size?: number;
    total_pages?: number;
    next?: string | null;
    previous?: string | null;
  };

  loading: boolean;
  error?: string | null;
}