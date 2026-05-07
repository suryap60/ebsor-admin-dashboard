import { changePasswordService, getProfileService, updateProfileService } from "@/src/services/ProfileService";
import { ChangePasswordPayload, ProfileState, UpdateProfilePayload } from "@/src/types/profile";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const getProfile = createAsyncThunk(
  "profile/get",
  async (_, thunkAPI) => {
    try {
      return await getProfileService();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (data: UpdateProfilePayload, thunkAPI) => {
    try {
      return await updateProfileService(data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (data: ChangePasswordPayload, thunkAPI) => {
    try {
      return await changePasswordService(data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET PROFILE
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(getProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CHANGE PASSWORD
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;