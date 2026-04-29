import api from "../lib/axios";

export const fetchProducts = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const res = await api.get("/products", { params });
  return res.data;
};

export const fetchSingleProduct = async (slug: string) => {
  const res = await api.get(`/products/${slug}`);
  return res.data;
};

export const createProduct = async (data: any) => {
  const res = await api.post("/products", data);
  return res.data;
};

export const updateProduct = async (id: string, data: any) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};