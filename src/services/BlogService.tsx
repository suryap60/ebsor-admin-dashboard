import api from "../lib/axios";

export const fetchBlogs = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  const res = await api.get("/blogs", { params });
  return res.data;
};

// gets blog by slug
export const fetchSingleBlog = async (slug: string) => {
  const res = await api.get(`/blogs/slug/${slug}`);
  return res.data;
};

// gets blog by id
export const fetchBlogById = async (id: string) => {
  const res = await api.get(`/blogs/id/${id}`);
  return res.data;
};

export const createBlog = async (data: any) => {
  const res = await api.post("/blogs", data);
  return res.data;
};

export const updateBlog = async (id: string, data: any) => {
  const res = await api.put(`/blogs/${id}`, data);
  return res.data;
};

export const deleteBlog = async (id: string) => {
  const res = await api.delete(`/blogs/${id}`);
  return res.data;
};