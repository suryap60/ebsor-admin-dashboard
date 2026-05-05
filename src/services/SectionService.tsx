import api from "../lib/axios";

export const fetchSections = async (params: {
    page?: number;
    limit?: number;
    search?: string;
}) => {
    const res = await api.get("/sections", { params });
    return res.data;
};

export const fetchSectionById = async (id: string) => {
  const res = await api.get(`/sections/id/${id}`);
  return res.data;
};

export const fetchSectionBySlug = async (slug: string) => {
  const res = await api.get(`/sections/slug/${slug}`);
  return res.data;
};

export const createSection = async (data: any) => {
  const res = await api.post("/sections", data);
  return res.data;
};

export const updateSection = async (id: string, data: any) => {
  const res = await api.put(`/sections/${id}`, data);
  return res.data;
};

export const deleteSection = async (id: string) => {
    const res = await api.delete(`/sections/${id}`);
    return res.data;
};
