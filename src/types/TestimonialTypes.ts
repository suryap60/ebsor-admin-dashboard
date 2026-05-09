export interface Testimonial {
  _id: string;
  name: string;
  designation: string;
  description: string;
  rating: number;
  image:string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestimonialState {
  testimonials: Testimonial[];
  singleTestimonial: Testimonial | null;
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
