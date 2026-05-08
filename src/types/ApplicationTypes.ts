export interface Job {
  _id: string;
  title: string;
  slug: string;
  location: string;
  employmentType: string;
  salary: string;
}

export interface Application {
  _id: string;

  firstName: string;
  lastName?: string;

  email: string;
  phone: string;

  country?: string;
  state?: string;
  place?: string;

  experience?: number;

  additionalInfo?: string;

  resume: string;

  status: "pending" | "reviewed" | "rejected" | "selected";

  createdAt: string;

  job: Job;
}

export interface ApplicationState {
  applications: Application[];
  singleApplication: Application | null;
  pagination: any;
  loading: boolean;
  error: string | null;
}