import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { extractErrorMessage } from '@/api/client';
import * as sipApi from '@/api/sip';
import type { Sip } from '@/types';

interface SipState {
  items: Sip[];
  loading: boolean;
  error: string | null;
  completed: Sip[];
  completedLoading: boolean;
  completedError: string | null;
}

const initialState: SipState = {
  items: [],
  loading: false,
  error: null,
  completed: [],
  completedLoading: false,
  completedError: null,
};

export const fetchSips = createAsyncThunk<Sip[], void, { rejectValue: string }>(
  'sip/fetchSips',
  async (_, { rejectWithValue }) => {
    try {
      return await sipApi.getMySips();
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Could not load SIPs'));
    }
  }
);

export const fetchCompletedSips = createAsyncThunk<
  Sip[],
  void,
  { rejectValue: string }
>('sip/fetchCompleted', async (_, { rejectWithValue }) => {
  try {
    return await sipApi.getCompletedSips();
  } catch (err) {
    return rejectWithValue(
      extractErrorMessage(err, 'Could not load completed SIPs')
    );
  }
});

const sipSlice = createSlice({
  name: 'sip',
  initialState,
  reducers: {
    resetSips() {
      return initialState;
    },
    upsertSip(state, action: { payload: Sip }) {
      const idx = state.items.findIndex((s) => s._id === action.payload._id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSips.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Could not load SIPs';
      });

    builder
      .addCase(fetchCompletedSips.pending, (state) => {
        state.completedLoading = true;
        state.completedError = null;
      })
      .addCase(fetchCompletedSips.fulfilled, (state, action) => {
        state.completedLoading = false;
        state.completed = action.payload;
      })
      .addCase(fetchCompletedSips.rejected, (state, action) => {
        state.completedLoading = false;
        state.completedError = action.payload ?? 'Could not load completed SIPs';
      });
  },
});

export const { resetSips, upsertSip } = sipSlice.actions;
export default sipSlice.reducer;
