import api from "../lib/axios";

export const fetchCarrers = async (params: {
    page?: number;
    limit?: number;
    search?: string;
}) => {
    const res = await api.get("/jobs", { params });
    return res.data;
};


export const fetchSingleJob = async (slug: string) => {
    const res = await api.get(`/jobs/slug/${slug}`);
    return res.data;
};

export const fetchJobById = async (id: string) => {
  const res = await api.get(`/jobs/id/${id}`);
  return res.data;
};

export const createJob = async (data: any) => {
  const res = await api.post("/jobs", data);
  return res.data;
};

export const updateJob = async (id: string, data: any) => {
  const res = await api.put(`/jobs/${id}`, data);
  return res.data;
};


export const deleteJob = async (id: string) => {
    const res = await api.delete(`/jobs/${id}`);
    return res.data;
};