import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/ProductSlice";
import authReducer from "./slices/authSlice";
import blogReducer from "./slices/BlogSlice";
import applicationReducer from "./slices/ApplicationSlice";
import ContactReducer from "./slices/ContactSlice";
import careerReducer from "./slices/CareerSlice"
import testimonialReducer from "./slices/TestimonialSlice"
import sectionReducer from "./slices/SectionSlice"
import profileReducer from "./slices/ProfileSlice";


export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    blogs: blogReducer,
    applications : applicationReducer,
    contacts: ContactReducer,
    careers: careerReducer,
    testimonials: testimonialReducer,
    sections: sectionReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;