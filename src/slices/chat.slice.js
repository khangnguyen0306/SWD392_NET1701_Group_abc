import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],
    },
    reducers: {
        receiveMessage: (state, action) => {
            state.messages.push(action.payload);
        },
    },
});

export const { receiveMessage } = chatSlice.actions;
export default chatSlice.reducer;
