import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    exchange: null,
};

const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    setExchange: (state, action) => {
      state.exchange = action.payload;
    },
    clearExchange: (state) => {
      state.exchange = null;
    },
  },
});

export const { setExchange, clearExchange } = exchangeSlice.actions;
export default exchangeSlice.reducer;
