import api from "@/src/lib/axios";
import { ChangePasswordPayload, UpdateProfilePayload } from "../types/profile";


export const getProfileService = async () => {
  const res = await api.get("/profile");
  return res.data;
};

export const updateProfileService = async (
  data: UpdateProfilePayload
) => {
  const res = await api.put("/profile/update", data);
  return res.data;
};

export const changePasswordService = async (
  data: ChangePasswordPayload
) => {
  const res = await api.put("/profile/change-password", data);
  return res.data;
};