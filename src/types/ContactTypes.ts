export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "pending" | "resolved";
  createdAt: string;
  updatedAt: string;
}

export interface ContactState {
  contacts: Contact[];
  singleContact: Contact | null;
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