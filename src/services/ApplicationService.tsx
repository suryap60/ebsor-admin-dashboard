import api from "../lib/axios";

export const getApplications = async () => {
  const res = await api.get("/applications", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.data;
};