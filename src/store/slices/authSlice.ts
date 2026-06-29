import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as authApi from '@/api/auth';
import { extractErrorMessage, loadToken } from '@/api/client';
import type { SignupPayload, User } from '@/types';

export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated';

interface AuthState {
  user: User | null;
  status: AuthStatus;
  bootstrapped: boolean;
  error: string | null;
  submitting: boolean;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  bootstrapped: false,
  error: null,
  submitting: false,
};

/** Restore a session on app launch using a persisted token. */
export const bootstrapAuth = createAsyncThunk<User | null>(
  'auth/bootstrap',
  async () => {
    const token = await loadToken();
    if (!token) {
      return null;
    }
    try {
      return await authApi.fetchProfile();
    } catch {
      return null;
    }
  }
);

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    return await authApi.login(email, password);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, 'Login failed'));
  }
});

export const loginAdmin = createAsyncThunk<
  User,
  { email: string; password: string; code: string },
  { rejectValue: string }
>('auth/loginAdmin', async ({ email, password, code }, { rejectWithValue }) => {
  try {
    return await authApi.adminLogin(email, password, code);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, 'Admin login failed'));
  }
});

export const signupUser = createAsyncThunk<
  User,
  SignupPayload,
  { rejectValue: string }
>('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    return await authApi.signup(payload);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, 'Signup failed'));
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    setUser(state, action: { payload: User | null }) {
      state.user = action.payload;
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = action.payload ? 'authenticated' : 'unauthenticated';
        state.bootstrapped = true;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.user = null;
        state.status = 'unauthenticated';
        state.bootstrapped = true;
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.submitting = false;
        state.user = action.payload;
        state.status = 'authenticated';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Login failed';
      });

    builder
      .addCase(loginAdmin.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.submitting = false;
        state.user = action.payload;
        state.status = 'authenticated';
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Admin login failed';
      });

    builder
      .addCase(signupUser.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.submitting = false;
        state.user = action.payload;
        state.status = 'authenticated';
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Signup failed';
      });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.status = 'unauthenticated';
    });
  },
});

export const { clearAuthError, setUser } = authSlice.actions;
export default authSlice.reducer;
