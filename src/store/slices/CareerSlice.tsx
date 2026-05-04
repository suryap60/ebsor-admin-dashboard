import { createJob, fetchCarrers, fetchJobById, fetchSingleJob, updateJob } from "@/src/services/CareerService";
import { JobState } from "@/src/types/Careers";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getCareers = createAsyncThunk(
    "jobs/fetch",
    async (
        { page, limit, search }: { page: number; limit: number; search: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await fetchCarrers({ page, limit, search });
            return res;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Error");
        }
    }
);

export const getSingleJob = createAsyncThunk(
    "jobs/getSingleJob",
    async (slug: string) => {
        const data = await fetchSingleJob(slug);
        return data;
    }
);

export const getJobById = createAsyncThunk(
    "jobs/getProductById",
    async (id: string, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { careers: JobState };
            const existingJob = state.careers.jobs.find((p) => p._id === id);

            if (existingJob) {
                return { data: existingJob };
            }

            const data = await fetchJobById(id);
            if (!data || data.success === false) {
                return rejectWithValue(data?.message || "Job not found");
            }
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Job not found");
        }
    }
);

export const addJob = createAsyncThunk(
    "careers/addJob",
    async (data: any, { rejectWithValue }) => {
        try {
            const res = await createJob(data);
            return res;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Create failed");
        }
    }
);

export const updateJobThunk = createAsyncThunk(
    "jobs/updateJob",
    async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
            const res = await updateJob(id, data);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Update failed");
        }
    }
);

const initialState: JobState = {
    jobs: [],
    singleJob: null,
    pagination: null,
    loading: false,
    error: null,
};

const careerSlice = createSlice({
    name: "jobs",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCareers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCareers.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(getCareers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // jobBySlug
            .addCase(getSingleJob.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSingleJob.fulfilled, (state, action) => {
                state.loading = false;
                state.singleJob = action.payload.data;
            })
            .addCase(getSingleJob.rejected, (state) => {
                state.loading = false;
                state.singleJob = null;
            })

            // jobById
            .addCase(getJobById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getJobById.fulfilled, (state, action) => {
                state.loading = false;
                state.singleJob = action.payload.data;
            })
            .addCase(getJobById.rejected, (state) => {
                state.loading = false;
                state.singleJob = null;
            })

            //add job
            .addCase(addJob.pending, (state) => {
                state.loading = true;
            })
            .addCase(addJob.fulfilled, (state, action) => {
                state.loading = false;

                // optional: add new product to list
                state.jobs.unshift(action.payload.data);
            })
            .addCase(addJob.rejected, (state) => {
                state.loading = false;
            })

            // update job
            .addCase(updateJobThunk.fulfilled, (state, action) => {
                const updated = action.payload;

                const index = state.jobs.findIndex(
                    (job) => job._id === updated._id
                );

                if (index !== -1) {
                    state.jobs[index] = updated;
                } else {
                    // if not found, add it (important for admin)
                    state.jobs.unshift(updated);
                }

                state.singleJob = updated;
            })
    },
});

export default careerSlice.reducer;