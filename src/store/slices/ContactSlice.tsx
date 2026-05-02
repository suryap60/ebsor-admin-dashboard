import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchContactById, fetchContacts, updateContactStatus } from "@/src/services/ContactService";
import { ContactState } from "@/src/types/ContactTypes";

export const getContacts = createAsyncThunk(
  "contacts/fetch",
  async (
    { page, limit, search }: { page: number; limit: number; search: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetchContacts({ page, limit, search });
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const getContactById = createAsyncThunk(
  "contacts/getContactById",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("API CALL START:", id);

      const data = await fetchContactById(id);

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

export const updateContactStatusThunk = createAsyncThunk(
  "contacts/updateStatus",
  async (
    { id, status }: { id: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateContactStatus(id, status);

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

const initialState: ContactState = {
  contacts: [],
  singleContact: null,
  pagination: null,
  loading: false,
  error: null,
};

const contactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    clearSingleContact: (state) => {
      state.singleContact = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getContactById.pending, (state) => {
        console.log("Pending...");
        state.loading = true;
      })
      .addCase(getContactById.fulfilled, (state, action) => {
        console.log("Fulfilled:", action.payload);
        state.loading = false;
        state.singleContact = action.payload.data;
      })
      .addCase(getContactById.rejected, (state, action) => {
        console.log("Rejected:", action.payload);
        state.loading = false;
        state.singleContact = null;
      })

      .addCase(updateContactStatusThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateContactStatusThunk.fulfilled, (state, action) => {
        state.loading = false;

        // update single application
        state.singleContact = action.payload.data;

        // update list (important)
        state.contacts = state.contacts.map((app) =>
          app._id === action.payload.data._id
            ? { ...app, status: action.payload.data.status }
            : app
        );
      })
      .addCase(updateContactStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default contactSlice.reducer;