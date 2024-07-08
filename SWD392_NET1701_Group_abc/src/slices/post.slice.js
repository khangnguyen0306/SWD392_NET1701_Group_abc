import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    post: null,
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setPost: (state, action) => {
            state.post = action.payload;
        },
        setPost: (state) => {
            state.post = null;
        },
    },
});

export const { setFlower, clearFlower } = postSlice.actions;
export default postSlice.reducer;
