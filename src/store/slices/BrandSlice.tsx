import {
  createBrand,
  fetchBrandById,
  fetchBrands,
} from "@/src/services/BrandService";

import { BrandState } from "@/src/types/Brand";

import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

// GET ALL
export const getBrands = createAsyncThunk(
  "brands/getBrands",
  async (params: any) => {
    const data = await fetchBrands(params);
    return data;
  }
);

// GET BY ID
export const getBrandById = createAsyncThunk(
  "brands/getBrandById",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await fetchBrandById(id);

      if (!data || data.success === false) {
        return rejectWithValue("Brand not found");
      }

      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Brand not found"
      );
    }
  }
);

// CREATE
export const addBrand = createAsyncThunk(
  "brands/addBrand",
  async (data: FormData, { rejectWithValue }) => {
    try {
      return await createBrand(data);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Create failed"
      );
    }
  }
);

const initialState: BrandState = {
  brands: [],
  singleBrand: null,
  pagination: {},
  loading: false,
};

const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET ALL
      .addCase(getBrands.pending, (state) => {
        state.loading = true;
      })

      .addCase(getBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.data;
        state.pagination = action.payload.pagination;
      })

      .addCase(getBrands.rejected, (state) => {
        state.loading = false;
      })

      // GET BY ID
      .addCase(getBrandById.pending, (state) => {
        state.loading = true;
      })

      .addCase(getBrandById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleBrand = action.payload.data;
      })

      .addCase(getBrandById.rejected, (state) => {
        state.loading = false;
        state.singleBrand = null;
      })

      // CREATE
      .addCase(addBrand.pending, (state) => {
        state.loading = true;
      })

      .addCase(addBrand.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(addBrand.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default brandSlice.reducer;