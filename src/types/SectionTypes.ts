import { FaqCategory } from "./FaqCategory";

export interface FAQ {
  _id?: string;
  question: string;
  answer: string;
  categories: string[] | FaqCategory;
}

export interface Section {
  _id: string;
  title: string;
  slug: string;
  type: "terms" | "faq" | "privacy" | "refund";
  content?: string;
  faqs?: FAQ[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SectionState {
  sections: Section[];
  singleSection: Section | null;
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
  } | null;
  loading: boolean;
  error: string | null;
}
