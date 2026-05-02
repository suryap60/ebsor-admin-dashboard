import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/ProductSlice";
import authReducer from "./slices/authSlice";
import blogReducer from "./slices/BlogSlice";
import applicationReducer from "./slices/ApplicationSlice";
import ContactReducer from "./slices/ContactSlice";


export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    blogs: blogReducer,
    applications : applicationReducer,
    contacts: ContactReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;