import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MoodEntry } from '../../../types';
import { sqliteService } from '../../../service/sqliteService';

interface MoodState {
  entries: MoodEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: MoodState = {
  entries: [],
  loading: false,
  error: null,
};

export const fetchMoodEntries = createAsyncThunk(
  'mood/fetchMoodEntries',
  async () => {
    const entries = await sqliteService.getMoodEntries();
    return entries;
  }
);

export const createMoodEntry = createAsyncThunk(
  'mood/createMoodEntry',
  async (entryData: { date: string; mood: number; notes?: string }) => {
    const newEntry = {
      ...entryData,
      createdAt: new Date().toISOString(),
    };

    const id = await sqliteService.createMoodEntry(newEntry);
    return { ...newEntry, id };
  }
);

export const getMoodEntryByDate = createAsyncThunk(
  'mood/getMoodEntryByDate',
  async (date: string) => {
    const entry = await sqliteService.getMoodEntryByDate(date);
    return entry;
  }
);

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch mood entries
    builder
      .addCase(fetchMoodEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoodEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchMoodEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch mood entries';
      });

    // Create mood entry
    builder
      .addCase(createMoodEntry.fulfilled, (state, action) => {
        const existingIndex = state.entries.findIndex(
          (entry) => entry.date === action.payload.date
        );
        if (existingIndex !== -1) {
          state.entries[existingIndex] = action.payload;
        } else {
          state.entries.unshift(action.payload);
        }
      })
      .addCase(createMoodEntry.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create mood entry';
      });
  },
});

export const { clearError } = moodSlice.actions;
export default moodSlice.reducer;
