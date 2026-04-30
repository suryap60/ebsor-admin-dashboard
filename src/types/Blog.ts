export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  tags: string[];
  author: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface BlogState {
  blogs: Blog[];
  singleBlog: Blog | null;
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