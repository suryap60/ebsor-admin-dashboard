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
  name: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter: string;
  status: string;
  createdAt: string;
  job: Job;
}

export interface ApplicationState {
  applications: Application[];
  pagination: any;
  loading: boolean;
  error: string | null;
}