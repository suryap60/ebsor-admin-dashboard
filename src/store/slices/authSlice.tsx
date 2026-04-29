import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, signupUser } from "@/src/services/AuthService";
import { AuthState } from "@/src/types/Auth";


export const signup = createAsyncThunk(
    "auth/signup",
    async (data: { name: string; email: string; password: string; role?: string }, { rejectWithValue }) => {
        try {
            const res = await signupUser(data);
            return res;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Signup failed");
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await loginUser(data);
            return res;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);

const initialState: AuthState = {
    user: null,
    accessToken: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;

                const data = action.payload.data;

                state.user = data.user || data; // depends on backend response

                // optional (if tokens returned)
                if (data.accessToken) {
                    state.accessToken = data.accessToken;
                    localStorage.setItem("accessToken", data.accessToken);
                }

                localStorage.setItem("user", JSON.stringify(state.user));
            })
            .addCase(signup.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;

                const data = action.payload.data;

                state.user = data.user;
                state.accessToken = data.accessToken;

                // store in localStorage
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("user", JSON.stringify(data.user));
            })
            .addCase(login.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});



export const { logout } = authSlice.actions;
export default authSlice.reducer;