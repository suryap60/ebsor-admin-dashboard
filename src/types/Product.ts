import { Pagination } from "./Pagination";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductState {
  products: Product[];
  singleProduct: Product | null;
  pagination: Pagination;
  loading: boolean;
}