import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBoxesProductPage } from "../../config/Data";


// Async thunk to fetch boxes
export const loadBoxes = createAsyncThunk(
  "boxes/loadBoxes",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchBoxesProductPage();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const boxSlice = createSlice({
  name: "boxes",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadBoxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBoxes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadBoxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default boxSlice.reducer;
