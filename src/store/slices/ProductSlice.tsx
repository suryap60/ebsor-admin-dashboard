import { createProduct, fetchProductById, fetchProducts, fetchSingleProduct } from "@/src/services/ProductSevices";
import { ProductState } from "@/src/types/Product";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (params: any) => {
    const data = await fetchProducts(params);
    return data;
  }
);

export const getSingleProduct = createAsyncThunk(
  "products/getSingleProduct",
  async (slug: string) => {
    const data = await fetchSingleProduct(slug);
    return data;
  }
);

export const getProductById = createAsyncThunk(
  "products/getProductById",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { products: ProductState };
      const existingProduct = state.products.products.find((p) => p._id === id);
      
      if (existingProduct) {
        return { data: existingProduct };
      }

      const data = await fetchProductById(id);
      if (!data || data.success === false) {
        return rejectWithValue(data?.message || "Product not found");
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Product not found");
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await createProduct(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);

const initialState: ProductState = {
  products: [],
  singleProduct: null,
  pagination: {},
  loading: false,
};



const productSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getSingleProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.singleProduct = action.payload.data;
      })
      .addCase(getSingleProduct.rejected, (state) => {
        state.loading = false;
        state.singleProduct = null;
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleProduct = action.payload.data;
      })
      .addCase(getProductById.rejected, (state) => {
        state.loading = false;
        state.singleProduct = null;
      })

      //add product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;

        // optional: add new product to list
        state.products.unshift(action.payload.data);
      })
      .addCase(addProduct.rejected, (state) => {
        state.loading = false;
      })
      
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
