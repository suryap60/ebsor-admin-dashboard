export interface Brand {
  _id: string;
  name: string;
  industry: string;
  logo: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface BrandState {
  brands: Brand[];
  singleBrand: Brand | null;

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