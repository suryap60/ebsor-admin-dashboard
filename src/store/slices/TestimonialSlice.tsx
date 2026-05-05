import { createTestimonial, fetchTestimonials, fetchTestimonialById, updateTestimonial, deleteTestimonial } from "@/src/services/TestimonialService";
import { TestimonialState } from "@/src/types/TestimonialTypes";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getTestimonials = createAsyncThunk(
    "testimonials/fetch",
    async (
        { page, limit, search }: { page: number; limit: number; search: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await fetchTestimonials({ page, limit, search });
            return res;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Error");
        }
    }
);

export const getTestimonialById = createAsyncThunk(
    "testimonials/getTestimonialById",
    async (id: string, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { testimonials: TestimonialState };
            const existingTestimonial = state.testimonials.testimonials.find((p) => p._id === id);

            if (existingTestimonial) {
                return { data: existingTestimonial };
            }

            const data = await fetchTestimonialById(id);
            if (!data || data.success === false) {
                return rejectWithValue(data?.message || "Testimonial not found");
            }
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Testimonial not found");
        }
    }
);

export const addTestimonial = createAsyncThunk(
    "testimonials/addTestimonial",
    async (data: any, { rejectWithValue }) => {
        try {
            const res = await createTestimonial(data);
            return res;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Create failed");
        }
    }
);

export const updateTestimonialThunk = createAsyncThunk(
    "testimonials/updateTestimonial",
    async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
            const res = await updateTestimonial(id, data);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Update failed");
        }
    }
);

export const removeTestimonial = createAsyncThunk(
    "testimonials/deleteTestimonial",
    async (id: string, { rejectWithValue }) => {
        try {
            await deleteTestimonial(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Delete failed");
        }
    }
);

const initialState: TestimonialState = {
    testimonials: [],
    singleTestimonial: null,
    pagination: null,
    loading: false,
    error: null,
};

const testimonialSlice = createSlice({
    name: "testimonials",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTestimonials.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTestimonials.fulfilled, (state, action) => {
                state.loading = false;
                state.testimonials = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(getTestimonials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // getById
            .addCase(getTestimonialById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTestimonialById.fulfilled, (state, action) => {
                state.loading = false;
                state.singleTestimonial = action.payload.data;
            })
            .addCase(getTestimonialById.rejected, (state) => {
                state.loading = false;
                state.singleTestimonial = null;
            })

            // add testimonial
            .addCase(addTestimonial.pending, (state) => {
                state.loading = true;
            })
            .addCase(addTestimonial.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.data) {
                    state.testimonials.unshift(action.payload.data);
                }
            })
            .addCase(addTestimonial.rejected, (state) => {
                state.loading = false;
            })

            // update testimonial
            .addCase(updateTestimonialThunk.fulfilled, (state, action) => {
                const updated = action.payload;
                if (updated) {
                    const index = state.testimonials.findIndex(
                        (t) => t._id === updated._id
                    );

                    if (index !== -1) {
                        state.testimonials[index] = updated;
                    } else {
                        state.testimonials.unshift(updated);
                    }

                    state.singleTestimonial = updated;
                }
            })

            // delete testimonial
            .addCase(removeTestimonial.fulfilled, (state, action) => {
                const id = action.payload;
                state.testimonials = state.testimonials.filter(t => t._id !== id);
            });
    },
});

export default testimonialSlice.reducer;
