import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter/counterSlice";
import authReducer from './auth/authSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        auth: authReducer,
    },
});
