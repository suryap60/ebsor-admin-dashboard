export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileState {
  profile: IUser | null;
  loading: boolean;
  error: string | null;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}