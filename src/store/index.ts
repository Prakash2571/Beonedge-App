import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import sipReducer from './slices/sipSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sip: sipReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
