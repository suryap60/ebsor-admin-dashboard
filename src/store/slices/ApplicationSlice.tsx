import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getApplications } from "@/src/services/ApplicationService";
import { ApplicationState } from "@/src/types/ApplicationTypes";

export const fetchApplications = createAsyncThunk(
  "applications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getApplications();
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

const initialState: ApplicationState = {
  applications: [],
  pagination: null,
  loading: false,
  error: null,
};

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default applicationSlice.reducer;