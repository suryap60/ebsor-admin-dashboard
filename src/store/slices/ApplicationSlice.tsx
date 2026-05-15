import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchApplicationById, fetchApplications, updateApplicationStatus } from "@/src/services/ApplicationService";
import { ApplicationState } from "@/src/types/ApplicationTypes";

export const getApplications = createAsyncThunk(
  "applications/fetch",
  async (params: any) => {
    try {
      const res = await fetchApplications(params);
      return res;
    } catch (err: any) {
      return console.log(err.response?.data?.message || "Error");
    }
  }
);

export const getApplicationById = createAsyncThunk(
  "applications/getApplicationById",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("API CALL START:", id);

      const data = await fetchApplicationById(id);

      console.log("API RESPONSE:", data);

      if (!data || data.success === false) {
        return rejectWithValue(data?.message || "Application not found");
      }

      return data;
    } catch (error: any) {
      console.log("API ERROR:", error);
      return rejectWithValue(
        error.response?.data?.message || "Application not found"
      );
    }
  }
);

export const updateApplicationStatusThunk = createAsyncThunk(
  "applications/updateStatus",
  async (
    { id, status }: { id: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateApplicationStatus(id, status);

      if (!data || data.success === false) {
        return rejectWithValue(data?.message || "Update failed");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Update failed"
      );
    }
  }
);

const initialState: ApplicationState = {
  applications: [],
  singleApplication: null,
  pagination: null,
  loading: false,
  error: null,
};

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    clearSingleApplication: (state) => {
      state.singleApplication = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getApplicationById.pending, (state) => {
        console.log("Pending...");
        state.loading = true;
      })
      .addCase(getApplicationById.fulfilled, (state, action) => {
        console.log("Fulfilled:", action.payload);
        state.loading = false;
        state.singleApplication = action.payload.data;
      })
      .addCase(getApplicationById.rejected, (state, action) => {
        console.log("Rejected:", action.payload);
        state.loading = false;
        state.singleApplication = null;
      })

      .addCase(updateApplicationStatusThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateApplicationStatusThunk.fulfilled, (state, action) => {
        state.loading = false;

        // update single application
        state.singleApplication = action.payload.data;

        // update list (important)
        state.applications = state.applications.map((app) =>
          app._id === action.payload.data._id
            ? { ...app, status: action.payload.data.status }
            : app
        );
      })
      .addCase(updateApplicationStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default applicationSlice.reducer;