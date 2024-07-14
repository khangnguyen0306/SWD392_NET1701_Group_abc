import { createSlice } from "@reduxjs/toolkit";
import { appealApi } from "../services/appealAPI";

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const appealSlice = createSlice({
  name: "appeal",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(appealApi.endpoints.addAppeal.matchPending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addMatcher(appealApi.endpoints.addAppeal.matchFulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addMatcher(appealApi.endpoints.addAppeal.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.data || action.error.message;
      });
  },
});

export const { resetState } = appealSlice.actions;
export default appealSlice.reducer;
