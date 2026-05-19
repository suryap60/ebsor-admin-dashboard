import { Pagination } from "./Pagination";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  category: string;
  order: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface ProductState {
  products: Product[];
  singleProduct: Product | null;
  pagination: Pagination;
  loading: boolean;
}

export interface ReorderProductPayload {
  id: string;
  order: number;
}