import api from "../lib/axios";

// GET ALL
export const fetchFaqCategories = async (
  params?: {
    page?: number;
    limit?: number;
    search?: string;
  }
) => {
  const res = await api.get(
    "/faq-categories",
    {
      params,
    }
  );

  return res.data;
};

// GET BY ID
export const fetchFaqCategoryById =
  async (id: string) => {
    const res = await api.get(
      `/faq-categories/id/${id}`
    );

    return res.data;
  };

// CREATE
export const createFaqCategory =
  async (data: {
    name: string;
  }) => {
    const res = await api.post(
      "/faq-categories",
      data
    );

    return res.data;
  };

// UPDATE
export const updateFaqCategory =
  async (
    id: string,
    data: {
      name: string;
    }
  ) => {
    const res = await api.put(
      `/faq-categories/${id}`,
      data
    );

    return res.data;
  };

// DELETE
export const deleteFaqCategory =
  async (id: string) => {
    const res = await api.delete(
      `/faq-categories/${id}`
    );

    return res.data;
  };