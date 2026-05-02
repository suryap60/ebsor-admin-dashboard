import api from "../lib/axios";

export const fetchContacts = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await api.get(`/contact?page=${page}&limit=${limit}&search=${search}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return res.data;
};


export const fetchContactById = async (id: string) => {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

  const res = await api.get(`/contact/id/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return res.data;
};

export const updateContactStatus = async (
  id: string,
  status: string
) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await api.patch(
    `/contact/${id}/status`,
    { status },
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  return res.data;
};