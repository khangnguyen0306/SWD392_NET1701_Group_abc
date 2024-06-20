import { createSlice } from "@reduxjs/toolkit";
// import { forgotPasswordAPI } from "../services/forgotPasswordAPI";

const initialState = {
    loading: false,
    success: false,
    error: null,
};

const forgotPasswordSlice = createSlice({
    name: "forgotPassword",
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
            .addMatcher(forgotPasswordAPI.endpoints.sendResetEmail.matchPending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addMatcher(forgotPasswordAPI.endpoints.sendResetEmail.matchFulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addMatcher(forgotPasswordAPI.endpoints.sendResetEmail.matchRejected, (state, action) => {
                state.loading = false;
                state.error = action.error.data;
            });
    },
});

export const { resetState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
