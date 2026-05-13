import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  fetchFaqCategories,
  createFaqCategory,
  deleteFaqCategory,
  fetchFaqCategoryById,
  updateFaqCategory,
} from "@/src/services/FaqCategoryService";

import {
  FaqCategoryState,
} from "@/src/types/FaqCategory";

// GET ALL
export const getFaqCategories = createAsyncThunk(
  "faqCategories/get",
  async (params: any) => {
    return await fetchFaqCategories(params);
  }
);

// GET SINGLE
export const getFaqCategoryById = createAsyncThunk(
  "faqCategories/getById",
  async (id: string) => {
    return await fetchFaqCategoryById(id);
  }
);

// CREATE
export const addFaqCategory = createAsyncThunk(
  "faqCategories/create",
  async (data: { name: string }) => {
    return await createFaqCategory(data);
  }
);

// UPDATE
export const updateFaqCategoryThunk =
  createAsyncThunk(
    "faqCategories/update",
    async ({
      id,
      data,
    }: {
      id: string;
      data: { name: string };
    }) => {
      return await updateFaqCategory(id, data);
    }
  );

// DELETE
export const removeFaqCategory =
  createAsyncThunk(
    "faqCategories/delete",
    async (id: string) => {
      await deleteFaqCategory(id);
      return id;
    }
  );

const initialState: FaqCategoryState = {
  categories: [],
  singleCategory: null,
  pagination: {},
  loading: false,
  error: null,
};

const faqCategorySlice = createSlice({
  name: "faqCategories",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET ALL
      .addCase(getFaqCategories.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        getFaqCategories.fulfilled,
        (state, action) => {
          state.loading = false;

          state.categories =
            action.payload.data;

          state.pagination =
            action.payload.pagination;
        }
      )

      .addCase(
        getFaqCategories.rejected,
        (state) => {
          state.loading = false;
        }
      )

      // GET BY ID
      .addCase(
        getFaqCategoryById.fulfilled,
        (state, action) => {
          state.singleCategory =
            action.payload.data;
        }
      )

      // CREATE
      .addCase(
        addFaqCategory.fulfilled,
        (state, action) => {
          state.categories.unshift(
            action.payload.data
          );
        }
      )

      // UPDATE
      .addCase(
        updateFaqCategoryThunk.fulfilled,
        (state, action) => {
          const updated =
            action.payload.data;

          const index =
            state.categories.findIndex(
              (c) => c._id === updated._id
            );

          if (index !== -1) {
            state.categories[index] =
              updated;
          }
        }
      )

      // DELETE
      .addCase(
        removeFaqCategory.fulfilled,
        (state, action) => {
          state.categories =
            state.categories.filter(
              (c) => c._id !== action.payload
            );
        }
      );
  },
});

export default faqCategorySlice.reducer;