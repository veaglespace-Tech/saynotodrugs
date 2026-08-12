import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import appReducer from './slice/appSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
