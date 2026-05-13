import api from "../lib/axios";

// GET ALL
export const fetchBrands = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const res = await api.get("/brands", { params });
  return res.data;
};

// GET SINGLE BY ID
export const fetchBrandById = async (id: string) => {
  const res = await api.get(`/brands/id/${id}`);
  return res.data;
};

// CREATE
export const createBrand = async (data: FormData) => {
  const res = await api.post("/brands", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// UPDATE
export const updateBrand = async (
  id: string,
  data: FormData
) => {
  const res = await api.put(`/brands/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// DELETE
export const deleteBrand = async (id: string) => {
  const res = await api.delete(`/brands/${id}`);
  return res.data;
};