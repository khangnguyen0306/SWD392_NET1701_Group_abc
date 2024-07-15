import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],
    },
    reducers: {
        addMessages: (state, action) => {
            state.messages = [...state.messages, ...action.payload];
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        }
    },
});

export const { addMessages, addMessage } = chatSlice.actions;

export const selectMessages = (state) => state.chat.messages;

export default chatSlice.reducer;
