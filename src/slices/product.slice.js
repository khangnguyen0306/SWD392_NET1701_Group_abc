import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = state.cart.findIndex(item => item.id === newItem.id);
      if (existingItemIndex !== -1) {
        state.cart[existingItemIndex].quantity += newItem.quantity;
      } else {
        state.cart.push(newItem);
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.cart = state.cart.filter(item => item.id !== itemId);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    loadCartFromLocalStorage: (state) => {
      const storedCart = JSON.parse(localStorage.getItem('cart'));
      if (storedCart) {
        state.cart = storedCart;
      }
    },
    updateCartQuantity: (state, action) => {
      const { id, change } = action.payload;
      const item = state.cart.find(item => item.id === id);
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
          state.cart = state.cart.filter(item => item.id !== id);
        }
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    clearPaidItems: (state, action) => {
      state.cart = state.cart.filter(item => !action.payload.includes(item.id));
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    
  },
});

export const { addToCart, removeFromCart, loadCartFromLocalStorage, updateCartQuantity,clearPaidItems } = productSlice.actions;
export const selectTotalProducts = state => state.product.cart.length;
export default productSlice.reducer;
