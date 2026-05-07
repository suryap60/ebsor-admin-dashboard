import { createBlog, fetchBlogById, fetchBlogs, fetchSingleBlog } from "@/src/services/BlogService";
import { createProduct, fetchProductById, fetchProducts, fetchSingleProduct } from "@/src/services/ProductSevices";
import { BlogState } from "@/src/types/Blog";
import { ProductState } from "@/src/types/Product";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getBlogs = createAsyncThunk(
  "blogs/getBlogs",
  async (params: any) => {
    const data = await fetchBlogs(params);
    return data;
  }
);

export const getSingleBlog = createAsyncThunk(
  "blogs/getSingleBlog",
  async (slug: string) => {
    const data = await fetchSingleBlog(slug);
    return data;
  }
);

export const getBlogById = createAsyncThunk(
  "blogs/getBlogById",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { blogs: BlogState };
      const existingBlog = state.blogs.blogs.find((p) => p._id === id);
      
      if (existingBlog) {
        return { data: existingBlog };
      }

      const data = await fetchBlogById(id);
      if (!data || data.success === false) {
        return rejectWithValue(data?.message || "Blog not found");
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Blog not found");
    }
  }
);

export const addBlog = createAsyncThunk(
  "blogs/addBlog",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await createBlog(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);

const initialState: BlogState = {
  blogs: [],
  singleBlog: null,
  pagination: {},
  loading: false,
};

const blogSlice = createSlice({
  name: "blogs",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getBlogs.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getSingleBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.singleBlog = action.payload.data;
      })
      .addCase(getSingleBlog.rejected, (state) => {
        state.loading = false;
        state.singleBlog = null;
      })
      .addCase(getBlogById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleBlog = action.payload.data;
      })
      .addCase(getBlogById.rejected, (state) => {
        state.loading = false;
        state.singleBlog = null;
      })

      //add product
      .addCase(addBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.loading = false;

        // optional: add new product to list
        // state.blogs.unshift(action.payload.data);
      })
      .addCase(addBlog.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default blogSlice.reducer;