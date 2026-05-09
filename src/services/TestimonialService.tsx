import api from "../lib/axios";

export const fetchTestimonials = async (params: {
    page?: number;
    limit?: number;
    search?: string;
}) => {
    const res = await api.get("/testimonials", { params });
    return res.data;
};

export const fetchTestimonialById = async (id: string) => {
  const res = await api.get(`/testimonials/${id}`);
  return res.data;
};

export const createTestimonial = async (data: any) => {
  const res = await api.post("/testimonials", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateTestimonial = async (id: string, data: any) => {
  const res = await api.put(`/testimonials/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteTestimonial = async (id: string) => {
    const res = await api.delete(`/testimonials/${id}`);
    return res.data;
};
