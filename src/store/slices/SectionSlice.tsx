import { createSection, fetchSections, fetchSectionById, fetchSectionBySlug, updateSection, deleteSection } from "@/src/services/SectionService";
import { SectionState } from "@/src/types/SectionTypes";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getSections = createAsyncThunk(
    "sections/fetch",
    async (
        { page, limit, search }: { page: number; limit: number; search: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await fetchSections({ page, limit, search });
            return res;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Error fetching sections");
        }
    }
);

export const getSectionById = createAsyncThunk(
    "sections/getSectionById",
    async (id: string, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { sections: SectionState };
            const existingSection = state.sections.sections.find((s) => s._id === id);

            if (existingSection) {
                return { data: existingSection };
            }

            const data = await fetchSectionById(id);
            if (!data || data.success === false) {
                return rejectWithValue(data?.message || "Section not found");
            }
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Section not found");
        }
    }
);

export const getSectionBySlug = createAsyncThunk(
    "sections/getSectionBySlug",
    async (slug: string, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { sections: SectionState };
            const existingSection = state.sections.sections.find((s) => s.slug === slug);

            if (existingSection) {
                return { data: existingSection };
            }

            const data = await fetchSectionBySlug(slug);
            if (!data || data.success === false) {
                return rejectWithValue(data?.message || "Section not found");
            }
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Section not found");
        }
    }
);

export const addSection = createAsyncThunk(
    "sections/addSection",
    async (data: any, { rejectWithValue }) => {
        try {
            const res = await createSection(data);
            return res;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to create section");
        }
    }
);

export const updateSectionThunk = createAsyncThunk(
    "sections/updateSection",
    async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
            const res = await updateSection(id, data);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to update section");
        }
    }
);

export const removeSection = createAsyncThunk(
    "sections/deleteSection",
    async (id: string, { rejectWithValue }) => {
        try {
            await deleteSection(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to delete section");
        }
    }
);

const initialState: SectionState = {
    sections: [],
    singleSection: null,
    pagination: null,
    loading: false,
    error: null,
};

const sectionSlice = createSlice({
    name: "sections",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSections.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSections.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload.data;
                state.sections = Array.isArray(data) ? data : (data ? [data] : []);
                state.pagination = action.payload.pagination || null;
            })
            .addCase(getSections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // getById
            .addCase(getSectionById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSectionById.fulfilled, (state, action) => {
                state.loading = false;
                state.singleSection = action.payload.data;
            })
            .addCase(getSectionById.rejected, (state) => {
                state.loading = false;
                state.singleSection = null;
            })

            // getBySlug
            .addCase(getSectionBySlug.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSectionBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.singleSection = action.payload.data;
            })
            .addCase(getSectionBySlug.rejected, (state) => {
                state.loading = false;
                state.singleSection = null;
            })

            // add
            .addCase(addSection.pending, (state) => {
                state.loading = true;
            })
            .addCase(addSection.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.data) {
                    state.sections.unshift(action.payload.data);
                }
            })
            .addCase(addSection.rejected, (state) => {
                state.loading = false;
            })

            // update
            .addCase(updateSectionThunk.fulfilled, (state, action) => {
                const updated = action.payload;
                if (updated) {
                    const index = state.sections.findIndex(
                        (s) => s._id === updated._id
                    );

                    if (index !== -1) {
                        state.sections[index] = updated;
                    } else {
                        state.sections.unshift(updated);
                    }

                    state.singleSection = updated;
                }
            })

            // delete
            .addCase(removeSection.fulfilled, (state, action) => {
                const id = action.payload;
                state.sections = state.sections.filter(s => s._id !== id);
            });
    },
});

export default sectionSlice.reducer;
