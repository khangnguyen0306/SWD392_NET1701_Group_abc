import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  userID: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userID = action.payload;
    },
    addToCart: (state, action) => {
      const { userID, newItem } = action.payload;
      const existingItemIndex = state.cart.findIndex(item => item.id === newItem.id);
      if (existingItemIndex !== -1) {
        state.cart[existingItemIndex].quantity += newItem.quantity;
      } else {
        state.cart.push(newItem);
      }
      if (userID) {
        localStorage.setItem(`cart_${userID}`, JSON.stringify(state.cart));
      }
    },
    removeFromCart: (state, action) => {
      const { userID, itemId } = action.payload;
      state.cart = state.cart.filter(item => item.id !== itemId);
      if (userID) {
        localStorage.setItem(`cart_${userID}`, JSON.stringify(state.cart));
      }
    },
    loadCartFromLocalStorage: (state, action) => {
      const { userID } = action.payload || {};
      if (userID) {
        const storedCart = JSON.parse(localStorage.getItem(`cart_${userID}`));
        if (storedCart) {
          state.cart = storedCart;
        }
      }
    },
    updateCartQuantity: (state, action) => {
      const { userID, id, change } = action.payload;
      const item = state.cart.find(item => item.id === id);
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
          state.cart = state.cart.filter(item => item.id !== id);
        }
      }
      if (userID) {
        localStorage.setItem(`cart_${userID}`, JSON.stringify(state.cart));
      }
    },
    clearPaidItems: (state, action) => {
      const { userID, itemIds } = action.payload;
      state.cart = state.cart.filter(item => !itemIds.includes(item.id));
      if (userID) {
        localStorage.setItem(`cart_${userID}`, JSON.stringify(state.cart));
      }
    },
    logOut: (state) => {
      state.userID = null;
      state.cart = [];
    },
  },
});

export const { setUser, addToCart, removeFromCart, loadCartFromLocalStorage, updateCartQuantity, clearPaidItems, logOut } = productSlice.actions;
export const selectTotalProducts = state => state.product.cart.length;

export const setUserAndCart = (userID) => (dispatch) => {
  dispatch(setUser(userID));
  dispatch(loadCartFromLocalStorage({ userID }));
};

export default productSlice.reducer;
