export interface Job {
  _id: string;
  title: string;
  slug: string;
  description: string;
  department: string;
  location: string;
  employmentType: "full-time" | "part-time" | "internship" | "contract";
  salary: string;
  isActive: boolean;
  createdAt: string;
}

export interface JobState {
  jobs: Job[];
  singleJob: Job | null;
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